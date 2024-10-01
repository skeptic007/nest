import { ApolloClient, ApolloError, createHttpLink, InMemoryCache, Observable, Operation } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { store } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { getSession, signOut } from 'next-auth/react';
import { AuthenticationStatus, AuthStatusCode } from 'store/constant';
import { REFRESH_TOKEN_MUTATION } from 'graphql/auth';

console.log('backend-url', process.env.NEXT_PUBLIC_API_ENDPOINT);

export const httpLink = createHttpLink({
  uri: process.env.NEXT_PUBLIC_API_ENDPOINT
});

console.log('🚀 ~ httpLink:', httpLink);
// Type for operation
const getToken = (operation: Operation): string => {
  if (operation.operationName === 'refreshToken') {
    return localStorage.getItem('refreshToken') || '';
  }
  return localStorage.getItem('accessToken') || '';
};

// @ts-ignore
const authLink = setContext((operation: Operation, { headers }) => {
  const token = typeof window !== 'undefined' ? getToken(operation) : '';
  return {
    headers: {
      ...headers,
      authorization: token ? ` ${token}` : ''
    }
  };
});

// Async function with proper typing
const requestRefreshToken = async (): Promise<string | undefined> => {
  console.log('request refresh token called');
  let refreshToken = localStorage.getItem('refreshToken');
  try {
    if (refreshToken) {
      const { data } = await client.mutate({
        mutation: REFRESH_TOKEN_MUTATION,
        variables: {
          refreshToken
        }
      });

      const accessToken = data?.refreshToken?.accessToken;
      console.log('accessToken===', accessToken);

      localStorage.setItem('accessToken', accessToken || '');

      return accessToken;
    }

    return undefined;
  } catch (err) {
    if (err instanceof ApolloError) {
      if (err.graphQLErrors) {
        for (const { extensions } of err.graphQLErrors) {
          const token = await getSession();
          if (
            extensions?.code === AuthenticationStatus.UNAUTHENTICATED ||
            // @ts-ignore
            extensions?.response?.statusCode === AuthStatusCode.UNAUTHENTICATED
          ) {
            if (token) {
              console.log('inside if of line 64');
              localStorage.clear();

              signOut();
            }
          }
        }
      }
    }
  }
};

// Define the errorLink and properly type forward and observer
//@ts-ignore
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  console.log('======graphqlError===', graphQLErrors);
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      switch (err?.extensions?.code) {
        case 'UNAUTHENTICATED': {
          if (operation.operationName === 'refreshToken') {
            return;
          }

          const observable = new Observable((observer) => {
            (async () => {
              try {
                const accessToken = await requestRefreshToken();
                if (!accessToken) {
                  const token = await getSession();
                  if (token) {
                    localStorage.clear();
                    return signOut();
                  }
                }

                const subscriber = {
                  next: observer.next.bind(observer),
                  error: observer.error.bind(observer),
                  complete: observer.complete.bind(observer)
                };

                forward(operation).subscribe(subscriber);
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
    }
  }
});

const authFlow = authLink.concat(errorLink);
// Create Apollo Client instance
const client = new ApolloClient({
  // link: errorLink.concat(authLink.concat(httpLink)),
  link: authFlow.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
