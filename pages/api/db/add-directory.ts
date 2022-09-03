import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import nodePath from 'path';
import { Worker } from 'worker_threads';
import punycode from 'punycode';
import { mysql, connect } from '../../../utilities/mysql-connect';

interface AddDirectoryParams {
  path: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.body as AddDirectoryParams;

  try {
    if (path) {
      await connect();

      const dirName = nodePath.parse(path).name;
      const decodedName = punycode.encode(dirName).replace(/\s+/g, '');
      const aliasPath = `${process.cwd()}/statics/${decodedName}`;

      const [sqlResult] = await Promise.all([
        mysql
          .query('INSERT INTO directories (label, path, alias_path) values(?, ?, ?);', [
            dirName,
            path,
            decodedName,
          ])
          .then(() => mysql.query('SELECT LAST_INSERT_ID() as directoryId;')),
        fs.promises.symlink(path, aliasPath, 'dir').catch((e) => {
          if (e.code !== 'EEXIST') {
            throw Error(e);
          }
        }),
      ]);

      const { directoryId } = (sqlResult as [{ directoryId: number }])[0];

      new Worker(`${process.cwd()}/workers/scan-directory.js`, {
        workerData: {
          path: aliasPath,
          directoryId,
        },
      });

      const directories = JSON.parse(
        JSON.stringify(await mysql.query('SELECT * FROM directories ORDER BY id ASC;'))
      );

      await mysql.end();

      res.status(200).json({ directories });
    } else {
      res.status(400).json({ message: '無効なパスです' });
    }
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e });
    return;
  }
}
