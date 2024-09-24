import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

import { LOGIN_MUTATION } from 'graphql/auth';
// import { ISignInResponse } from 'types/api-response/auth';
import client from '../apollo.config';

export interface ILoginCredential {
  email: string;
  password: string;
}

type UserStatus = 'email_verification_pending' | 'email_verified' | 'password_set' | 'password_set_pending';
export interface IUserPops {
  _id: string;
  email: string;
  status: UserStatus;
  // address?: IAdressResponse;
}
export interface IToken {
  accessToken: string;
  accessTokenExpiresIn: Date;
  refreshToken: string;
  refreshTokenExpiresIn: Date;
}
export interface ISignInResponse {
  message: string;
  token: IToken;
  user: IUserPops;
  expiry: {
    expiresAt: Date;
    expiresBy: number;
  };
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: true, // Enable debug
  providers: [
    CredentialsProvider({
      type: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'text', placeholder: 'you@example.com' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('here');
        if (!credentials) return null;

        const { email, password } = credentials as ILoginCredential;

        try {
          const res = await client.mutate<{ loginWithEmailPassword: ISignInResponse }>({
            mutation: LOGIN_MUTATION,
            variables: {
              loginInput: {
                email,
                password
              }
            }
          });

          if (res?.errors) {
            throw new Error(res.errors[0].message);
          }

          if (res?.data?.loginWithEmailPassword?.token) {
            const data = res.data.loginWithEmailPassword;

            return {
              id: data.user?._id || '',
              user: data.user,
              access_token: data.token.accessToken,
              refresh_token: data.token.refreshToken,
              expires_at: data.token.accessTokenExpiresIn,
              emailVerified: data.user.status !== 'email_verification_pending'
            };
          }

          return null;
        } catch (error: any) {
          throw new Error(error);
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        return {
          access_token: user.access_token,
          refresh_token: user.refresh_token,
          expires_at: user.expires_at,
          user: user.user
        };
      }
      return token;
    },
    async session({ session, token }: any) {
      session.user = token;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
