import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
async function main() {
  const CS = await db.branch.create({
    data: {
      name: "CS",
    },
  });
  const AIML = await db.branch.create({
    data: {
      name: "AIML",
    },
  });
  const IS = await db.branch.create({
    data: {
      name: "IS",
    },
  });
  const AIDS = await db.branch.create({
    data: {
      name: "AIDS",
    },
  });
  console.log(CS);
}
main()
  .then(async () => {
    await db.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await db.$disconnect();
    process.exit(1);
  });
