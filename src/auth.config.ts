import type { NextAuthConfig, User } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./zod/authZ";

import { getUserByEmail } from "./utils/auth/auth";
import { login } from "./services/auth.service";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials);
        if (validateFields.success) {
          const { email, password } = validateFields.data;
          const data = await login({ email, password });
          if (!data) return null;
          const { accessToken, refreshToken } = data;
          const existingUser = await getUserByEmail(email);
          if (!existingUser) return null;
          const user = {
            ...existingUser,
            refreshToken: refreshToken,
            accessToken: accessToken,
          };
          return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
