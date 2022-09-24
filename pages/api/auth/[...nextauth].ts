import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { IDbUser, createUser } from '../../../lib/user';

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: '/signin',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || '',
      clientSecret: process.env.GOOGLE_SECRET || '',
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async jwt({ token }) {
      return token;
    },
    async signIn({ account, profile }) {
      const user: IDbUser = {
        name: (profile.given_name as string) || 'Пользователь',
        familyName: (profile.family_name as string) || '',
        email: profile.email || '',
        photo: (profile.picture as string) || '',
      };
      console.log(user);
      return await createUser(user);
    },
  },
  //adapter: MongoDBAdapter(clientPromise),
};

export default NextAuth(authOptions);
