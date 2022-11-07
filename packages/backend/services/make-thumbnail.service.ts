import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';

export async function makeThumbnail(path: string, rectSize: number = 200) {
  const outputPath = `/tmp/${uuidv4()}`;
  const data = await new Promise((resolve, reject) => {
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
            console.error('FFMPEG_END_ERROR', path, err);
            reject(err);
          }
          fs.unlinkSync(outputPath);
          resolve(data);
        });
      })
      .on('error', (err) => {
        console.error('FFMPEG_ERROR', path, err);
        reject(err);
      })
      .run();
  });

  return data;
}
