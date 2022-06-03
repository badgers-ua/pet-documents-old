import { onError } from '@apollo/client/link/error';
import { NODE_ENV } from '../types';
import { setContext } from '@apollo/client/link/context';
import { useSnackbar } from 'notistack';
import { LocalStorageWrapper, persistCache } from 'apollo3-cache-persist';
import { useEffect, useState } from 'react';
import { InMemoryCache } from '@apollo/client/cache';
import { ApolloClient, DefaultOptions } from '@apollo/client/core/ApolloClient';
import { createHttpLink } from '@apollo/client/link/http';
import { concat, from } from '@apollo/client/core';
import { ApolloProvider } from '@apollo/client/react/context/ApolloProvider';
import { useSigninCheck } from 'reactfire';

const cache = new InMemoryCache();
const defaultOptions: DefaultOptions = {
  watchQuery: { fetchPolicy: 'cache-and-network' },
};

const ApolloProviderLocal = ({ children }: { children: JSX.Element }) => {
  const { data } = useSigninCheck();
  const { enqueueSnackbar } = useSnackbar();
  const [cacheLoaded, setCacheLoaded] = useState(false);

  useEffect(() => {
    const loadCache = async () => {
      await persistCache({
        cache,
        storage: new LocalStorageWrapper(window.localStorage),
      });
      setCacheLoaded(true);
    };

    loadCache();
  }, []);

  if (!cacheLoaded) {
    return <></>;
  }

  const httpLink = createHttpLink({
    uri: `${process.env.REACT_APP_API_URL}/graphql`,
  });

  const authLink = setContext(async (_, { headers }) => {
    const token = await data?.user?.getIdToken();

    return {
      headers: {
        ...headers,
        authorization: `Bearer ${token}`,
      },
    };
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.forEach(({ message, locations, path }) => {
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        );
        enqueueSnackbar(message);
      });

    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
      enqueueSnackbar(networkError.message);
    }
  });

  const link = concat(authLink, httpLink);

  const client = new ApolloClient({
    connectToDevTools: process.env.NODE_ENV === NODE_ENV.DEV,
    link: from([errorLink, link]),
    cache,
    defaultOptions,
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default ApolloProviderLocal;
