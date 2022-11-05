const dotenv = require('dotenv');
dotenv.config();

const SCANNER_BASE_PATH = process.env.SCANNER_BASE_PATH || '/app/imports';

module.exports = {
  apps: [
    {
      name: 'scanner',
      script: './scanners/runner.ts',
      env: {
        SCANNER_BASE_PATH,
      },
    },
  ],
};
