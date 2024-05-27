import { ApolloClient, InMemoryCache } from '@apollo/client';
import { useMemo } from 'react';

let apolloClient: ApolloClient<any>;

function createApolloClient() {
  return new ApolloClient({
    uri: 'https://enatega-multivendor.up.railway.app/graphql',
    cache: new InMemoryCache(),
  });
}

export function initializeApollo(initialState = null) {
  const _apolloClient = apolloClient ?? createApolloClient();

  if (initialState) {
    _apolloClient.cache.restore(initialState);
  }

  if (typeof window === 'undefined') return _apolloClient;

  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}

export function useApollo(initialState: any) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
