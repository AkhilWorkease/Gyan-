import * as dotenv from 'dotenv'
dotenv.config()
import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'
import { createClient } from '@libsql/client'

async function main() {
  console.log("DATABASE_URL:", process.env.DATABASE_URL)
  
  const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || "file:./dev.db",
  })
  
  const prisma = new PrismaClient({ adapter })
  
  try {
    const user = await prisma.user.findFirst()
    console.log("Success:", user)
  } catch (e) {
    console.error("Error:", e)
  }
}

main()
