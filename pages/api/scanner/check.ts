import type { NextApiRequest, NextApiResponse } from 'next';
import { DBConfig, DirectoriesTable } from '../../../interfaces/db';
import { mysql, connect } from '../../../utilities/mysql-connect';
const { getScanners, startScanner } = require('../../../utilities/scanner-controller');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = req.body as DBConfig;

  try {
    await connect(config);

    const directoriesResult = await mysql.query('SELECT * FROM directories');
    const directories = JSON.parse(JSON.stringify(directoriesResult)) as DirectoriesTable[];

    await mysql.end();

    await Promise.all(
      directories.map((dir) =>
        startScanner({
          path: `${process.cwd()}/statics/${dir.alias_path}`,
          directoryId: dir.id,
          ignoreInitial: true,
        })
      )
    );

    res
      .status(200)
      .json({ message: `${Object.keys(getScanners()).length} 個の worker_thread を開始しました` });
  } catch (e) {
    console.error(e);
    res.status(400).json({ errorMessage: 'データベース接続エラー' });
    return;
  }
}
