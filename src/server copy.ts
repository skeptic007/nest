import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LOGIN_MUTATION, REFRESH_TOKEN_MUTATION } from 'graphql/auth';
import client from '../apollo.config';

export interface ILoginCredential {
  email: string;
  password: string;
  deviceId?: string;
}

async function refreshAccessToken(tokenObject: any) {
  try {
    const { data } = await client.mutate({
      mutation: REFRESH_TOKEN_MUTATION,
      variables: {
        refreshToken: tokenObject.refresh_token
      }
    });

    const refreshedTokens = data?.refreshToken || {};

    return {
      ...tokenObject,
      access_token: refreshedTokens.accessToken,
      refresh_token: refreshedTokens.refreshToken || tokenObject.refresh_token,
      expires_at: Date.now() + 5 * 60 * 1000 // 5 minutes
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return { ...tokenObject, error: 'RefreshAccessTokenError' };
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60 // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {},
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password, deviceId } = credentials as ILoginCredential;

        try {
          const res = await client.mutate({
            mutation: LOGIN_MUTATION,
            variables: {
              loginInput: { email, password, deviceId }
            }
          });

          if (res?.errors) {
            throw new Error(res.errors[0].message);
          }

          const loginData = res?.data?.login;

          if (loginData) {
            const {
              accessToken,
              refreshToken,
              mfaEnabled,
              user: { _id, adminApproveStatus, email, firstName, lastName, profile, role, status, theme }
            } = loginData;

            return {
              id: _id || '',
              access_token: accessToken,
              refresh_token: refreshToken,
              expires_at: Date.now() + 5 * 60 * 1000, // 5 minutes
              mfaEnabled,
              user: {
                id: _id,
                adminApproveStatus,
                email,
                firstName,
                lastName,
                profile,
                role,
                status,
                theme
              },
              emailVerified: status !== 'email_verification_pending'
            };
          }

          return null;
        } catch (error: any) {
          throw new Error(error.message || 'Login failed');
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        return {
          ...token,
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          expires_at: user.expires_at,
          user: user.user
        };
      }

      const isAccessTokenExpired = Date.now() > token.expires_at;

      if (isAccessTokenExpired) {
        console.log('Access token expired, refreshing...');
        return await refreshAccessToken(token);
      }

      return token;
    },
    async session({ session, token }: any) {
      session.user = token.user;
      session.access_token = token.access_token;
      session.error = token.error;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
