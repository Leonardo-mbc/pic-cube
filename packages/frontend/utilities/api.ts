import { GraphQLClient } from 'graphql-request';
import { client } from '@pic-cube/api-schema';

const BASE_GRAPHQL_ENDPOINT = `${process.env.API_ENDPOINT}/graphql`;

const graphQLClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT);
export const sdk: client.Sdk = client.getSdk(graphQLClient);
