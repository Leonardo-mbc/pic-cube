import { TABLES } from '../constants/db';

export interface DBConfig {
  dbHost: string;
  dbUser: string;
  dbPass: string;
  dbName: string;
}

export interface CreateTables {
  tables: typeof TABLES[number][];
}

export interface DirectoriesTable {
  id: number;
  label: string;
  path: string;
  alias_path: string;
  created_at: Date;
  updated_at: Date;
}

export interface ContentsTable {
  id: number;
  directory_id: number;
  path: string;
  filename: string;
  file_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface ContentsTableWithCollections extends ContentsTable {
  alias_path: string;
  thumbnail: { type: string; data: Uint8Array };
  collection_id: number | null;
  order: number;
}

export interface ContentsWithChildItems extends ContentsTableWithCollections {
  contents: ContentsTableWithCollections[];
}

export interface Configs {
  name: string;
  value: string;
  created_at: Date;
  updated_at: Date;
}

export interface UnlinkContentsParams {
  contentIds: number[];
}

export interface BundleContentsParams {
  contentIds: number[];
  collectionIds: number[];
  createdAt?: Date;
}
