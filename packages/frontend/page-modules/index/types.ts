import { client } from '@pic-cube/api-schema';

export interface ContentFile {
  path: string;
  filename: string;
}

export interface Content {
  id: number;
  name: string;
  type: client.ContentType;
  file?: ContentFile | null;
  collection?: {
    id: number;
    contents: { id: number; name: string; file?: ContentFile | null }[];
  } | null;
}
