import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({
            email: z.string().email(),
            password: z.string().min(6),
            accessKey: z.string().optional(),
          })
          .safeParse(credentials);
 
        if (parsedCredentials.success) {
          const { email, password, accessKey } = parsedCredentials.data;

          const apiBase = process.env.API_BASE_URL || 'http://localhost:5000';

          const response = await fetch(`${apiBase}/api/v1/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email,
              password,
              accessKey,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (!data?.user || !data?.token) {
            return null;
          }

          const user = {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role,
            apiToken: data.token as string,
          };

          return user;
        }
 
        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = (user as any).id as string;
        token.apiToken = (user as any).apiToken as string | undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role as string;
        session.user.id = token.id as string;
        (session.user as any).apiToken = token.apiToken as string | undefined;
      }
      return session;
    },
  },
});
