import { prisma } from '../utilities/prisma';

interface AttachContentToCollectionParams {
  collectionId: number;
  contentId: number;
  insertOrder?: number;
}

export async function attachContentToCollection(params: AttachContentToCollectionParams) {
  return await attachContentsToCollection({
    collectionId: params.collectionId,
    contentIds: [params.contentId],
    insertOrder: params.insertOrder,
  });
}

interface AttachContentsToCollectionParams {
  collectionId: number;
  contentIds: number[];
  insertOrder?: number;
}

export async function attachContentsToCollection(params: AttachContentsToCollectionParams) {
  return await prisma.$transaction(
    async (prisma) => {
      const contentsToBeInserted = await Promise.all(
        params.contentIds.map((contentId) =>
          prisma.content.findUniqueOrThrow({ where: { id: contentId } })
        )
      );
      for (const content of contentsToBeInserted) {
        if (content.type !== 'FILE') {
          throw new Error(`Invalid content type [contentId: ${content.id}]`);
        }
      }

      const collectionContents = await prisma.collectionContent.findMany({
        where: { collectionId: params.collectionId },
        orderBy: { order: 'asc' },
      });
      const insertOrder = params.insertOrder || collectionContents.length;
      if (collectionContents.length < insertOrder) {
        throw new Error('Invalid insertOrder');
      }
      if (insertOrder !== collectionContents.length) {
        // Update the order of exits collectionContents
        const followingCollectionContents = collectionContents.slice(
          insertOrder,
          collectionContents.length
        );
        let nextOrder = insertOrder + contentsToBeInserted.length;
        for (const collectionContent of followingCollectionContents) {
          await prisma.collectionContent.update({
            data: { order: nextOrder },
            where: { id: collectionContent.id },
          });
          nextOrder += 1;
        }
      }

      await Promise.all(
        contentsToBeInserted.map((content, index) =>
          prisma.collectionContent.create({
            data: {
              collectionId: params.collectionId,
              contentId: content.id,
              order: insertOrder + index,
            },
          })
        )
      );
    },
    { isolationLevel: 'Serializable' }
  );
}

interface DetachContentFromCollectionParams {
  collectionId: number;
  contentId: number;
}

export async function detachContentFromCollection(params: DetachContentFromCollectionParams) {
  return await detachContentsFromCollection({
    collectionId: params.collectionId,
    contentIds: [params.contentId],
  });
}

interface DetachContentsFromCollectionParams {
  collectionId: number;
  contentIds: number[];
}

export async function detachContentsFromCollection(params: DetachContentsFromCollectionParams) {
  await prisma.$transaction(
    async (prisma) => {
      const collectionContents = await prisma.collectionContent.findMany({
        where: { collectionId: params.collectionId },
        orderBy: { order: 'asc' },
      });

      await Promise.all(
        params.contentIds.map((contentId) =>
          prisma.collectionContent.delete({
            where: { contentId },
          })
        )
      );

      const collectionContentIdsToBeDeletedSet = new Set(params.contentIds);
      const remainingCollectionContents = collectionContents.filter(
        (collectionContent) => !collectionContentIdsToBeDeletedSet.has(collectionContent.contentId)
      );

      let nextOrder = 0;
      for (const collectionContent of remainingCollectionContents) {
        await prisma.collectionContent.update({
          data: { order: nextOrder },
          where: { id: collectionContent.id },
        });
        nextOrder += 1;
      }
    },
    { isolationLevel: 'Serializable' }
  );
}
