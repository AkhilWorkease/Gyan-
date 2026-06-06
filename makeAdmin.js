const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function makeAdmin(email) {
  if (!email) {
    console.error("Please provide an email address.");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`Successfully updated ${user.email} to ADMIN role.`);
  } catch (error) {
    console.error("Error updating user:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

const email = process.argv[2];
makeAdmin(email);
