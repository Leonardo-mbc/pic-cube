import type { NextApiRequest, NextApiResponse } from 'next';
import { DBConfig } from '../../../interfaces/db';
import { mysql, connect } from '../../../utilities/mysql-connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = req.body as DBConfig;

  try {
    await connect(config);

    const tables = await mysql.query('SHOW TABLES');
    const tableList = (tables as { [key: string]: string }[]).map((v) => Object.values(v)[0]);

    await mysql.end();

    res.status(200).json({ tables: tableList });
  } catch (e) {
    console.error(e);
    res.status(400).json({ errorMessage: 'データベース接続エラー' });
    return;
  }
}
