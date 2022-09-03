const TABLE_THUMBNAILS = 'thumbnails';
const TABLE_CONTENTS = 'contents';
const TABLE_TAGS = 'tags';
const TABLE_ALBUMS = 'albums';
const TABLE_DIRECTORIES = 'directories';
const TABLE_CONTENTS_TAGS = 'contents_tags';
const TABLE_CONTENTS_ALBUMS = 'contents_albums';

export const TABLES = [
  TABLE_THUMBNAILS,
  TABLE_CONTENTS,
  TABLE_TAGS,
  TABLE_ALBUMS,
  TABLE_DIRECTORIES,
  TABLE_CONTENTS_TAGS,
  TABLE_CONTENTS_ALBUMS,
] as const;

export const CREATE_TABLE: { [key in typeof TABLES[number]]: string } = {
  [TABLE_THUMBNAILS]: `
    CREATE TABLE \`thumbnails\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`content_id\` int(10) UNSIGNED NOT NULL,
      \`path\` text NOT NULL,
      \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
      \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`id\`)
    );
  `,
  [TABLE_CONTENTS]: `
    CREATE TABLE \`contents\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`directory_id\` int(10) UNSIGNED NOT NULL,
      \`path\` text NOT NULL,
      \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
      \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`id\`)
    );
  `,
  [TABLE_TAGS]: `
    CREATE TABLE \`tags\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`tag\` varchar(256) NOT NULL,
      \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
      \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`id\`)
    );
  `,
  [TABLE_ALBUMS]: `
    CREATE TABLE \`albums\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`name\` varchar(256) NOT NULL,
      \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
      \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`id\`)
    );
  `,
  [TABLE_DIRECTORIES]: `
    CREATE TABLE \`directories\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`label\` varchar(256) NOT NULL,
      \`path\` varchar(256) NOT NULL UNIQUE,
      \`alias_path\` varchar(256) NOT NULL UNIQUE,
      \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
      \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`id\`)
    );
  `,
  [TABLE_CONTENTS_TAGS]: `
    CREATE TABLE \`contents_tags\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`content_id\` int(10) UNSIGNED NOT NULL,
      \`tag_id\` int(10) UNSIGNED NOT NULL,
      \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
      \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`content_tag_index\` (\`content_id\`,\`tag_id\`)
    );
  `,
  [TABLE_CONTENTS_ALBUMS]: `
    CREATE TABLE \`contents_albums\` (
      \`id\` int(10) UNSIGNED NOT NULL AUTO_INCREMENT,
      \`content_id\` int(10) UNSIGNED NOT NULL,
      \`album_id\` int(10) UNSIGNED NOT NULL,
      \`created_at\` timestamp NOT NULL DEFAULT current_timestamp(),
      \`updated_at\` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
      PRIMARY KEY (\`id\`),
      UNIQUE KEY \`content_album_index\` (\`content_id\`,\`album_id\`)
    );
  `,
};
