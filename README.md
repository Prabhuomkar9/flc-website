# Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Drizzle](https://orm.drizzle.team)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information.

import NextAuth, { type DefaultSession } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import authConfig from "./auth.config";
import { db } from "./server/db";

// import {
// getRefreshTokenExpiry,
// isJwtExpired,
// refreshToken,
// } from "./utils/auth/jwt";
// import { JWT } from "next-auth/jwt";
// import { AdapterUser } from "next-auth/adapters";

// declare module "next-auth" {
// /\*_
// _ Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
// \*/
// // interface User {
// // accessToken: string;
// // refreshToken: string;
// // id?: string;
// // name?: string | null;
// // email?: string | null;
// // image?: string | null;
// // }

// // interface Session {
// // user: {
// // accessToken: string;
// // } & DefaultSession["user"];
// // }
// }
// declare module "next-auth/jwt" {
// /\*_
// _ Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
// \*/
// interface JWT {
// iat: number;
// exp: number;
// accessToken: string;
// }
// }

// export const rotateTokens = async function (token: string) {
// console.log("refreshing token", token);

// const tokens = await refreshToken(token);
// if (tokens) {
// return [tokens.accessToken, tokens.refreshToken];
// }
// console.log("refreshToken failed");
// return [null, null];
// };

export const { auth, handlers, signIn, signOut } = NextAuth({
adapter: PrismaAdapter(db),
session: { strategy: "jwt" },
...authConfig,
callbacks: {
async jwt({ token, user }) {
console.log("Hi from token");

      if (!token || !user) return null;
      if (!token.sub) return token;

      // user signed in for the first time

      console.log("user signed in for the first time");
      token = {
        ...token,
        sub: user.id,
        // accessToken: user.accessToken,
        // refreshToken: user.refreshToken,
        // iat: Math.floor(Date.now() / 1000),
        // exp: getRefreshTokenExpiry(user.refreshToken),
        name: user.name,
        email: user.email,
        image: user.image,
      };
      console.log("TOken from user", token);

      return token;

      // user signed in before and to check if the token is expired

      // if (isJwtExpired(String(token.accessToken))) {
      //   console.log("expired, refreshing token");
      //   const [newAccessToken, newRefreshToken] = await rotateTokens(
      //     String(token.refreshToken),
      //   );
      //   console.log(
      //     "newAccessToken",
      //     newAccessToken,
      //     "newRefreshToken",
      //     newRefreshToken,
      //   );
      //   console.log("old token", token);
      //   if (newAccessToken && newRefreshToken) {
      //     token = {
      //       ...token,
      //       accessToken: newAccessToken,
      //       refreshToken: newRefreshToken,
      //       exp: getRefreshTokenExpiry(newRefreshToken),
      //     };
      //     console.log("token-new-token-attached", token);

      //     return token;
      //   }
      //   // unable to refresh tokens from backend, invalidate the token
      //   console.log(
      //     "unable to refresh tokens from backend, invalidate the token",
      //   );
      //   return null;
      // }
      //return same token
    },
    async session({ session, token }) {
      console.log("Hi");

      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      // if (token.accessToken && session.user) {
      //   session.user.accessToken = token.accessToken;
      // }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email!;
      }
      console.log("SESSSSSSSSSSSSSSSSSION", session);

      return session;
    },

},
});
