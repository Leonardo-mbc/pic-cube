import workerpool from 'workerpool';
import chokidar from 'chokidar';
import nodePath from 'path';
import * as dotenv from 'dotenv';
import fs from 'fs';
import { createContentAsFile } from '../services/content.service';
import { MakeThumbnailResponse } from '../services/make-thumbnail.service';
import { isTargetExt } from '../utilities/extentions';

dotenv.config();

const basePath = process.env.SCANNER_BASE_PATH;
if (!basePath) {
  console.error('SCANNER_BASE_PATH NOT FOUND');
  process.exit();
}

const workersPool = workerpool.pool('./binaries/worker.js', {
  workerType: 'thread',
});

const watcher = chokidar.watch(basePath, {
  ignored: [/[\/\\]\./, /@eaDir\//],
  persistent: true,
  usePolling: true,
  interval: 10000,
  awaitWriteFinish: {
    stabilityThreshold: 2000,
    pollInterval: 100,
  },
});

console.log('[ADD SCANNER]', basePath);
watcher.on('all', async (event, path) => {
  console.log(`[SCAN:${event}]`, path);
  const { dir, base: filename, ext } = nodePath.parse(path);
  const relativePath = nodePath.relative(basePath, dir);

  if (!isTargetExt(ext)) {
    return;
  }

  switch (event) {
    case 'add': {
      try {
        const thumbnailResult: MakeThumbnailResponse = await workersPool.exec('makeThumbnail', [
          path,
          { outputMeta: true },
        ]);

        if (thumbnailResult.status === 'MT_STATUS_OUTPUT_META') {
          const fileInfo = await fs.promises.stat(path);
          await createContentAsFile({
            name: filename,
            path: relativePath,
            filename: filename,
            lastAccessedAt: fileInfo.atime,
            lastModifiedAt: fileInfo.mtime,
          });
        }
      } catch (e) {
        console.error(e);
      }
      break;
    }

    case 'change': {
      await workersPool.exec('makeThumbnail', [path, { outputMeta: true }]).catch(console.error);
      break;
    }

    case 'unlink': {
      break;
    }
  }
});
