import { prisma } from '../utilities/prisma';

interface GetContentByIdParams {
  id: number;
}

export async function getContentById(params: GetContentByIdParams) {
  return await prisma.content.findFirstOrThrow({
    where: { id: params.id },
    include: {
      collection: {
        include: { collectionContents: { include: { content: { include: { file: true } } } } },
      },
      album: true,
      file: true,
    },
  });
}

interface GetContentsParams {
  limit?: number;
  offset?: number;
  removed?: boolean;
}

export async function getContents(params: GetContentsParams) {
  const where = { removed: params.removed, contents: { none: {} } };
  return await prisma.$transaction([
    prisma.content.count({
      where,
    }),
    prisma.content.findMany({
      take: params.limit,
      skip: params.offset,
      where,
      include: {
        collection: {
          include: { collectionContents: { include: { content: { include: { file: true } } } } },
        },
        album: true,
        file: true,
      },
      orderBy: { lastAccessedAt: 'desc' },
    }),
  ]);
}

interface GetContentsInCollectionParams {
  collectionId: number;
}

export async function getContentsInCollection(params: GetContentsInCollectionParams) {
  return await prisma.collectionContent.findMany({
    where: { collectionId: params.collectionId },
    include: {
      content: {
        include: {
          collection: {
            include: { collectionContents: { include: { content: { include: { file: true } } } } },
          },
          album: true,
          file: true,
        },
      },
    },
  });
}

interface GetContentsInAlbumParams {
  albumId: number;
}

export async function getContentsInAlbum(params: GetContentsInAlbumParams) {
  return await prisma.albumContent.findMany({
    where: { albumId: params.albumId },
    include: {
      content: {
        include: {
          collection: {
            include: { collectionContents: { include: { content: { include: { file: true } } } } },
          },
          album: true,
          file: true,
        },
      },
    },
  });
}

interface CreateContentAsCollectionParams {
  name: string;
  contentIds?: number[];
}

export async function createContentAsCollection(params: CreateContentAsCollectionParams) {
  return await prisma.$transaction(
    async (prisma) => {
      const content = await prisma.content.create({
        data: {
          name: params.name,
          type: 'COLLECTION',
          collection: {
            create: {},
          },
        },
        include: {
          collection: {
            include: { collectionContents: { include: { content: { include: { file: true } } } } },
          },
        },
      });
      await prisma.collectionContent.createMany({
        data: (params.contentIds || []).map((contentId, index) => ({
          collectionId: content.collection[0].id,
          contentId,
          order: index,
        })),
      });
      return content;
    },
    { isolationLevel: 'ReadCommitted' }
  );
}

interface CreateContentAsAlbumParams {
  name: string;
}

export async function createContentAsAlbum(params: CreateContentAsAlbumParams) {
  return await prisma.content.create({
    data: {
      name: params.name,
      type: 'COLLECTION',
      album: {
        create: [{}],
      },
    },
    include: { album: true },
  });
}

interface CreateContentAsFileParams {
  name: string;
  path: string;
  filename: string;
  lastAccessedAt: Date;
  lastModifiedAt: Date;
}

export async function createContentAsFile(params: CreateContentAsFileParams) {
  return await prisma.content.create({
    data: {
      name: params.name,
      type: 'FILE',
      file: {
        create: [
          {
            path: params.path,
            filename: params.filename,
            fileLastAccessedAt: params.lastAccessedAt,
            fileLastModifiedAt: params.lastModifiedAt,
          },
        ],
      },
    },
    include: { file: true },
  });
}

interface RemoveContentParams {
  id: number;
}

export async function removeContent(params: RemoveContentParams) {
  return await prisma.$transaction(async (prisma) => {
    const content = await prisma.content.findFirstOrThrow({ where: { id: params.id } });
    switch (content.type) {
      case 'ALBUM':
      case 'COLLECTION':
        return await prisma.content.delete({ where: { id: content.id } });
        break;
      case 'FILE':
        return await prisma.content.update({ data: { removed: true }, where: { id: params.id } });
    }
  });
}
