import { Resolvers } from '@pic-cube/api-schema/graphql/generated/server.type';
import { attachContentToAlbumResolver, detachContentFromAlbumResolver } from './album.resolver';
import {
  attachContentsToCollectionResolver,
  attachContentToCollectionResolver,
  detachContentFromCollectionResolver,
  detachContentsFromCollectionResolver,
} from './collection.resolver';
import {
  createContentAlbumResolver,
  createContentCollectionResolver,
  createContentFileResolver,
  geContentResolver,
  getContentsInAlbumResolver,
  getContentsInCollectionResolver,
  getContentsResolver,
  removeContentResolver,
} from './content.resolver';

export const resolvers: Resolvers = {
  Query: {
    Content: (_, args) => geContentResolver(args),
    Contents: (_, args) => getContentsResolver(args),
    ContentsInCollection: (_, args) => getContentsInCollectionResolver(args),
    ContentsInAlbum: (_, args) => getContentsInAlbumResolver(args),
  },
  Mutation: {
    createCollection: (_, args) => createContentCollectionResolver(args),
    createAlbum: (_, args) => createContentAlbumResolver(args),
    createFile: (_, args) => createContentFileResolver(args),
    removeContent: (_, args) => removeContentResolver(args),
    attachContentToCollection: (_, args) => attachContentToCollectionResolver(args),
    attachContentsToCollection: (_, args) => attachContentsToCollectionResolver(args),
    detachContentFromCollection: (_, args) => detachContentFromCollectionResolver(args),
    attachContentToAlbum: (_, args) => attachContentToAlbumResolver(args),
    detachContentFromAlbum: (_, args) => detachContentFromAlbumResolver(args),
    detachContentsFromCollection: (_, args) => detachContentsFromCollectionResolver(args),
  },
};
