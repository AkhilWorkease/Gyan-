import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

const prismaClientSingleton = () => {
  const dbUrl = process.env.DATABASE_URL && process.env.DATABASE_URL !== "undefined"
    ? process.env.DATABASE_URL
    : "file:./dev.db";
  
  const authToken = process.env.DATABASE_AUTH_TOKEN && process.env.DATABASE_AUTH_TOKEN !== "undefined"
    ? process.env.DATABASE_AUTH_TOKEN
    : undefined;

  const adapter = new PrismaLibSql({
    url: dbUrl,
    authToken: authToken,
  })
  return new PrismaClient({ adapter })
}

declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()

export default prisma

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma
