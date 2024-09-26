import { ApolloClient, ApolloError, createHttpLink, InMemoryCache, Observable } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { store } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { getSession, signOut } from 'next-auth/react';
import { AuthenticationStatus, AuthStatusCode } from 'store/constant';
import { REFRESH_TOKEN_MUTATION } from 'graphql/auth';

const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_ENDPOINT
});

const getToken = (operation) => {
  if (operation.operationName === 'refreshToken') {
    return localStorage.getItem('refreshToken') || '';
  }
  return localStorage.getItem('accessToken') || '';
};

const authLink = setContext((operation, { headers }) => {
  const token = typeof window !== 'undefined' ? getToken(operation) : '';
  return {
    headers: {
      ...headers,
      authorization: token ? ` ${token}` : ''
    }
  };
});

const requestRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    if (refreshToken) {
      const { data } = await client.mutate({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: { refreshToken }
      });

      const { accessToken, refreshToken: newRefreshToken } = data?.refreshToken || {};
      localStorage.setItem('accessToken', accessToken || '');
      localStorage.setItem('refreshToken', newRefreshToken || refreshToken);

      return accessToken;
    }
  } catch (error) {
    handleTokenError(error);
  }
};

const handleTokenError = (error) => {
  if (error instanceof ApolloError) {
    if (error.graphQLErrors) {
      error.graphQLErrors.forEach(({ extensions }) => {
        if (
          extensions?.code === AuthenticationStatus.UNAUTHENTICATED ||
          extensions?.response?.statusCode === AuthStatusCode.UNAUTHENTICATED
        ) {
          localStorage.clear();
          signOut();
        }
      });
    }
  }
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    graphQLErrors.forEach((err) => {
      switch (err.extensions.code) {
        case 'UNAUTHENTICATED': {
          if (operation.operationName === 'refreshToken') return;

          const observable = new Observable((observer) => {
            (async () => {
              try {
                const accessToken = await requestRefreshToken();
                if (!accessToken) {
                  const token = await getSession();
                  if (token) {
                    localStorage.clear();
                    signOut();
                  }
                }
                operation.setContext(({ headers }) => ({
                  headers: {
                    ...headers,
                    authorization: ` ${accessToken}`
                  }
                }));
                forward(operation).subscribe(observer);
              } catch (error) {
                observer.error(error);
              }
            })();
          });

          return observable;
        }
        case 'FORBIDDEN': {
          store.dispatch(
            openSnackbar({
              open: true,
              message: err?.message || 'fallback message',
              anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
              variant: 'alert',
              alert: {
                color: 'error'
              },
              timeout: 1000
            })
          );
          break;
        }
      }
    });
  }

  if (networkError) console.log(`[Network error]: ${networkError}`);
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache()
});

export default client;
