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
  Collection as PrismaCollection,
  Content as PrismaContent,
  Album as PrismaAlbum,
  File as PrismaFile,
  CollectionContent,
  File,
} from '@prisma/client';
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

type ContentType = PrismaContent & {
  album?: PrismaAlbum[];
  file?: PrismaFile[];
  collection?: CollectionType[];
};

type CollectionType =
  | (PrismaCollection & {
      collectionContents: (CollectionContent & {
        content: PrismaContent & {
          file: File[];
        };
      })[];
    })
  | never;

const mapCollection = (collection: CollectionType | undefined) => {
  if (!collection) {
    return;
  }
  return {
    ...collection,
    contents: collection.collectionContents.map((collectionContent) => {
      return {
        id: collectionContent.content.id,
        name: collectionContent.content.name,
        type: collectionContent.content.type,
        removed: collectionContent.content.removed,
        lastAccessedAt: collectionContent.content.lastAccessedAt,
      };
    }),
  };
};

const mapContent = (content: ContentType) => {
  const collection = content.collection?.[0];
  return {
    id: content.id,
    name: content.name,
    type: content.type,
    removed: content.removed,
    lastAccessedAt: content.lastAccessedAt,
    collection: mapCollection(collection),
    album: content.album?.[0],
    file: content.file?.[0],
  };
};

export const geContentResolver = async (args: QueryContentArgs): Promise<Content> => {
  return mapContent(await getContentById(args));
};

export const getContentsResolver = async (args: QueryContentsArgs): Promise<Content[]> => {
  const contents = await getContents({
    limit: args.limit || undefined,
    offset: args.offset || undefined,
    removed: args.removed === null ? undefined : args.removed,
  });
  return contents.map(mapContent);
};

export const getContentsInCollectionResolver = async (
  args: QueryContentsInCollectionArgs
): Promise<Content[]> => {
  return (await getContentsInCollection(args)).map((collectionContent) =>
    mapContent(collectionContent.content)
  );
};

export const getContentsInAlbumResolver = async (
  args: QueryContentsInAlbumArgs
): Promise<Content[]> => {
  return (await await getContentsInAlbum(args)).map((albumContent) =>
    mapContent(albumContent.content)
  );
};

export const createContentCollectionResolver = async (
  args: MutationCreateCollectionArgs
): Promise<Content> => {
  const content = await createContentAsCollection({
    name: args.name,
    contentIds: args.contentIds || undefined,
  });
  return mapContent(content);
};

export const createContentAlbumResolver = async (
  args: MutationCreateAlbumArgs
): Promise<Content> => {
  return mapContent(await createContentAsAlbum(args));
};

export const createContentFileResolver = async (args: MutationCreateFileArgs): Promise<Content> => {
  return mapContent(await createContentAsFile(args));
};

export const removeContentResolver = async (args: MutationRemoveContentArgs): Promise<Content> => {
  return await removeContent(args);
};
