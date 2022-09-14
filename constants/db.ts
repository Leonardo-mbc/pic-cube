import { INITIAL_CONFIGS } from './initial-configs';

const TABLE_THUMBNAILS = 'thumbnails';
const TABLE_CONTENTS = 'contents';
const TABLE_TAGS = 'tags';
const TABLE_ALBUMS = 'albums';
const TABLE_DIRECTORIES = 'directories';
const TABLE_CONFIGS = 'configs';
const TABLE_CONTENTS_TAGS = 'contents_tags';
const TABLE_CONTENTS_ALBUMS = 'contents_albums';

export const TABLES = [
  TABLE_THUMBNAILS,
  TABLE_CONTENTS,
  TABLE_TAGS,
  TABLE_ALBUMS,
  TABLE_DIRECTORIES,
  TABLE_CONFIGS,
  TABLE_CONTENTS_TAGS,
  TABLE_CONTENTS_ALBUMS,
] as const;

export const CREATE_TABLE: { [key in typeof TABLES[number]]: string } = {
  [TABLE_THUMBNAILS]: `
    CREATE TABLE \`thumbnails\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`content_id\` int(10) UNSIGNED NOT NULL,
      \`data\` MEDIUMBLOB NULL,
      \`created_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`updated_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
      PRIMARY KEY (\`id\`),
      INDEX \`content_id_index\` (\`content_id\`) 
    );
  `,
  [TABLE_CONTENTS]: `
    CREATE TABLE \`contents\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`directory_id\` int(10) UNSIGNED NOT NULL,
      \`path\` text NOT NULL,
      \`filename\` text NOT NULL,
      \`file_hash\` CHAR(128) NOT NULL,
      \`unlink\` BOOL NOT NULL DEFAULT 0,
      \`last_accessed_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`last_modified_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`last_changed_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`created_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`updated_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
      PRIMARY KEY (\`id\`),
      INDEX \`directory_id_index\` (\`directory_id\`),
      INDEX \`file_hash_index\` (\`file_hash\`)
    );
  `,
  [TABLE_TAGS]: `
    CREATE TABLE \`tags\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`tag\` varchar(256) NOT NULL,
      \`created_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`updated_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
      PRIMARY KEY (\`id\`)
    );
  `,
  [TABLE_ALBUMS]: `
    CREATE TABLE \`albums\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`name\` varchar(256) NOT NULL,
      \`created_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`updated_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
      PRIMARY KEY (\`id\`)
    );
  `,
  [TABLE_DIRECTORIES]: `
    CREATE TABLE \`directories\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`label\` varchar(256) NOT NULL,
      \`path\` varchar(256) NOT NULL UNIQUE,
      \`alias_path\` varchar(256) NOT NULL UNIQUE,
      \`created_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`updated_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
      PRIMARY KEY (\`id\`)
    );
  `,
  [TABLE_CONFIGS]: `
    CREATE TABLE \`configs\` (
      \`name\` CHAR(64) NOT NULL,
      \`value\` JSON NOT NULL,
      \`created_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`updated_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
      PRIMARY KEY (\`name\`)
    )`,
  [TABLE_CONTENTS_TAGS]: `
    CREATE TABLE \`contents_tags\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`content_id\` int(10) UNSIGNED NOT NULL,
      \`tag_id\` int(10) UNSIGNED NOT NULL,
      \`created_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`updated_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`content_tag_index\` (\`content_id\`,\`tag_id\`)
    );
  `,
  [TABLE_CONTENTS_ALBUMS]: `
    CREATE TABLE \`contents_albums\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`content_id\` int(10) UNSIGNED NOT NULL,
      \`album_id\` int(10) UNSIGNED NOT NULL,
      \`created_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3),
      \`updated_at\` timestamp(3) NOT NULL DEFAULT current_timestamp(3) ON UPDATE current_timestamp(3),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`content_album_index\` (\`content_id\`,\`album_id\`)
    );
  `,
};

export const INSERT_INITIAL_VALUES: string[] = [
  `
    INSERT INTO \`configs\`
    (\`name\`, \`value\`) VALUES ${Object.keys(INITIAL_CONFIGS)
      .map((key) => `(${[`'${key}'`, `'${JSON.stringify(INITIAL_CONFIGS[key])}'`].join(',')})`)
      .join(',')}
  `,
];
