import {
  MutationAttachContentToCollectionArgs,
  MutationDetachContentFromCollectionArgs,
} from '@pic-cube/api-schema/graphql/generated/server.type';
import {
  attachContentToCollection,
  detachContentFromCollection,
} from '../services/collection.service';

export const attachContentToCollectionResolver = async (
  args: MutationAttachContentToCollectionArgs
) => {
  await attachContentToCollection({
    collectionId: args.collectionId,
    contentId: args.contentId,
    order: args.order || undefined,
  });
};

export const detachContentFromCollectionResolver = async (
  args: MutationDetachContentFromCollectionArgs
) => {
  await detachContentFromCollection(args);
};
