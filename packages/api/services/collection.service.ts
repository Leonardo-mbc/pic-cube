import { prisma } from '../utilities/prisma';

interface AttachContentToCollectionParams {
  collectionId: number;
  contentId: number;
  order?: number;
}

export async function attachContentToCollection(params: AttachContentToCollectionParams) {
  return await prisma.$transaction(
    async (prisma) => {
      const content = await prisma.content.findUniqueOrThrow({ where: { id: params.contentId } });
      if (content.type !== 'FILE') {
        throw new Error('Invalid content type');
      }

      if (await prisma.collectionContent.findFirst({ where: { contentId: params.contentId } })) {
        throw new Error('Its content has already attached to collection');
      }

      const collectionContents = await prisma.collectionContent.findMany({
        where: { collectionId: params.collectionId, contentId: params.contentId },
        orderBy: { order: 'asc' },
      });
      const order = params.order || collectionContents.length;
      if (collectionContents.length < order) {
        throw new Error('Invalid order');
      }
      if (order !== collectionContents.length) {
        // Update the order of exits collectionContents
        let nextOrder = order + 1;
        const followingCollectionContents = collectionContents.slice(
          order,
          collectionContents.length
        );
        for (const collectionContent of followingCollectionContents) {
          await prisma.collectionContent.update({
            data: { order: nextOrder },
            where: { id: collectionContent.id },
          });
          nextOrder += 1;
        }
      }

      await prisma.collectionContent.create({
        data: {
          collectionId: params.collectionId,
          contentId: params.contentId,
          order: params.order || 0,
          createdAt: new Date(),
        },
      });
    },
    { isolationLevel: 'Serializable' }
  );
}

interface DetachContentFromCollectionParams {
  collectionId: number;
  contentId: number;
}

export async function detachContentFromCollection(params: DetachContentFromCollectionParams) {
  await prisma.$transaction(
    async (prisma) => {
      const collectionContent = await prisma.collectionContent.findUniqueOrThrow({
        where: { collectionId: params.collectionId, contentId: params.collectionId },
      });

      let nextOrder = collectionContent.order;
      const collectionContents = await prisma.collectionContent.findMany({
        where: { collectionId: params.collectionId },
        orderBy: { order: 'asc' },
      });
      const followingCollectionContents = collectionContents.slice(
        nextOrder,
        collectionContents.length
      );
      for (const followingCollectionContent of followingCollectionContents) {
        await prisma.collectionContent.update({
          data: { order: nextOrder },
          where: { id: followingCollectionContent.id },
        });
        nextOrder += 1;
      }

      await prisma.collectionContent.delete({ where: { id: collectionContent.id } });
    },
    { isolationLevel: 'Serializable' }
  );
}
