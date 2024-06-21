import { GraphQLClient } from 'graphql-request';
import { initGraphQLTada } from 'gql.tada';
import type { introspection } from './rmrk-evm-indexer-env.js';
import { GRAPHQL_HTTP_URL_PROD_EVM } from '../consts.js';

export const gqlClient = new GraphQLClient(GRAPHQL_HTTP_URL_PROD_EVM ?? '');

export const graphqlRmrkIndexer = initGraphQLTada<{
  introspection: introspection;
}>();

export type { FragmentOf, ResultOf, VariablesOf } from 'gql.tada';
export { readFragment } from 'gql.tada';
