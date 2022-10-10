import dayjs from 'dayjs';
import type { NextApiRequest, NextApiResponse } from 'next';
import { BundleContentsParams } from '../../../interfaces/db';
import { mysql, connect } from '../../../utilities/mysql-connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { contentIds, collectionIds, createdAt } = req.body as BundleContentsParams;
  const [parentId] = contentIds;

  try {
    await connect();

    const createdAtForDB = dayjs(createdAt).format('YYYY-MM-DD HH:mm:ss.SSS');
    const [sqlResult] = await Promise.all([
      mysql
        .query('INSERT INTO collections (parent_id, quantity, created_at) values(?, ?, ?);', [
          parentId,
          contentIds.length,
          createdAtForDB,
        ])
        .then(() => mysql.query('SELECT LAST_INSERT_ID() as collectionId;')),
      collectionIds.length
        ? mysql.query('UPDATE collections SET unlink = 1 WHERE id IN (?)', [collectionIds])
        : null,
    ]);
    const { collectionId } = (sqlResult as [{ collectionId: number }])[0];

    await mysql.query(
      `INSERT IGNORE INTO contents_collections (collection_id, content_id, \`order\`) VALUES ${contentIds
        .map((contentId, order) => `(${[collectionId, contentId, order].join(',')})`)
        .join(',')}`
    );

    await mysql.end();

    res
      .status(200)
      .json({ message: `collectionId: ${collectionId} (${contentIds.length}) を作成しました` });
  } catch (e) {
    console.error(e);
    res.status(400).json({ errorMessage: e });
    return;
  }
}
