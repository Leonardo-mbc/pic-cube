import {
  MutationAttachContentToCollectionArgs,
  MutationAttachContentsToCollectionArgs,
  MutationDetachContentFromCollectionArgs,
  MutationDetachContentsFromCollectionArgs,
} from '@pic-cube/api-schema/graphql/generated/server.type';
import {
  attachContentsToCollection,
  attachContentToCollection,
  detachContentFromCollection,
  detachContentsFromCollection,
} from '../services/collection.service';

export const attachContentToCollectionResolver = async (
  args: MutationAttachContentToCollectionArgs
) => {
  await attachContentToCollection({
    collectionId: args.collectionId,
    contentId: args.contentId,
    insertOrder: args.insertOrder || undefined,
  });
};

export const attachContentsToCollectionResolver = async (
  args: MutationAttachContentsToCollectionArgs
) => {
  await attachContentsToCollection({
    collectionId: args.collectionId,
    contentIds: args.contentIds,
    insertOrder: args.insertOrder || undefined,
  });
};

export const detachContentFromCollectionResolver = async (
  args: MutationDetachContentFromCollectionArgs
) => {
  await detachContentFromCollection(args);
};

export const detachContentsFromCollectionResolver = async (
  args: MutationDetachContentsFromCollectionArgs
) => {
  await detachContentsFromCollection(args);
};
