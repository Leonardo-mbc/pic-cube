const EXT_IMAGE = new Set(['.jpeg', '.jpg', '.png', '.bpm', '.gif']);
const EXT_VIDEO = new Set([
  '.mp4',
  '.mov',
  '.avi',
  '.wmv',
  '.mkv',
  '.m1v',
  '.m4v',
  '.flv',
  '.mpg',
  '.mpeg',
  '.3gp',
  '.rm',
  '.vob',
]);
const TARGET_EXT = new Set([...EXT_IMAGE, ...EXT_VIDEO]);

export function isTargetExt(ext: string) {
  return TARGET_EXT.has(ext.toLowerCase());
}

export function isImageExt(ext: string) {
  return EXT_IMAGE.has(ext.toLowerCase());
}

export function isVideoExt(ext: string) {
  return EXT_VIDEO.has(ext.toLowerCase());
}
