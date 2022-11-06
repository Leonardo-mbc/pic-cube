import workerpool from 'workerpool';
import chokidar from 'chokidar';
import nodePath from 'path';
import * as dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const basePath = process.env.SCANNER_BASE_PATH;
if (!basePath) {
  console.error('SCANNER_BASE_PATH NOT FOUND');
  process.exit();
}

const TARGET_EXT = new Set(['.jpeg', '.jpg', '.png', '.bpm', '.gif']);

const makeThumbPool = workerpool.pool(__dirname + '/executables/make-thumbnail.js', {
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
      const fileInfo = await fs.promises.stat(path);

      const thumbBuffer = await makeThumbPool.exec('makeThumbnail', [path, 200]).catch((err) => {
        console.error(err);
      });
      console.log('thumbBuffer', thumbBuffer);
      break;
    }

    case 'unlink': {
      break;
    }
  }
});
