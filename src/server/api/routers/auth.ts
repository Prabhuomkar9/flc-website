import { LoginSchema, RegisterSchema } from "~/zod/authZ";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getUserByEmail } from "~/utils/auth";
import bcrypt from "bcryptjs";

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
      const { name, email, password, phone, year, branch } = input;

      try {
        const existingUser = await getUserByEmail(email);

        if (existingUser && !existingUser.emailVerified) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "Please verify your email and Login",
          });
        }

        if (existingUser) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Account already exists",
          });
        }

        const branchName = branch.toUpperCase();

        const existingBranch = await ctx.db.branch.findFirst({
          where: {
            name: branchName,
          },
        });

        if (!existingBranch) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid Branch Name",
          });
        }

        //TODO: Implement year typechecks

        const hashedPassword = await bcrypt.hash(password, 10);

        await ctx.db.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
            phone: phone,
            year, //Yet to be resolved
            Branch: {
              connect: {
                id: existingBranch.id,
              },
            },
          },
        });

        return {
          status: "success",
          message: "user created",
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
    }),

  login: publicProcedure.input(LoginSchema).mutation(async ({ ctx, input }) => {
    const { email, password } = input;

    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      throw new TRPCError({ code: "BAD_REQUEST", message: "No user found" });
    }
    const validPassword = await bcrypt.compare(password, existingUser.password);
    if (!validPassword) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Incorrect password",
      });
    }
    if (!existingUser.emailVerified) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Please verify email",
      });
    }

    //TODO: Remaining
  }),
});
