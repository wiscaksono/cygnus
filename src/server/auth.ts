import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions, type DefaultSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "~/server/db";
import { env } from "~/env.mjs";
import { loginSchema } from "~/schema/auth";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      fullName: string;
      phone: string;
    } & DefaultSession["user"];
  }

  interface User {
    fullName: string;
    phone: string;
  }
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.fullName = user.fullName;
        token.phone = user.phone;
      }

      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.fullName = token.fullName as string;
        session.user.phone = token.phone as string;
      }

      return session;
    },
  },
  secret: env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
    error: "/auth/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "jsmith@gmail.com",
        },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const cred = await loginSchema.parseAsync(credentials);

        const user = await prisma.user.findUnique({
          where: { email: cred.email },
        });

        if (!user) {
          return null;
        }

        const isValidPassword = user.password.localeCompare(cred.password) === 0;

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          image: user.image,
          phone: user.phone,
        };
      },
    }),
  ],
};

export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
