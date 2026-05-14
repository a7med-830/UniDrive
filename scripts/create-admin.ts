// Run this ONCE to create the admin user:
//   npx ts-node --compiler-options '{"module":"CommonJS"}' scripts/create-admin.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email    = "admin@unidrive.com";
  const password = "UniDrive2026!";          // ← change this before running

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    console.log("⚠️  Admin already exists:", email);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.adminUser.create({ data: { email, passwordHash } });
  console.log("✅ Admin user created:", email);
  console.log("🔑 Password:", password);
  console.log("⚠️  Change the password in this file before committing!");
}

main()
  .catch((e) => {
    console.error("❌ Failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
