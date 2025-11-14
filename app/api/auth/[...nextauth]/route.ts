import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GitHubProvider from 'next-auth/providers/github';
import EmailProvider from 'next-auth/providers/email';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from '@/lib/prisma';

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // GitHub OAuth provider (requires GITHUB_ID & GITHUB_SECRET env vars)
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
    }),

    // Email (magic link) provider (requires EMAIL_SERVER and EMAIL_FROM)
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),

    // Fallback credentials provider for quick email-based sign-in UI
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        if (!email) return null;
        // upsert user in prisma
        const user = await prisma.user.upsert({
          where: { email },
          update: {},
          create: { email, firstName: '', lastName: '', password: null },
        });
        return { id: user.id, name: `${user.firstName} ${user.lastName}`.trim(), email: user.email } as any;
      },
    }),
  ],
  callbacks: {
    async session({ session, user }: any) {
      if (session.user) session.user.id = user.id;
      return session;
    },
  },
  session: {
    strategy: 'database',
  },
  secret: process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || 'dev-secret',
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
