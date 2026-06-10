import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";
type UserRole = "CANDIDATE" | "EMPLOYER" | "ADMIN";

declare module "next-auth" {
  interface User {
    role: UserRole;
    isApproved: boolean;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      isApproved: boolean;
    };
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    role: UserRole;
    isApproved: boolean;
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user.id,
          email: user.email,
          role: user.role as UserRole,
          isApproved: user.isApproved,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.isApproved = user.isApproved;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        session.user.role = token.role as UserRole;
        session.user.isApproved = token.isApproved as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: "/de/login",
  },
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
});
