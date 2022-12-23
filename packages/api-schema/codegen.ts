import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: './graphql/types/**/*.graphql',
  generates: {
    './graphql/generated/server.type.ts': {
      plugins: ['typescript', 'typescript-resolvers'],
      config: {
        enumsAsConst: true,
      },
    },
    './graphql/generated/client.type.ts': {
      documents: './graphql/**/*.graphql',
      plugins: ['typescript', 'typescript-operations', 'typescript-graphql-request'],
      config: {
        enumsAsConst: true,
      },
    },
  },
};

export default config;
