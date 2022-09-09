const { workerData } = require('worker_threads');
const chokidar = require('chokidar');
const serverlessMysql = require('serverless-mysql');
const nodePath = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

const mysql = serverlessMysql();
const { path: basePath, directoryId, ignoreInitial, configs } = workerData;

const TARGET_EXT = ['.jpeg', '.jpg', '.png', '.bpm', '.gif'];

mysql.config({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

const watcher = chokidar.watch(basePath, {
  ignored: [/[\/\\]\./, /@eaDir\//],
  ignoreInitial: ignoreInitial || false,
  persistent: true,
  usePolling: true,
  interval: 10000,
});

console.log('[ADD SCANNER]', basePath);
watcher.on('all', async (event, path) => {
  console.log(`[SCAN:${event}]`, path);
  const { dir, base: filename, ext } = nodePath.parse(path);

  if (!TARGET_EXT.includes(ext.toLowerCase())) {
    return;
  }

  switch (event) {
    case 'add': {
      const relativePath = nodePath.relative(basePath, dir);
      const fileHash = await makeFileHash(path);

      if (configs.import.ignoreSameFileHash) {
        const sameHashFiles = await mysql.query('SELECT * FROM contents WHERE file_hash = ?;', [
          fileHash,
        ]);

        if (0 < sameHashFiles.length) {
          break;
        }
      }

      const [thumbBuffer, { insertId }] = await Promise.all([
        makeThumbnail(path),
        mysql.query(
          'INSERT INTO contents (directory_id, path, filename, file_hash) values(?, ?, ?, ?);',
          [directoryId, relativePath, filename, fileHash]
        ),
      ]);

      await mysql.query('INSERT INTO thumbnails SET ?;', {
        content_id: insertId,
        data: thumbBuffer,
      });

      break;
    }
  }
});

function makeThumbnail(path, rectSize = 200) {
  const outputPath = `/tmp/${uuidv4()}`;

  return new Promise((resolve, reject) => {
    ffmpeg(fs.createReadStream(path))
      .videoFilter([
        {
          filter: 'scale',
          options: `'if(lt(a,1/1),${rectSize},-1)':'if(lt(a,1/1),-1,${rectSize})'`,
        },
        { filter: 'crop', options: [rectSize, rectSize] },
      ])
      .outputOptions('-vframes 1')
      .outputOptions('-f image2pipe')
      .outputOptions('-vcodec mjpeg')
      .output(outputPath)
      .on('end', async () => {
        fs.readFile(outputPath, async (err, data) => {
          if (err) {
            reject(err);
          }
          fs.unlinkSync(outputPath);
          resolve(data);
        });
      })
      .run();
  });
}

function makeFileHash(path) {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(path);
    const sha512hash = crypto.createHash('sha512');
    sha512hash.setEncoding('hex');
    readStream.pipe(sha512hash);
    readStream.on('end', () => {
      resolve(sha512hash.read());
    });
    readStream.on('error', (e) => {
      reject(e);
    });
  });
}

function makeTextHash(text) {
  return crypto.createHash('sha512').update(text).digest('hex');
}
