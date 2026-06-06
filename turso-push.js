const { createClient } = require("@libsql/client");
const fs = require("fs");
const path = require("path");

const url = "libsql://gyan-db-akhilworkease.aws-ap-south-1.turso.io";
const authToken = "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Nzk4NzE2OTEsImlkIjoiMDE5ZTY4OWMtMTkwMS03ZGUwLThmMjgtYjFkM2U5YjhmZDU5IiwicmlkIjoiMmY3OWU2OTUtMDhmZS00MWIxLTkxNGQtZGVhNzZkNTdjODJjIn0.1uhju_AN7EnvUECTuZvLsDuox2__W4V2QLiBLEtlXP0poyh_shzRHO0WBGHsr8HI-1yZQU4kAce3MN7dRd2qAg";

async function pushToTurso() {
  console.log("Connecting to Turso...");
  const client = createClient({ url, authToken });

  const migrationsDir = path.join(__dirname, "prisma/migrations");
  const migrations = fs.readdirSync(migrationsDir).filter(f => f.endsWith("_init"));
  
  if (migrations.length === 0) {
    console.error("No migration folder found.");
    return;
  }

  const sqlPath = path.join(migrationsDir, migrations[0], "migration.sql");
  const sqlContent = fs.readFileSync(sqlPath, "utf-8");

  // The SQL file contains multiple statements separated by semicolon.
  // We need to execute them.
  const statements = sqlContent.split(";").map(s => s.trim()).filter(s => s.length > 0);

  console.log(`Executing ${statements.length} SQL statements on Turso...`);
  
  try {
    for (const stmt of statements) {
      // Prisma migrations might contain comments or PRAGMA that could throw, but we'll try running them directly
      console.log("Executing:", stmt.substring(0, 50) + "...");
      await client.execute(stmt);
    }
    console.log("✅ Successfully pushed database schema to Turso!");
  } catch (error) {
    console.error("❌ Failed to push schema:", error);
  }
}

pushToTurso();
