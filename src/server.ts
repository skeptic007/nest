import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LOGIN_MUTATION } from 'graphql/auth';
import client, { httpLink } from '../apollo.config';
import { ISignInResponseFormat } from 'types/api-response/auth';

export interface ILoginCredential {
  email: string;
  password: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  providers: [
    CredentialsProvider({
      id: 'email-login',
      type: 'credentials',
      credentials: {},
      async authorize(credentials, req) {
        if (!credentials) return null;
        const { email, password } = credentials as ILoginCredential;
        try {
          // Call your GraphQL mutation
          const res = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
              loginInput: {
                email,
                password
              }
            }
          });

          if (res?.errors && res.errors.length > 0) {
            console.error('GraphQL errors:', res.errors);
            throw new Error(res.errors[0].message);
          }

          if (res?.data?.login?.accessToken) {
            const data = res.data.login;
            return {
              id: data.user._id,
              user: data.user,
              access_token: data.accessToken,
              refresh_token: data.refreshToken,
              emailVerified: data.user.status !== 'email_verification_pending'
            };
          }

          return null;
        } catch (error: any) {
          console.log('email error', email);
          console.log('password error', password);
          // Call your GraphQL mutation
          console.log('httpLink error', httpLink);
          console.error('Error during authorization:', error);
          throw new Error('Authorization failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const userDetail = user as ISignInResponseFormat;
        return {
          access_token: userDetail?.access_token,
          refresh_token: userDetail?.refresh_token,
          expires_at: userDetail?.expires_at,
          expiry: userDetail?.expiry,
          user: userDetail?.user
        };
        //   token.access_token = user.access_token; // Assuming access_token is part of user object
        //   token.refresh_token = user.refresh_token; // Assuming refresh_token is part of user object
      }
      return token;
    },
    async session({ session, token }) {
      session.user = token; // Add access token to session
      // session.user.refresh_token = token.refresh_token; // Add refresh token to session
      return session;
    }
  },

  pages: {
    signIn: '/login'
  }
};
