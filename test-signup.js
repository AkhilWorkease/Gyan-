const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { createClient } = require("@libsql/client");
const { PrismaLibSQL } = require("@prisma/adapter-libsql");

const libsql = createClient({
  url: "file:./dev.db",
});
const adapter = new PrismaLibSQL(libsql);
const prisma = new PrismaClient({ adapter });

async function testSignup() {
  const email = "testsignup@example.com";
  const password = "password123";
  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: "Test Signup",
      email,
      password: hashedPassword,
    }
  });

  console.log("Created user:", user);
}

testSignup();
