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
}

export async function getContents(params: GetContentsParams) {
  return await prisma.content.findMany({
    take: params.limit,
    skip: params.offset,
    include: { collection: true, album: true, file: true },
  });
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
      createdAt,
      collection: {
        create: [{ lastAccessedAt: createdAt, lastModifiedAt: createdAt, createdAt }],
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
      createdAt,
      album: {
        create: [{ lastAccessedAt: createdAt, lastModifiedAt: createdAt, createdAt }],
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
      createdAt,
      file: {
        create: [
          {
            path: params.path,
            filename: params.filename,
            lastAccessedAt: params.lastAccessedAt,
            lastModifiedAt: params.lastModifiedAt,
            createdAt,
          },
        ],
      },
    },
    include: { file: true },
  });
}
