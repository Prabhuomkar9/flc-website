import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";

export const testRouter = createTRPCRouter({
  test: protectedProcedure.mutation(() => {
    console.log("HELLOOOOOOO HERERRRERERE");
  }),
  testUnsafe: publicProcedure.mutation(() => {
    console.log("HELLOOOOOOO HERERRRERERE");
  }),
});
