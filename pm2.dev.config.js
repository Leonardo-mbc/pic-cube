module.exports = {
  apps: [
    {
      name: 'api',
      script: './server.ts',
      cwd: './packages/backend',
      watch: ['.', '../api-schema'],
    },
    {
      name: 'scanners',
      script: './binaries/scanners/runner.js',
      cwd: './packages/backend',
      watch: ['.', '../api-schema'],
    },
    {
      name: 'frontend',
      watch: ['../api-schema'],
      script: 'yarn workspace @pic-cube/frontend dev',
    },
  ],
};
