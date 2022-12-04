module.exports = {
  apps: [
    {
      name: 'api',
      script: './server.ts',
      cwd: './packages/backend',
      watch: ['./packages/backend'],
    },
    {
      name: 'scanners',
      script: './binaries/scanners/runner.js',
      cwd: './packages/backend',
      watch: ['./packages/backend'],
    },
    {
      name: 'frontend',
      script: 'yarn workspace @pic-cube/frontend dev',
      watch: [],
    },
  ],
};
