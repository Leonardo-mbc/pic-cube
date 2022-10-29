import { Resolvers } from '@pic-cube/api-schema/graphql/generated/server.type';
import {
  createContentAlbumResolver,
  createContentCollectionResolver,
  createContentFileResolver,
  geContentResolver,
  getContentsResolver,
} from './content.resolver';

export const resolvers: Resolvers = {
  Query: {
    Content: (_, args) => geContentResolver(args),
    Contents: (_, args) => getContentsResolver(args),
  },
  Mutation: {
    createCollection: (_, args) => createContentCollectionResolver(args),
    createAlbum: (_, args) => createContentAlbumResolver(args),
    createFile: (_, args) => createContentFileResolver(args),
  },
};
