import type { NextAuthConfig, User } from "next-auth";
import credentials from "next-auth/providers/credentials";
import { LoginSchema } from "./zod/authZ";
import bcrypt from "bcryptjs";

import { getUserByEmail } from "./utils/auth/auth";
import { login } from "./services/auth.service";

export default {
  providers: [
    credentials({
      async authorize(credentials) {
        const validateFields = LoginSchema.safeParse(credentials);
        if (validateFields.success) {
          const { email, password } = validateFields.data;
          const data = await login({ email, password });
          if (!data) return null;
          const { accessToken, refreshToken } = data;
          const existingUser = await getUserByEmail(email);
          if (!existingUser) return null;
          const passwordMatch = await bcrypt.compare(
            password,
            existingUser.password,
          );

          if (!passwordMatch) return null;
          const user = {
            ...existingUser,
            refreshToken: refreshToken,
            accessToken: accessToken,
          };
          console.log("User", user);

          return user;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
