import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import bcrypt from "bcryptjs";
import User from "@/models/user/User";

export const authOptions: NextAuthOptions = {
  providers: [
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
            { username: credentials.identifier.email },
            { email: credentials.identifier.email },
          ],
        });
        if (!user) {
          throw new Error("No user found with the provided credentials");
        }
        if (!user.isVerified) {
          throw new Error("User email is not verified yet !, Please verify your email");
        }
        if (
          user &&
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
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.email = user.email;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.isVerified = user.isVerified;
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

