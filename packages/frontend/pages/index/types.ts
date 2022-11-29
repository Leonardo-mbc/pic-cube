import { ContentType } from '../../graphql/generated/client.type';

export interface ContentFile {
  path: string;
  filename: string;
}

export interface Content {
  id: number;
  name: string;
  type: ContentType;
  file?: ContentFile | null;
  collection?: {
    id: number;
    contents: { id: number; name: string; file?: ContentFile | null }[];
  } | null;
}
