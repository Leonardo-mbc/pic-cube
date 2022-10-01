import { ContentsWithChildItems, DBConfig, DirectoriesTable } from '../interfaces/db';

interface CheckResponse {
  tables: string[];
}

export async function check(config: DBConfig): Promise<CheckResponse> {
  const request = await fetch('/api/db/check', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  return await request.json();
}

interface CreateResponse {
  message: string;
}

export async function create(tables: string[]): Promise<CreateResponse> {
  const request = await fetch('/api/db/create', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tables }),
  });
  return await request.json();
}

interface AddDirectoryResponse {
  directories: DirectoriesTable[];
}

export async function addDirectory(path: string): Promise<AddDirectoryResponse> {
  const request = await fetch('/api/db/add-directory', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ path }),
  });

  return await request.json();
}

interface ListContentsResponse {
  contents: ContentsWithChildItems[];
}

export async function listContents(): Promise<ListContentsResponse> {
  const request = await fetch('/api/db/list-contents', {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await request.json();
}

interface UnlinkContentsResponse {
  message: string;
}

export async function unlinkContents(contentIds: number[]): Promise<UnlinkContentsResponse> {
  const request = await fetch('/api/db/unlink-contents', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contentIds }),
  });

  return await request.json();
}

interface BundleContentsResponse {
  message: string;
}

export async function bundleContents(
  contentIds: number[],
  collectionIds: number[],
  createdAt?: Date
): Promise<BundleContentsResponse> {
  const request = await fetch('/api/db/bundle-contents', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ contentIds, collectionIds, createdAt }),
  });

  return await request.json();
}
