import { Content } from '@prisma/client';
import { prisma } from '../utilities/prisma';

interface GetContentByIdParams {
  id: number;
}

export async function getContentById(params: GetContentByIdParams) {
  return await prisma.content.findFirstOrThrow({
    where: { id: params.id },
    include: { collection: true, album: true, file: true },
  });
}

interface GetContentsParams {
  limit?: number;
  offset?: number;
  removed?: boolean;
}

export async function getContents(params: GetContentsParams) {
  return await prisma.content.findMany({
    take: params.limit,
    skip: params.offset,
    where: { removed: params.removed },
    include: { collection: true, album: true, file: true },
    orderBy: { lastAccessedAt: 'desc' },
  });
}

interface GetContentsInCollectionParams {
  collectionId: number;
}

export async function getContentsInCollection(params: GetContentsInCollectionParams) {
  const collectionContents = await prisma.collectionContent.findMany({
    where: { collectionId: params.collectionId },
    include: { content: { include: { collection: true, album: true, file: true } } },
  });
  return collectionContents.map((collectionContent) => ({
    id: collectionContent.content.id,
    name: collectionContent.content.name,
    type: collectionContent.content.type,
    removed: collectionContent.content.removed,
    lastAccessedAt: collectionContent.content.lastAccessedAt,
    collection: collectionContent.content.collection[0],
    album: collectionContent.content.album[0],
    file: collectionContent.content.file[0],
  }));
}

interface GetContentsInAlbumParams {
  albumId: number;
}

export async function getContentsInAlbum(params: GetContentsInAlbumParams) {
  const albumContents = await prisma.albumContent.findMany({
    where: { albumId: params.albumId },
    include: { content: { include: { collection: true, album: true, file: true } } },
  });
  return albumContents.map((albumContent) => ({
    id: albumContent.content.id,
    name: albumContent.content.name,
    type: albumContent.content.type,
    removed: albumContent.content.removed,
    lastAccessedAt: albumContent.content.lastAccessedAt,
    collection: albumContent.content.collection[0],
    album: albumContent.content.album[0],
    file: albumContent.content.file[0],
  }));
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
        include: { collection: true },
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
  return await prisma.content.update({ data: { removed: true }, where: { id: params.id } });
}
