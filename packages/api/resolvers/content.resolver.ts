import {
  QueryContentArgs,
  QueryContentsArgs,
  MutationCreateCollectionArgs,
  MutationCreateAlbumArgs,
  MutationCreateFileArgs,
  Content,
  MutationRemoveContentArgs,
  QueryContentsInCollectionArgs,
  QueryContentsInAlbumArgs,
} from '@pic-cube/api-schema/graphql/generated/server.type';
import {
  getContentById,
  getContents,
  createContentAsCollection,
  createContentAsAlbum,
  createContentAsFile,
  removeContent,
  getContentsInCollection,
  getContentsInAlbum,
} from '../services/content.service';

export const geContentResolver = async (args: QueryContentArgs): Promise<Content> => {
  const content = await getContentById(args);
  return {
    id: content.id,
    name: content.name,
    type: content.type,
    removed: content.removed,
    lastAccessedAt: content.lastAccessedAt,
    collection: content.collection[0],
    album: content.album[0],
    file: content.file[0],
  };
};

export const getContentsResolver = async (args: QueryContentsArgs): Promise<Content[]> => {
  const contents = await getContents({
    limit: args.limit || undefined,
    offset: args.offset || undefined,
    removed: args.removed === null ? undefined : args.removed,
  });
  return contents.map((content) => ({
    id: content.id,
    name: content.name,
    type: content.type,
    removed: content.removed,
    lastAccessedAt: content.lastAccessedAt,
    collection: content.collection[0],
    album: content.album[0],
    file: content.file[0],
  }));
};

export const getContentsInCollectionResolver = async (
  args: QueryContentsInCollectionArgs
): Promise<Content[]> => {
  return await getContentsInCollection(args);
};

export const getContentsInAlbumResolver = async (
  args: QueryContentsInAlbumArgs
): Promise<Content[]> => {
  return await getContentsInAlbum(args);
};

export const createContentCollectionResolver = async (
  args: MutationCreateCollectionArgs
): Promise<Content> => {
  const content = await createContentAsCollection(args);
  return {
    id: content.id,
    name: content.name,
    type: content.type,
    removed: content.removed,
    lastAccessedAt: content.lastAccessedAt,
    collection: content.collection[0],
  };
};

export const createContentAlbumResolver = async (
  args: MutationCreateAlbumArgs
): Promise<Content> => {
  const content = await createContentAsAlbum(args);
  return {
    id: content.id,
    name: content.name,
    type: content.type,
    removed: content.removed,
    lastAccessedAt: content.lastAccessedAt,
    album: content.album[0],
  };
};

export const createContentFileResolver = async (args: MutationCreateFileArgs): Promise<Content> => {
  const content = await createContentAsFile(args);
  return {
    id: content.id,
    name: content.name,
    type: content.type,
    removed: content.removed,
    lastAccessedAt: content.lastAccessedAt,
    file: content.file[0],
  };
};

export const removeContentResolver = async (args: MutationRemoveContentArgs): Promise<Content> => {
  return await removeContent(args);
};
