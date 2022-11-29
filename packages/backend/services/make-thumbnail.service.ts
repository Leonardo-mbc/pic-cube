import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import ffmpeg from 'fluent-ffmpeg';
import nodePath from 'path';
import getColors from 'get-image-colors';
import { makeFileHash } from './make-filehash.service';
import { isVideoExt } from '../utilities/extentions';

const MT_STATUS_EXISTS = 'MT_STATUS_EXISTS';
const MT_STATUS_OUTPUT_META = 'MT_STATUS_OUTPUT_META';
const MT_STATUS_RETURN_BUFFER = 'MT_STATUS_RETURN_BUFFER';
const MT_STATUS_ERROR = 'MT_STATUS_ERROR';

interface MakeThumbnailOptions {
  rectSize?: number;
  seekTo?: number;
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
  seekTo: 0,
  outputMeta: false,
};

export async function makeThumbnail(
  path: string,
  options: MakeThumbnailOptions
): Promise<MakeThumbnailResponse> {
  const { rectSize, seekTo, outputMeta } = { ...DEFAULT_OPTIONS, ...options };
  const { dir, base: filename, ext } = nodePath.parse(path);

  const metaDir = outputMeta ? nodePath.join(dir, META_DIR_NAME, filename) : `/tmp/${uuidv4()}`;

  const containPath = `${metaDir}/contain.jpg`;
  const coverPath = `${metaDir}/cover.jpg`;
  const hashPath = `${metaDir}/filehash.dat`;

  try {
    await fs.promises.access(metaDir, fs.constants.R_OK);
  } catch (_) {
    await fs.promises.mkdir(metaDir, { recursive: true });
  }

  if (outputMeta) {
    try {
      await Promise.all([
        fs.promises.access(containPath, fs.constants.R_OK),
        fs.promises.access(coverPath, fs.constants.R_OK),
        fs.promises.access(hashPath, fs.constants.R_OK),
      ]);
      // サムネイルファイルが存在

      const [fileHash, existsHash] = await Promise.all([
        makeFileHash(path),
        fs.promises.readFile(hashPath, 'utf-8'),
      ]);

      if (fileHash === existsHash) {
        console.log('[MAKE_THUMB:EXISTS]', metaDir);
        return {
          status: MT_STATUS_EXISTS,
          containPath,
          coverPath,
        };
      }
    } catch (_) {
      // サムネイルが未作成、後述処理に続く
    }
  }

  function runFFmpeg(seekTo: number): Promise<MakeThumbnailResponse> {
    return new Promise(async (resolve, reject) => {
      const ffmpegCommand = isVideoExt(ext) ? ffmpeg(path).seekInput(seekTo) : ffmpeg(path);

      ffmpegCommand
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

        .on('error', reject)
        .on('end', resolve)
        .run();
    });
  }

  if (outputMeta) {
    // サムネイルを meta ディレクトリに出力する処理
    let lightnessAverage: number;
    let nextSeekTo = seekTo;

    do {
      try {
        await runFFmpeg(nextSeekTo);
      } catch (errorMessage) {
        console.error('[MAKE_THUMB:FFMPEG_ERROR]', path, errorMessage);

        return {
          status: MT_STATUS_ERROR,
          errorMessage: errorMessage as string,
        };
      }

      const colors = await getColors(containPath, {
        count: 10,
        type: 'image/jpg',
      });
      lightnessAverage = colors.reduce((prev, color) => prev + color.hsl()[2] / 10, 0);
      console.log('[MAKE_THUMB:CHECK_LIGHTNESS]', metaDir, nextSeekTo, lightnessAverage);
      nextSeekTo += 1;
    } while (
      isVideoExt(ext) &&
      (lightnessAverage < 0.4 || lightnessAverage > 0.8) &&
      nextSeekTo < 5
    );

    try {
      await fs.promises.writeFile(hashPath, await makeFileHash(path));

      return {
        status: MT_STATUS_OUTPUT_META,
        containPath,
        coverPath,
      };
    } catch (errorMessage) {
      console.error('[MAKE_THUMB:WRITE_FILEHASH_ERROR]', path, errorMessage);

      return {
        status: MT_STATUS_ERROR,
        errorMessage: errorMessage as string,
      };
    }
  } else {
    // ファイルを出力せず Buffer で return する処理
    try {
      await runFFmpeg(seekTo);
    } catch (errorMessage) {
      console.error('[MAKE_THUMB:FFMPEG_ERROR]', path, errorMessage);

      return {
        status: MT_STATUS_ERROR,
        errorMessage: errorMessage as string,
      };
    }

    const [containBuffer, coverBuffer] = await Promise.all([
      fs.promises.readFile(containPath),
      fs.promises.readFile(coverPath),
    ]);

    try {
      await fs.promises.rm(metaDir, { recursive: true, force: true });
      console.log('[MAKE_THUMB:RETURN_BUFFER]', metaDir);

      return {
        status: MT_STATUS_RETURN_BUFFER,
        containBuffer,
        coverBuffer,
      };
    } catch (errorMessage) {
      console.error('[MAKE_THUMB:REMOVE_TEMPDIR_ERROR]', path, errorMessage);

      return {
        status: MT_STATUS_ERROR,
        errorMessage: errorMessage as string,
      };
    }
  }
}
