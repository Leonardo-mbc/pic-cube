import {
  QueryDirectoriesArgs,
  QueryDirectoryArgs,
  MutationCreateDirectoryArgs,
} from '@pic-cube/api-schema/graphql/generated/server.type';
import { createDirectory, getDirectories, getDirectory } from '../services/directory.service';
import { prisma } from '../utilities/prisma';

export const getDirectoryResolver = async (args: QueryDirectoryArgs) => {
  return getDirectory(args);
};

export const getDirectoriesResolver = async (args: QueryDirectoriesArgs) => {
  return getDirectories({ limit: args.limit || undefined, offset: args.offset || undefined });
};

export const createDirectoryResolver = async (args: MutationCreateDirectoryArgs) => {
  return await createDirectory(args);
};
