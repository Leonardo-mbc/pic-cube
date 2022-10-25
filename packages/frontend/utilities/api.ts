import { GraphQLClient } from 'graphql-request';
import { getSdk, Sdk } from '../graphql/generated/client.type';

const BASE_GRAPHQL_ENDPOINT = `${process.env.API_ENDPOINT}/graphql`;

const graphQLClient = new GraphQLClient(BASE_GRAPHQL_ENDPOINT);
export const sdk: Sdk = getSdk(graphQLClient);
