import type { NextApiRequest, NextApiResponse } from 'next';
import { COLLECTION_CONTENTS_BY_COLLECTION_ID, RECENT_CONTENTS } from '../../../constants/sql';
import {
  ContentsTableWithCollections,
  ContentsWithChildItems,
  DBConfig,
  DirectoriesTable,
} from '../../../interfaces/db';
import { mysql, connect } from '../../../utilities/mysql-connect';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const config = req.body as DBConfig;

  try {
    const { contents } = await listContents(config);

    res.status(200).json({ contents });
  } catch (e) {
    console.error(e);
    res.status(400).json({ errorMessage: 'コンテンツ取得エラー' });
    return;
  }
}

export async function listDirectories(config?: DBConfig) {
  await connect(config);

  const directoriesResult = await mysql.query('SELECT * FROM directories');
  const directories = JSON.parse(JSON.stringify(directoriesResult)) as DirectoriesTable[];

  await mysql.end();

  return {
    directories,
  };
}

export async function listContents(config?: DBConfig) {
  await connect(config);

  const contentsResult = await mysql.query(RECENT_CONTENTS);
  const contents = JSON.parse(JSON.stringify(contentsResult)) as ContentsTableWithCollections[];

  const parentIds = contents
    .filter((content) => content.collection_id)
    .map((content) => content.id);

  const collectionsResult = parentIds.length
    ? await mysql.query(COLLECTION_CONTENTS_BY_COLLECTION_ID, [parentIds])
    : [];
  const collections = JSON.parse(
    JSON.stringify(collectionsResult)
  ) as ContentsTableWithCollections[];

  const contentsWithCollections: ContentsWithChildItems[] = contents.map((content) => {
    return {
      ...content,
      contents: collections.filter(
        (collection) => collection.collection_id === content.collection_id
      ),
    };
  });

  await mysql.end();

  return {
    contents: contentsWithCollections,
  };
}
