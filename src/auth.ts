import NextAuth, { type NextAuthConfig } from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { cookies } from 'next/headers';

const allowedUsers = process.env.ALLOWED_USERS
  ? process.env.ALLOWED_USERS.split(',').map((u) => u.trim())
  : [];

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user, profile, account }) {
      let githubUsername: string | undefined;

      // Safely detect GitHub profile
      if (account?.provider === 'github' && profile && 'login' in profile) {
        githubUsername = (profile as { login?: string }).login;
      }

      const email = user?.email;

      if (
        (githubUsername && allowedUsers.includes(githubUsername)) ||
        (email && allowedUsers.includes(email))
      ) {
        return true;
      }

      // 👇 short-lived unauthorized cookie
      (await cookies()).set('unauthorized-access', 'true', {
        httpOnly: true,
        secure: true,
        maxAge: 5,
        path: '/unauthorized',
      });

      return '/unauthorized';
    },
  },
} satisfies NextAuthConfig);
