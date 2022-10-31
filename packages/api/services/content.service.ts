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
    include: { content: true },
  });
  return collectionContents.map((collectionContent) => collectionContent.content);
}

interface GetContentsInAlbumParams {
  albumId: number;
}

export async function getContentsInAlbum(params: GetContentsInAlbumParams) {
  const albumContents = await prisma.albumContent.findMany({
    where: { albumId: params.albumId },
    include: { content: true },
  });
  return albumContents.map((albumContent) => albumContent.content);
}

interface CreateContentAsCollectionParams {
  name: string;
}

export async function createContentAsCollection(params: CreateContentAsCollectionParams) {
  const createdAt = new Date();
  return await prisma.content.create({
    data: {
      name: params.name,
      type: 'COLLECTION',
      lastAccessedAt: createdAt,
      collection: {
        create: [{ lastAccessedAt: createdAt, lastModifiedAt: createdAt }],
      },
    },
    include: { collection: true },
  });
}

interface CreateContentAsAlbumParams {
  name: string;
}

export async function createContentAsAlbum(params: CreateContentAsAlbumParams) {
  const createdAt = new Date();
  return await prisma.content.create({
    data: {
      name: params.name,
      type: 'COLLECTION',
      lastAccessedAt: createdAt,
      album: {
        create: [{ lastAccessedAt: createdAt, lastModifiedAt: createdAt }],
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
  const createdAt = new Date();
  return await prisma.content.create({
    data: {
      name: params.name,
      type: 'FILE',
      lastAccessedAt: createdAt,
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

interface RemoveContentPramas {
  id: number;
}

export async function removeContent(params: RemoveContentPramas) {
  return await prisma.content.update({ data: { removed: true }, where: { id: params.id } });
}
