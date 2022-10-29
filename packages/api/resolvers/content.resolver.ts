import {
  QueryContentArgs,
  QueryContentsArgs,
  MutationCreateCollectionArgs,
  MutationCreateAlbumArgs,
  MutationCreateFileArgs,
  Content,
} from '@pic-cube/api-schema/graphql/generated/server.type';
import {
  getContentById,
  getContents,
  createContentAsCollection,
  createContentAsAlbum,
  createContentAsFile,
} from '../services/content.service';

export const geContentResolver = async (args: QueryContentArgs): Promise<Content> => {
  const content = await getContentById(args);
  return {
    id: content.id,
    name: content.name,
    type: content.type,
    collection: content.collection[0],
    album: content.album[0],
    file: content.file[0],
  };
};

export const getContentsResolver = async (args: QueryContentsArgs) => {
  const contents = await getContents({
    limit: args.limit || undefined,
    offset: args.offset || undefined,
  });
  return contents.map((content) => ({
    id: content.id,
    name: content.name,
    type: content.type,
    collection: content.collection[0],
    album: content.album[0],
    file: content.file[0],
  }));
};

export const createContentCollectionResolver = async (args: MutationCreateCollectionArgs) => {
  const content = await createContentAsCollection(args);
  return {
    id: content.id,
    name: content.name,
    type: content.type,
    collection: content.collection[0],
  };
};

export const createContentAlbumResolver = async (args: MutationCreateAlbumArgs) => {
  const content = await createContentAsAlbum(args);
  return {
    id: content.id,
    name: content.name,
    type: content.type,
    album: content.album[0],
  };
};

export const createContentFileResolver = async (args: MutationCreateFileArgs) => {
  const content = await createContentAsFile(args);
  return {
    id: content.id,
    name: content.name,
    type: content.type,
    file: content.file[0],
  };
};
