import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./server/db";

import {
  getRefreshTokenExpiry,
  isJwtExpired,
  refreshToken,
} from "./utils/auth/jwt";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    accessToken: string;
    refreshToken: string;
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }

  interface Session {
    user: {
      accessToken: string;
    } & DefaultSession["user"];
  }
}
declare module "next-auth/jwt" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT {
    iat: number;
    exp: number;
    accessToken: string;
  }
}

export const rotateTokens = async function (token: string) {
  console.log("refreshing token", token);

  const tokens = await refreshToken(token);
  if (tokens) {
    return [tokens.accessToken, tokens.refreshToken];
  }
  console.log("refreshToken failed");
  return [null, null];
};

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
  callbacks: {
    async jwt({ token, user }) {
      if (!token || !user) return null;
      if (!token.sub) return token;

      // user signed in for the first time
      if (user) {
        token = {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          iat: Math.floor(Date.now() / 1000),
          exp: getRefreshTokenExpiry(user.refreshToken),
          name: user.name,
          email: user.email,
          image: user.image,
        };
        return token;
      }

      // user signed in before and to check if the token is expired

      if (isJwtExpired(String(token.accessToken))) {
        console.log("expired, refreshing token");
        const [newAccessToken, newRefreshToken] = await rotateTokens(
          String(token.refreshToken),
        );
        console.log(
          "newAccessToken",
          newAccessToken,
          "newRefreshToken",
          newRefreshToken,
        );
        console.log("old token", token);
        if (newAccessToken && newRefreshToken) {
          token = {
            ...token,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            exp: getRefreshTokenExpiry(newRefreshToken),
          };
          console.log("token-new-token-attached", token);

          return token;
        }
        // unable to refresh tokens from backend, invalidate the token
        console.log(
          "unable to refresh tokens from backend, invalidate the token",
        );
        return null;
      }
      //return same token
      console.log("token-data-attached", token);
      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.accessToken && session.user) {
        session.user.accessToken = token.accessToken;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email!;
      }
      return session;
    },
  },
});
