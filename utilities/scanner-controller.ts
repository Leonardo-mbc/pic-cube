import { Worker } from 'worker_threads';
import { Configs } from '../interfaces/db';
import { mysql, connect } from './mysql-connect';

let runningScanners: { [key: string]: Worker } = {};

interface StartScanner {
  path: string;
  directoryId: number;
  ignoreInitial?: boolean;
}

async function startScanner(params: StartScanner) {
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
  setScanner(`${params.directoryId}-${params.path}`, worker);
}

function getScanners() {
  return runningScanners;
}

function setScanner(path: string, worker: Worker) {
  runningScanners[path] = worker;
}

async function stopScanners() {
  const scannerKeys = Object.keys(runningScanners);
  await Promise.all(
    scannerKeys.map((path) => {
      console.log('[STOP SCANNER]', path);
      return runningScanners[path].terminate();
    })
  );
  runningScanners = {};

  return scannerKeys.length;
}

// FIXME: module.exports にしないと、global 変数にならない
module.exports = {
  startScanner,
  getScanners,
  setScanner,
  stopScanners,
};
