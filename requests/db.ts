import { DBConfig, DirectoriesTable } from '../interfaces/db';

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
