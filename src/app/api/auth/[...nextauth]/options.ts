import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbconfig/dbConnect";
import { Types } from "mongoose";

import bcrypt from "bcryptjs";
import User from "@/models/user/User";
import { IUser } from "@/models/user/User";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: {
          label: "Email or Username",
          type: "text",
          placeholder: "you@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        const user = await User.findOne({
          $or: [
            // username or email can only be accessed via credentials indentifier ( cannot access directly via identifier)
            { username: credentials.identifier },
            { email: credentials.identifier },
          ],
        });
        if (!user) {
          throw new Error("No user found with the provided credentials");
        }
        if (!user.isVerified) {
          throw new Error(
            "User email is not verified yet !, Please verify your email"
          );
        }
        if (
          user &&
          user.password &&
          // password can be accessed directly via credentials ( no needed to access via identifier)
          (await bcrypt.compare(credentials.password, user.password))
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  // Add any additional NextAuth options here
  callbacks: {
    async signIn({ user, account }) {
      if (!account) return false;
      await dbConnect();

      if (account?.provider !== "credentials") {
        let existingUser = await User.findOne({ email: user.email });

        if (!existingUser) {
          existingUser = await User.create({
            email: user.email,
            username: user.name?.replace(/\s+/g, "").toLowerCase(),
            isVerified: true,
            isAcceptingMessages: true,
            provider: account.provider,
            password: null, // No password for social logins
          });
        }

        // Attach DB user data to `user` object for jwt callback
        const exUser = existingUser as IUser & { _id: Types.ObjectId };
        user._id = exUser._id.toString();
        user.username = exUser.username;
        user.isVerified = exUser.isVerified;
        user.isAcceptingMessages = exUser.isAcceptingMessages;
      }

      return true; // allow login
    },

    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.isVerified = user.isVerified ?? true; // Social logins usually verified
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.email = token.email;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.isVerified = token.isVerified;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
    error: "/auth/error", // Error code passed in query string as ?error=
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
