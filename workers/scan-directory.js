const { workerData } = require('worker_threads');
const chokidar = require('chokidar');
const serverlessMysql = require('serverless-mysql');
const nodePath = require('path');

const mysql = serverlessMysql();
const { path: basePath, directoryId } = workerData;

const TARGET_EXT = ['.jpeg', '.jpg', '.png', '.bpm', '.gif'];

mysql.config({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const watcher = chokidar.watch(basePath, {
  ignored: [/[\/\\]\./, /@eaDir\//],
  persistent: true,
  usePolling: true,
  interval: 10000,
});

watcher.on('all', async (event, path) => {
  console.log(`SCAN_[${event}]`, path);
  const { dir, base: filename, ext } = nodePath.parse(path);

  if (!TARGET_EXT.includes(ext.toLowerCase())) {
    return;
  }

  switch (event) {
    case 'add': {
      const relativePath = nodePath.relative(basePath, dir);
      const pathFromBase = nodePath.join(relativePath, filename);

      await mysql.query('INSERT INTO contents (directory_id, path) values(?, ?);', [
        directoryId,
        pathFromBase,
      ]);
      break;
    }
  }
});
