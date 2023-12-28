import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { AuthError } from "next-auth";
import prisma from "../prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { Provider } from "next-auth/providers";
import { LoginUserAPI } from "./login";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      id: "Credentials",
      async authorize(credentials) {
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

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
});
