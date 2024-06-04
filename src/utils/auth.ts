import { type User } from "@prisma/client";
import { db } from "~/server/db";

export const getUserByEmail = async (email: string): Promise<User | null> => {
  try {
    const user = await db.user.findFirst({
      where: {
        email,
      },
    });
    if (!user) return null;
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
