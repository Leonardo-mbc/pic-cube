import workerpool from 'workerpool';
import chokidar from 'chokidar';
import nodePath from 'path';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { createContentAsFile } from '../services/content.service';
import { MakeThumbnailResponse } from '../services/make-thumbnail.service';

dotenv.config();

const basePath = process.env.SCANNER_BASE_PATH;
if (!basePath) {
  console.error('SCANNER_BASE_PATH NOT FOUND');
  process.exit();
}

const TARGET_EXT = new Set(['.jpeg', '.jpg', '.png', '.bpm']);

const workersPool = workerpool.pool('./binaries/worker.js', {
  workerType: 'thread',
});

const watcher = chokidar.watch(basePath, {
  ignored: [/[\/\\]\./, /@eaDir\//],
  persistent: true,
  usePolling: true,
  interval: 10000,
});

console.log('[ADD SCANNER]', basePath);
watcher.on('all', async (event, path) => {
  console.log(`[SCAN:${event}]`, path);
  const { dir, base: filename, ext } = nodePath.parse(path);
  const relativePath = nodePath.relative(basePath, dir);

  if (!TARGET_EXT.has(ext.toLowerCase())) {
    return;
  }

  switch (event) {
    case 'add': {
      const thumbnailResult: MakeThumbnailResponse = await workersPool
        .exec('makeThumbnail', [path, { outputMeta: true }])
        .catch(console.error);

      if (thumbnailResult.status === 'MT_STATUS_OUTPUT_META') {
        const fileInfo = await fs.promises.stat(path);
        await createContentAsFile({
          name: filename,
          path: path,
          filename: filename,
          lastAccessedAt: fileInfo.atime,
          lastModifiedAt: fileInfo.mtime,
        });
      }
      break;
    }

    case 'unlink': {
      break;
    }
  }
});
