import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) return null;
          const user = await prisma.user.findUnique({ where: { email: credentials.email } });
          if (!user) {
            console.warn("Credentials.authorize: user not found", { email: credentials.email });
            return null;
          }
          if (!user.password) {
            console.warn("Credentials.authorize: user has no password set", { userId: user.id });
            return null;
          }
          const ok = await bcrypt.compare(credentials.password, user.password);
          if (!ok) {
            console.warn("Credentials.authorize: invalid password", { userId: user.id });
            return null;
          }
          return { id: user.id, name: user.name ?? undefined, email: user.email } as any;
        } catch (err: any) {
          console.error("Credentials.authorize: unexpected error", err);
          throw err;
        }
      },
    }),
  ],
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/login",
  },
};

export default authOptions;
