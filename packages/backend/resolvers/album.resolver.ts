import {
  MutationAttachContentToAlbumArgs,
  MutationDetachContentFromAlbumArgs,
} from '@pic-cube/api-schema/graphql/generated/server.type';
import { attachContentToAlbum, detachContentFromAlbum } from '../services/album.service';

export const attachContentToAlbumResolver = async (args: MutationAttachContentToAlbumArgs) => {
  await attachContentToAlbum(args);
};

export const detachContentFromAlbumResolver = async (args: MutationDetachContentFromAlbumArgs) => {
  await detachContentFromAlbum(args);
};
