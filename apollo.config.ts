import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// HTTP link to define your GraphQL endpoint
const httpLink = createHttpLink({
  uri: process.env.NEXT_USER_API_ENDPOINT
});

const hardcodedToken =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NmYyZTg4N2U4ZDRiMmI3NDQ0MzJmZTEiLCJ1dWlkIjoiZDFhNGEzMjEtNWI0My00ODlhLWJmYWUtY2Y5Njc4NzFhYWNhIiwiaWF0IjoxNzI3MTk1NzY1LCJleHAiOjE3MjcxOTkzNjV9.fpLOY_t1IGrKXvVbIA1AYF30fpQioUAQIsFTq0dTtOo';

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
