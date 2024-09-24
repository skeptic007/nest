import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP link to define your GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.NEXT_USER_API_ENDPOINT
});

// Auth link to include the token in the headers
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken');

  return {
    headers: {
      ...headers,
      authorization: token ? `${token}` : ''
    }
  };
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
