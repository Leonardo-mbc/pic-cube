const { workerData } = require('worker_threads');
const chokidar = require('chokidar');
const serverlessMysql = require('serverless-mysql');
const nodePath = require('path');
const ffmpeg = require('fluent-ffmpeg');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

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

      const [thumbBuffer, { insertId }] = await Promise.all([
        makeThumbnail(path),
        mysql.query('INSERT INTO contents (directory_id, path) values(?, ?);', [
          directoryId,
          pathFromBase,
        ]),
      ]);

      await mysql.query('INSERT INTO thumbnails SET ?;', {
        content_id: insertId,
        data: thumbBuffer,
      });

      break;
    }
  }
});

async function makeThumbnail(path, rectSize = 200) {
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
