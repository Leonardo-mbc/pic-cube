module.exports = {
  apps: [
    {
      name: 'api',
      script: './server.ts',
      cwd: './packages/backend',
    },
    {
      name: 'scanners',
      script: './binaries/scanners/runner.js',
      cwd: './packages/backend',
    },
    {
      name: 'frontend',
      script: 'yarn workspace @pic-cube/frontend start',
    },
  ],
};
