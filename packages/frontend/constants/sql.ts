export const RECENT_CONTENTS = `
SELECT
  contents.*, directories.alias_path, thumbnails.data as thumbnail, collections.id as collection_id
FROM
  contents
LEFT JOIN
  directories ON contents.directory_id = directories.id
LEFT JOIN
  thumbnails ON contents.id = thumbnails.content_id
LEFT JOIN
  collections ON contents.id = collections.parent_id AND collections.unlink = 0
WHERE contents.unlink = 0 AND contents.id NOT IN (
  SELECT contents_collections.content_id 
  FROM collections
  RIGHT JOIN contents_collections ON collections.id = contents_collections.collection_id
  WHERE collections.unlink = 0 AND collections.parent_id != contents_collections.content_id
)
ORDER BY
  contents.created_at DESC;
`;

export const COLLECTION_CONTENTS_BY_COLLECTION_ID = `
SELECT
  cols.id as collection_id, contents_collections.order, contents.*, directories.alias_path, thumbnails.data as thumbnail
FROM
  (
    SELECT
      id, parent_id
    FROM
      collections
    WHERE
      parent_id IN (?) AND unlink = 0
  ) AS cols
RIGHT JOIN
  contents_collections ON cols.id = contents_collections.collection_id
LEFT JOIN
  contents ON contents_collections.content_id = contents.id
LEFT JOIN
  directories ON contents.directory_id = directories.id
LEFT JOIN
  thumbnails ON contents.id = thumbnails.content_id
WHERE
  cols.id IS NOT NULL
ORDER BY
  collection_id, contents_collections.order;
`;
