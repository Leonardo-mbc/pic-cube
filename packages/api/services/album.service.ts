import { prisma } from '../utilities/prisma';

interface AttachContentToAlbumParams {
  albumId: number;
  contentId: number;
}

export async function attachContentToAlbum(params: AttachContentToAlbumParams) {
  await prisma.albumContent.create({
    data: {
      albumId: params.albumId,
      contentId: params.contentId,
      createdAt: new Date(),
    },
  });
}

interface DetachContentFromAlbumParams {
  albumId: number;
  contentId: number;
}

export async function detachContentFromAlbum(params: DetachContentFromAlbumParams) {
  await prisma.albumContent.deleteMany({
    where: { albumId: params.albumId, contentId: params.contentId },
  });
}
