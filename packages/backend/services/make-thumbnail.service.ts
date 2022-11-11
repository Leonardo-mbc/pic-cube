import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import nodePath from 'path';

const MT_STATUS_EXISTS = 'MT_STATUS_EXISTS';
const MT_STATUS_OUTPUT_META = 'MT_STATUS_OUTPUT_META';
const MT_STATUS_RETURN_BUFFER = 'MT_STATUS_RETURN_BUFFER';
const MT_STATUS_ERROR = 'MT_STATUS_ERROR';

interface MakeThumbnailOptions {
  rectSize?: number;
  outputMeta?: boolean;
}

interface MakeThumbnailExistsResponse {
  status: typeof MT_STATUS_EXISTS;
  containPath: string;
  coverPath: string;
}

interface MakeThumbnailOutputMetaResponse {
  status: typeof MT_STATUS_OUTPUT_META;
  containPath: string;
  coverPath: string;
}

interface MakeThumbnailReturnBufferResponse {
  status: typeof MT_STATUS_RETURN_BUFFER;
  containBuffer: Buffer;
  coverBuffer: Buffer;
}

interface MakeThumbnailErrorResponse {
  status: typeof MT_STATUS_ERROR;
  errorMessage: string;
}

export type MakeThumbnailResponse =
  | MakeThumbnailExistsResponse
  | MakeThumbnailOutputMetaResponse
  | MakeThumbnailReturnBufferResponse
  | MakeThumbnailErrorResponse;

const META_DIR_NAME = '.meta.picc';
const DEFAULT_OPTIONS = {
  rectSize: 400,
  outputMeta: false,
};

export async function makeThumbnail(
  path: string,
  options: MakeThumbnailOptions
): Promise<MakeThumbnailResponse> {
  const { rectSize, outputMeta } = { ...DEFAULT_OPTIONS, ...options };
  const { dir, base: filename, ext } = nodePath.parse(path);

  const metaDir = outputMeta ? nodePath.join(dir, META_DIR_NAME, filename) : `/tmp/${uuidv4()}`;
  const containPath = `${metaDir}/contain.jpg`;
  const coverPath = `${metaDir}/cover.jpg`;

  return new Promise((resolve, reject) => {
    if (!fs.existsSync(metaDir)) {
      fs.mkdirSync(metaDir, { recursive: true });
    }

    if (outputMeta && fs.existsSync(containPath) && fs.existsSync(coverPath)) {
      console.log('[MAKE_THUMB:EXISTS]', metaDir);
      return resolve({
        status: MT_STATUS_EXISTS,
        containPath,
        coverPath,
      });
    }

    ffmpeg(fs.createReadStream(path))
      .complexFilter([
        {
          filter: 'scale',
          options: `'if(lt(a,1),-1,${rectSize})':'if(lt(a,1),${rectSize},-1)'`,
          inputs: ['0:v'],
          outputs: ['contain'],
        },
        {
          filter: 'scale',
          options: `'if(lt(a,1/1),${rectSize},-1)':'if(lt(a,1/1),-1,${rectSize})'`,
          inputs: ['0:v'],
          outputs: ['cover'],
        },
        {
          filter: 'crop',
          options: [rectSize, rectSize],
          inputs: ['cover'],
          outputs: ['cover'],
        },
      ])
      .output(containPath)
      .map('contain')
      .videoCodec('mjpeg')
      .outputOptions('-vframes 1')
      .outputOptions('-pix_fmt yuv420p')
      .outputOptions('-f image2pipe')

      .output(coverPath)
      .map('cover')
      .videoCodec('mjpeg')
      .outputOptions('-vframes 1')
      .outputOptions('-pix_fmt yuv420p')
      .outputOptions('-f image2pipe')

      .on('error', (errorMessage) => {
        console.error('[MAKE_THUMB:FFMPEG_ERROR]', path, errorMessage);
        return reject({
          status: MT_STATUS_ERROR,
          errorMessage,
        });
      })
      .on('end', async () => {
        if (outputMeta) {
          console.log('[MAKE_THUMB:OUTPUT_META]', metaDir);
          return resolve({
            status: MT_STATUS_OUTPUT_META,
            containPath,
            coverPath,
          });
        }

        const [containBuffer, coverBuffer] = await Promise.all([
          fs.promises.readFile(containPath),
          fs.promises.readFile(coverPath),
        ]);

        fs.rmSync(metaDir, { recursive: true, force: true });

        console.log('[MAKE_THUMB:RETURN_BUFFER]', metaDir);
        return resolve({
          status: MT_STATUS_RETURN_BUFFER,
          containBuffer,
          coverBuffer,
        });
      })
      .run();
  });
}
