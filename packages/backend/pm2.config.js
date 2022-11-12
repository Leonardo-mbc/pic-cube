const dotenv = require('dotenv');
dotenv.config();

const SCANNER_BASE_PATH = process.env.SCANNER_BASE_PATH || '/app/imports';

module.exports = {
  apps: [
    {
      name: 'api',
      script: './server.ts',
    },
    {
      name: 'scanners',
      script: './binaries/scanners/runner.js',
      env: {
        SCANNER_BASE_PATH,
      },
    },
  ],
};