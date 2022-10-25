import { prisma } from '../utilities/prisma';

interface GetDirectoryParams {
  id: number;
}

export async function getDirectory(params: GetDirectoryParams) {
  return await prisma.directory.findFirstOrThrow({ where: { id: params.id } });
}

interface GetDirectoriesParams {
  limit?: number;
  offset?: number;
}

export async function getDirectories(params: GetDirectoriesParams) {
  return await prisma.directory.findMany({ take: params.limit, skip: params.offset });
}

interface CreateDirectoryParams {
  label: string;
  path: string;
  aliasPath: string;
}

export async function createDirectory(params: CreateDirectoryParams) {
  return await prisma.directory.create({
    data: {
      label: params.label,
      path: params.path,
      aliasPath: params.aliasPath,
      createdAt: new Date(),
    },
  });
}
