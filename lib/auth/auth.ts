import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthError, Session } from "next-auth";
import prisma from "../prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers";
import { LoginUserAPI } from "./login";
import {
  fromDate,
  generateSessionToken,
  prisma_auth_adapter,
} from "./lib.auth";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: prisma_auth_adapter,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "Credentials",
      async authorize(credentials, req) {
        const res = await LoginUserAPI(credentials as any);

        if (res.done) {
          return res.user;
        }
        throw new AuthError(res);
      },
    }) as Provider,
  ],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
    newUser: "/auth/register",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ user }) {
      const token = generateSessionToken();
      console.log(token);
      const session = await prisma_auth_adapter.createSession?.({
        expires: fromDate(30 * 24 * 60 * 60),
        sessionToken: token,
        userId: user.id,
      });
      return { id: session?.sessionToken };
    },
    async session({ session: defaultSession, user }) {
      return {
        user,
        expires: defaultSession.expires,
      };
    },
  },
  jwt: {
    async encode({ token }) {
      return token?.id as unknown as string;
    },
    async decode() {
      return null;
    },
  },
  session: {
    maxAge: 30 * 24 * 60 * 60, // 30 days to session expiry
    generateSessionToken,
  },
  secret: process.env.NEXTAUTH_SECRET,
});
