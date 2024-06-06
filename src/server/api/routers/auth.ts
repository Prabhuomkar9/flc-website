import {
  LoginSchema,
  RegisterSchema,
  SendVerifyEmailSchema,
  VerifyEmailSchema,
} from "~/zod/authZ";
import { v4 as uuidv4 } from "uuid";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import jwt, {
  JsonWebTokenError,
  NotBeforeError,
  TokenExpiredError,
} from "jsonwebtoken";
import {
  compareHashedPassword,
  getUserByEmail,
  getUserById,
  hashPassword,
} from "~/utils/auth/auth";
import {
  addRefreshTokenToWhitelist,
  addVerificationTokenToWhitelist,
  revokeVerificationToken,
} from "~/services/auth.service";
import {
  findVerificationTokenById,
  generateTokens,
  generateVerificationToken,
  secrets,
} from "~/utils/auth/jwt";
import { sendVerificationEmail } from "~/utils/nodeMailer/nodeMailer";

export const authRouter = createTRPCRouter({
  signUp: publicProcedure
    .input(RegisterSchema)
    .mutation(async ({ ctx, input }) => {
      if (ctx.session?.user ?? ctx.session) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You are already logged in",
        });
      }
      const { name, email, password, phone, year, branchId } = input;

      try {
        const existingUser = await getUserByEmail(email);

        if (existingUser && !existingUser.emailVerified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Please verify your email and Login",
          });
        }

        if (existingUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Account already exists",
          });
        }

        //TODO: Implement year typechecks

        const hashedPassword = await hashPassword(password);
        if (!hashPassword) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }

        const user = await ctx.db.user.create({
          data: {
            name,
            email,
            password: hashedPassword!,
            phone: phone,
            year, //Yet to be resolved
            Branch: {
              connect: {
                id: branchId,
              },
            },
          },
        });

        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong",
          });
        }

        return user;
      } catch (error) {
        console.error(error);

        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  sendVerifyEmail: publicProcedure
    .input(SendVerifyEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const { email } = input;
      try {
        const existingUser = await getUserByEmail(email);
        if (!existingUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User not found",
          });
        }
        if (existingUser.emailVerified) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "User already verified",
          });
        }
        const { id: token } = await addVerificationTokenToWhitelist({
          userId: existingUser.id,
        });

        const verificationToken = generateVerificationToken(
          existingUser,
          token,
        );
        const url = `${process.env.AUTH_URL}/auth/verify-email?token=${verificationToken}`;

        await sendVerificationEmail(existingUser.email, url, existingUser.name);

        return {
          success: "Email sent",
        };
      } catch (error) {
        console.error(error);
        if (error instanceof TRPCError) {
          throw error;
        }
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),
  verifyEmail: publicProcedure
    .input(VerifyEmailSchema)
    .mutation(async ({ ctx, input }) => {
      const { token } = input;

      try {
        const payload = jwt.verify(
          token,
          secrets.JWT_VERIFICATION_SECRET,
        ) as jwt.JwtPayload;

        const savedToken = await findVerificationTokenById(payload.jti!);
        if (!savedToken || savedToken.revoked == true) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid token",
          });
        }
        const user = await getUserById(payload.userId! as string);
        if (!user) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid token",
          });
        }
        const verifiedUser = await ctx.db.user.update({
          where: {
            id: user.id,
          },
          data: {
            emailVerified: new Date(),
          },
        });

        await revokeVerificationToken(savedToken.id);

        return verifiedUser;
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          console.error("Token has expired:", error.message);
        } else if (error instanceof NotBeforeError) {
          console.error("Token not active:", error.message);
        } else if (error instanceof JsonWebTokenError) {
          console.error("JWT Error:", error.message);
        } else {
          console.error("Unknown error:", error);
        }
        throw error;
      }
    }),
});
