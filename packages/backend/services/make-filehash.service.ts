import fs from 'fs';
import crypto from 'crypto';

export function makeFileHash(path: string): Promise<string> {
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
