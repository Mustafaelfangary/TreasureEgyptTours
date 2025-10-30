import { PrismaAdapter } from "@auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('Missing credentials');
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        console.log('Found user:', user ? 'yes' : 'no');

        if (!user) {
          console.log('User not found');
          return null;
        }

        if (!user.password) {
          console.log('User has no password');
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
          console.log('Invalid password');
          return null;
        }

        // Check if email is verified (bypass for admin users)
        if (!user.isEmailVerified && user.role !== 'ADMIN') {
          console.log('Email not verified for user:', user.email);
          // Return null instead of throwing error to let the client handle it
          return null;
        }

        console.log('Authentication successful for user:', user.email);

        // Keep all roles for proper authorization
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role, // Keep original role: ADMIN, MANAGER, GUIDE, USER
          originalRole: user.role, // Store original role for reference
          image: user.image
        };
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log('Auth redirect called with:', { url, baseUrl });
      
      // Normalize baseUrl for localhost
      const normalizedBaseUrl = baseUrl.replace(/:\d+$/, ':3000');
      
      // If url is relative, prepend baseUrl
      if (url.startsWith('/')) {
        const fullUrl = `${normalizedBaseUrl}${url}`;
        console.log('Redirecting to relative URL:', fullUrl);
        return fullUrl;
      }
      
      // If url is absolute and starts with our baseUrl, return it
      if (url.startsWith(normalizedBaseUrl) || url.startsWith(baseUrl)) {
        console.log('Redirecting to absolute URL:', url);
        return url;
      }
      
      // If url is from a different domain or invalid, redirect to home
      console.log('Redirecting to home page');
      return normalizedBaseUrl;
    },
    async session({ session, token }) {
      console.log('Session callback - token:', token);
      if (token && session.user) {
        session.user = {
          ...session.user,
          id: token.id as string,
          name: token.name as string,
          email: token.email as string,
          image: token.picture as string,
          role: token.role as string,
        };
      }
      console.log('Session callback - returning session:', session);
      return session;
    },
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account && user) {
        return {
          ...token,
          id: user.id,
          role: user.role,
          accessToken: account.access_token,
        };
      }
      return token;
    },
  },
};
