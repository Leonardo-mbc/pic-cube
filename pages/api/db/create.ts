import type { NextApiRequest, NextApiResponse } from 'next';
import { CREATE_TABLE } from '../../../constants/db';
import { CreateTables } from '../../../interfaces/db';
import { mysql, connect } from '../../../utilities/mysql-connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { tables } = req.body as CreateTables;

  try {
    if (tables && tables.length !== 0) {
      await connect();

      await Promise.all(tables.map((name) => mysql.query(CREATE_TABLE[name])));

      await mysql.end();

      res.status(201).json({ message: 'データベース作成完了' });
    } else {
      res.status(202).json({ message: 'データベース作成済み' });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({ errorMessage: 'データベース作成エラー' });
  }
}
