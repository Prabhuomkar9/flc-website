import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./server/db";
import { JWT, getToken } from "next-auth/jwt";
import {
  getRefreshTokenExpiry,
  isJwtExpired,
  refreshToken,
  rotateTokens,
} from "./utils/auth/jwt";
import { getUserById } from "./utils/auth/auth";

declare module "next-auth" {
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
      id: string;
      accessToken: string;
    } & DefaultSession["user"];
  }
  interface AdapterUser {
    accessToken: string;
    refreshToken: string;
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
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
    refreshToken: string;
  }
}

export const { auth, handlers, signIn, signOut } = NextAuth({
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (!token.sub) return token;
      console.log("WAITTTTTTTTTTTTT");
      console.log("NEWTOKEN", token.accessToken);

      if (user && trigger === "signIn") {
        token = {
          ...token,
          sub: user.id,
          name: user.name,
          email: user.email,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          iat: Math.floor(Date.now() / 1000),
          exp: getRefreshTokenExpiry(user.refreshToken),
        };
        console.log("Token from userrrrrrrrrrrrrrrr", token);
        return token;
      } else if (isJwtExpired(String(token.accessToken))) {
        // user signed in before and to check if the token is expired
        console.log("expired, refreshing token");
        console.log("Refresh tokennnnnn", token.refreshToken);

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
          console.log("token.accessToken", token.accessToken);
          console.log("token.refreshToken", token.refreshToken);
          console.log("token.exp", token.exp);

          console.log("token-new-token-attached", token);
          if (token.accessToken === newAccessToken) {
            return token;
          } else {
            return null;
          }
        } else {
          console.log("unable to refresh token");

          return null;
        }
      }
      console.log("RETURNING TOKEN");
      console.log(token);

      return token;
    },
    async session({ session, token }) {
      console.log("Hi from session");

      if (token.sub && session.user) {
        console.log("WASSSSUPPPPPPPP");
        session.user.id = token.sub;
        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.accessToken = token.accessToken;
      }

      console.log("Session", session);
      return session;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
