const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { createClient } = require("@libsql/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");

const libsql = createClient({
  url: "file:./dev.db",
});
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function seedAdmin() {
  const email = "admin@gyan.com";
  const password = "adminpassword123";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        role: "ADMIN",
        password: hashedPassword,
      },
      create: {
        email,
        name: "Admin User",
        password: hashedPassword,
        role: "ADMIN",
      },
    });

    console.log("Admin user seeded successfully:");
    console.log(`Email: ${user.email}`);
    console.log(`Password: ${password}`);
  } catch (error) {
    console.error("Error seeding admin user:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
