

import { ApolloClient, ApolloError, createHttpLink, InMemoryCache, Observable } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { setContext } from '@apollo/client/link/context';
import { store } from 'store';
import { openSnackbar } from 'store/slices/snackbar';
import { getSession, signOut } from 'next-auth/react';
import { AuthenticationStatus, AuthStatusCode } from 'store/constant';
import { REFRESH_TOKEN_MUTATION } from 'graphql/auth';

console.log('url', process.env.NEXT_PUBLIC_API_ENDPOINT);

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

// const requestRefreshToken = async () => {
//   let refreshToken = localStorage.getItem('refreshToken');
//   try {
//     if (refreshToken) {
//       const { data } = await client.mutate({
//         mutation: REFRESH_TOKEN_MUTATION,
//         variables: {
//           refreshToken
//         }
//       });

//       const accessToken = data?.refresh?.accessToken;
//       refreshToken = data?.refresh?.refreshToken;

//       localStorage.setItem('accessToken', accessToken || '');
//       localStorage.setItem('refreshToken', refreshToken);

//       return accessToken;
//     }

//     return;
//   } catch (err) {
//     if (err instanceof ApolloError) {
//       if (err.graphQLErrors) {
//         err.graphQLErrors.forEach(async ({ extensions }) => {
//           const token = await getSession();
//           if (
//             extensions?.code === AuthenticationStatus.UNAUTHENTICATED ||
//             extensions?.response?.statusCode === AuthStatusCode.UNAUTHENTICATED
//           ) {
//             if (token) {
//               localStorage.clear();
//               signOut();
//             }
//           }
//         });
//       }
//     }
//   }
// };

const requestRefreshToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken');
  try {
    if (!refreshToken) throw new Error('No refresh token available');

    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        refreshToken
      }
    });

    const refreshedTokens = data?.refreshToken;

    if (refreshedTokens?.accessToken) {
      // Update localStorage with the new access token and refresh token
      localStorage.setItem('accessToken', refreshedTokens.accessToken || '');
      localStorage.setItem('refreshToken', refreshedTokens.refreshToken || refreshToken); // Keep old refresh token if new one isn't provided

      return refreshedTokens.accessToken; // Return the new access token
    } else {
      throw new Error('Failed to refresh access token'); // If no access token is returned, throw an error
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Only clear localStorage if refresh fails completely, and sign out the user
    localStorage.clear();
    signOut(); // Ensure this is only called on permanent failure
    throw error; // Re-throw the error to handle it in the `onError` link
  }
};

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      if (err.extensions.code === 'UNAUTHENTICATED') {
        if (!isRefreshRequest(operation)) {
          return new Observable(observer => {
            (async () => {
              try {
                const newAccessToken = await requestRefreshToken();

                if (newAccessToken) {
                  // Retry the failed request with the new token
                  operation.setContext(({ headers = {} }) => ({
                    headers: {
                      ...headers,
                      authorization: `Bearer ${newAccessToken}`, // Use new access token
                    }
                  }));

                  // Retry the request
                  forward(operation).subscribe({
                    next: observer.next.bind(observer),
                    error: observer.error.bind(observer),
                    complete: observer.complete.bind(observer),
                  });
                } else {
                  // Clear tokens and sign out if refreshing fails completely
                  localStorage.clear();
                  signOut();
                }
              } catch (error) {
                observer.error(error);
              }
            })();
          });
        }
      }

      // Handle other errors like 'FORBIDDEN'
      if (err.extensions.code === 'FORBIDDEN') {
        store.dispatch(
          openSnackbar({
            open: true,
            message: err.message || 'Access denied',
            anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
            variant: 'alert',
            alert: { color: 'error' },
            timeout: 1000,
          })
        );
      }
    }
  }

  if (networkError) {
    console.log(`[Network error]: ${networkError}`);
  }
});



// const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
//   if (graphQLErrors) {
//     for (const err of graphQLErrors) {
//       switch (err.extensions.code) {
//         case 'UNAUTHENTICATED': {
//           // ignore 401 error for a refresh request
//           if (operation.operationName === 'refresh') {
//             return;
//           }
//           const observable = new Observable((observer) => {
//             // used an annonymous function for using an async function
//             (async () => {
//               try {
//                 const accessToken = await requestRefreshToken();
//                 if (!accessToken) {
//                   const token = await getSession();
//                   if (token) {
//                     localStorage.clear();
//                     return signOut();
//                   }
//                 }
//                 // Retry the failed request
//                 const subscriber = {
//                   next: observer.next.bind(observer),
//                   error: observer.error.bind(observer),
//                   complete: observer.complete.bind(observer)
//                 };

//                 forward(operation).subscribe(subscriber);
//               } catch (error) {
//                 observer.error(error);
//               }
//             })();
//           });

//           return observable;
//         }
//         case 'FORBIDDEN': {
//           // ignore 401 error for a refresh request
//           store.dispatch(
//             openSnackbar({
//               open: true,
//               message: err?.message || 'fallback message',
//               anchorOrigin: { horizontal: 'center', vertical: 'bottom' },
//               variant: 'alert',
//               alert: {
//                 color: 'error'
//               },
//               timeout: 1000
//             })
//           );

//           break;
//         }
//       }
//     }
//   }

//   if (networkError) console.log(`[Network error]: ${networkError}`);
// });

// Create Apollo Client instance
const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(httpLink)),
  cache: new InMemoryCache()
});

export default client;
