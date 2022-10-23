import type { NextApiRequest, NextApiResponse } from 'next';
import { DBConfig } from '../../../interfaces/db';
import { mysql, connect } from '../../../utilities/mysql-connect';
import * as DB from '../../../constants/db';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = req.body as DBConfig;

  try {
    const tables = await getTableList(config);

    res.status(200).json({ tables });
  } catch (e) {
    console.error(e);
    res.status(400).json({ errorMessage: 'データベース接続エラー' });
    return;
  }
}

async function getTableList(config?: DBConfig) {
  await connect(config);

  const tables = await mysql.query('SHOW TABLES');
  const tableList = (tables as { [key: string]: string }[]).map((v) => Object.values(v)[0]);

  await mysql.end();

  return tableList;
}

export async function checkTables(config?: DBConfig) {
  const tableList = await getTableList(config);
  const missingTables = DB.TABLES.filter((tableName) => !tableList.includes(tableName));
  return !missingTables.length;
}
