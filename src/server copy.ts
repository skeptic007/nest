import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LOGIN_MUTATION } from 'graphql/auth';
import client from '../apollo.config';

export interface ILoginCredential {
  email: string;
  password: string;
  deviceId?: string;
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
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
              loginInput: {
                email,
                password,
                deviceId
              }
            }
          });

          if (res?.errors) {
            throw new Error(res?.errors[0].message);
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
              mfaEnabled: mfaEnabled,
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
          throw new Error(error);
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
          mfaEnabled: user.mfaEnabled,
          expires_at: user.expires_at,
          user: user.user
        };
      }
      return token;
    },

    // async jwt({ token, user }: any) {
    //   if (user) {
    //     return {
    //       access_token: user.access_token,
    //       refresh_token: user.refresh_token,
    //       mfaEnabled: user.mfaEnabled,
    //       expires_at: user.expires_at,
    //       user: user.user
    //     };
    //   }
    //   return token;
    // },
    async session({ session, token }: any) {
      session.user = token;
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
