import { Worker } from 'worker_threads';
import { RUNNING_WORKERS } from '../constants/process';
import { Configs } from '../interfaces/db';
import { mysql, connect } from './mysql-connect';

interface StartScanner {
  path: string;
  directoryId: number;
  ignoreInitial?: boolean;
}

export async function startScanner(params: StartScanner) {
  await connect();

  const configsResult = await mysql.query('SELECT * FROM configs');
  const configs = JSON.parse(JSON.stringify(configsResult)).reduce(
    (p: { [key: string]: Object }, c: Configs) => {
      p[c.name] = JSON.parse(c.value);
      return p;
    },
    {}
  );

  const worker = new Worker(`${process.cwd()}/workers/scan-directory.js`, {
    workerData: { ...params, configs },
  });
  RUNNING_WORKERS.push(worker);
}
