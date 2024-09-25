import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP link to define your GraphQL endpoint
console.log('GraphQL Endpoint:', process.env.NEXT_USER_API_ENDPOINT);

const httpLink = createHttpLink({
  uri: process.env.NEXT_USER_API_ENDPOINT
});

const hardcodedToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmYyZTg4N2U4ZDRiMmI3NDQ0MzJmZTEiLCJ1dWlkIjoiZTlhNzZjZTMtMGJkNi00N2VhLWI0Y2ItODgwZDA4Mzk4MmNlIiwiaWF0IjoxNzI3MjgyMDg4LCJleHAiOjE3MjcyODU2ODh9.JATea8h4CT8qIxH6DMbSTp2eIXtdNEXqxzW78OvWhCA';

// Auth link to include the token in the headers
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: hardcodedToken
    }
  };
});

// Create Apollo Client instance
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

export default client;
