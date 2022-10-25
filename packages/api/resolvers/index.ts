import { Resolvers } from '@pic-cube/api-schema/graphql/generated/server.type';
import {
  createDirectoryResolver,
  getDirectoriesResolver,
  getDirectoryResolver,
} from './directory.resolver';

export const resolvers: Resolvers = {
  Query: {
    Directory: (_, args) => getDirectoryResolver(args),
    Directories: (_, args) => getDirectoriesResolver(args),
  },
  Mutation: {
    createDirectory: (_, args) => createDirectoryResolver(args),
  },
};
