import type { NextApiRequest, NextApiResponse } from 'next';
const { stopScanners } = require('../../../utilities/scanner-controller');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const scannerCount = await stopScanners();
    res.status(200).json({ message: `${scannerCount} 個の worker_thread を停止しました` });
  } catch (e) {
    console.error(e);
    res.status(500).json({ errorMessage: 'データベース接続エラー' });
    return;
  }
}
