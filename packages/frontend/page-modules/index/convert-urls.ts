export function convertUrls(content: {
  file?: { path: string; filename: string } | null;
  collection?: { contents: { file?: { path: string; filename: string } | null }[] } | null;
}): {
  filepath: string;
  thumbnailUrl: string;
} {
  if (content.file) {
    const filepath = `${process.env.API_ENDPOINT}/static/${content.file.path}/${content.file.filename}`;
    const thumbnailUrl = `${filepath}/meta/cover.jpg`;
    return { filepath, thumbnailUrl };
  }
  if (content.collection && content.collection.contents.length >= 1) {
    return convertUrls(content.collection.contents[0]);
  }
  return { filepath: '', thumbnailUrl: '' };
}
