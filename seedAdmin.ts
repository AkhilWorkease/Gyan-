import bcrypt from "bcryptjs";
import prisma from "./src/lib/prisma";

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
  } catch (error: any) {
    console.error("Error seeding admin user:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

seedAdmin();
