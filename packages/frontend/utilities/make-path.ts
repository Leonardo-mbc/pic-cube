import type { ContentsTableWithCollections, ContentsWithChildItems } from '../interfaces/db';

export function makeContentPath(content: ContentsWithChildItems | ContentsTableWithCollections) {
  return `/static/${[content.alias_path, content.path, content.filename]
    .filter((c) => c !== '')
    .join('/')}`;
}
