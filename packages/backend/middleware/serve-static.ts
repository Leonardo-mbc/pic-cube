import path from 'path';
import parseUrl from 'parseurl';
import send from 'send';
import { NextFunction, Request, Response } from 'express';

interface SendError {
  errno: number;
  code: string;
  path: string;
}

const metaDirectory = '/meta/';
const metaRefExp = new RegExp(/.*\/meta\//);

export function staticMiddleware(root: string) {
  return function serveStatic(req: Request, res: Response, next: NextFunction) {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.statusCode = 405;
      res.setHeader('Allow', 'GET, HEAD');
      res.setHeader('Content-Length', '0');
      res.end();
      return;
    }

    const pathname = parseUrl(req)?.pathname || '';
    const stream = send(req, pathname, { root: path.resolve(root), dotfiles: 'ignore' });
    stream.on('error', function error(err: SendError) {
      const metaDir = (err.path.match(metaRefExp) || [])[0];
      if (!metaDir) {
        return next();
      }

      const pathRelativeFromMetaDir = err.path.slice(metaDir.length);
      const targetFilePath = metaDir.slice(0, metaDir.length - metaDirectory.length);
      const targetBasename = path.basename(targetFilePath);
      const targetDir = path.dirname(targetFilePath);
      const actualPath = path.resolve(
        targetDir,
        '.meta.picc',
        targetBasename,
        pathRelativeFromMetaDir
      );
      send(req, actualPath).pipe(res).on('error', next);
    });

    stream.pipe(res);
  };
}
