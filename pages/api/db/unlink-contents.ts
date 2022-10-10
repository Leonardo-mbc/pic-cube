import type { NextApiRequest, NextApiResponse } from 'next';
import { UnlinkContentsParams } from '../../../interfaces/db';
import { mysql, connect } from '../../../utilities/mysql-connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { contentIds } = req.body as UnlinkContentsParams;

  try {
    await connect();

    await mysql.query('UPDATE contents SET unlink = 1 WHERE id IN (?)', [contentIds]);

    await mysql.end();

    res.status(200).json({ message: `${contentIds.length}件の削除が完了しました` });
  } catch (e) {
    console.error(e);
    res.status(400).json({ errorMessage: e });
    return;
  }
}
