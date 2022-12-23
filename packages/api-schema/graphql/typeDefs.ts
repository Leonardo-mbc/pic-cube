import path from 'path';
import { loadFilesSync } from '@graphql-tools/load-files';
import { mergeTypeDefs } from '@graphql-tools/merge';
import { typeDefs as scalarsTypeDefs } from 'graphql-scalars';

const typesArray = loadFilesSync(path.join(__dirname, './types'), { extensions: ['graphql'] });

export const typeDefs = mergeTypeDefs([scalarsTypeDefs, typesArray]);
