// import NextAuth from 'next-auth';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { ApolloClient, InMemoryCache, gql } from '@apollo/client';

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'text' },
//         password: { label: 'Password', type: 'password' }
//       },
//       async authorize(credentials) {
//         // Initialize Apollo Client
//         const client = new ApolloClient({
//           uri: process.env.NEXT_USER_API_ENDPOINT,
//           //   `${process.env.NEXT_USER_API_ENDPOINT}`
//           cache: new InMemoryCache()
//         });

//         // Perform GraphQL mutation
//         try {
//           const { data } = await client.mutate({
//             mutation: gql`
//              mutation Login($loginInput: LoginInput!) {
//   login(loginInput: $loginInput) {
//     accessToken
//     refreshToken
//             `,
//             variables: {
//               email: credentials.email,
//               password: credentials.password
//             }
//           });

//           if (data.login.accessToken && data.login.refreshToken) {
//             return {
//               email: credentials.email,
//               accessToken: data.login.accessToken,
//               refreshToken: data.login.refreshToken
//             };
//           }

//           return null;
//         } catch (error) {
//           console.error('Authorize error:', error);
//           return null;
//         }
//       }
//     })
//   ],
//   pages: {
//     signIn: '/auth/signin' // Custom sign-in page
//   },
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.accessToken = user.accessToken;
//         token.refreshToken = user.refreshToken;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       session.accessToken = token.accessToken;
//       session.refreshToken = token.refreshToken;
//       return session;
//     }
//   },
//   session: {
//     strategy: 'jwt',
//     maxAge: 30 * 24 * 60 * 60 // 30 days
//   }
// };

// const handler = NextAuth(authOptions);

// export { handler as GET, handler as POST };
