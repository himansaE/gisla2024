import NextAuth, { AuthError } from "next-auth";
import { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginUserAPI } from "./login";

import google from "next-auth/providers/google";
import {
  fromDate,
  generateSessionToken,
  prisma_auth_adapter,
} from "./lib.auth";

const credentials_provider = CredentialsProvider({
  name: "Credentials",
  id: "Credentials",
  async authorize(credentials) {
    const res = await LoginUserAPI(credentials as any);

    if (res.done) {
      return res.user;
    }
    throw new AuthError(res);
  },
}) as Provider;

const google_provider = google({
  clientId: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
});

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: prisma_auth_adapter,
  providers: [credentials_provider, google_provider],
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/signout",
    newUser: "/auth/register",
    error: "/auth/error",
  },

  callbacks: {
    async jwt({ user }) {
      const token = generateSessionToken();
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
