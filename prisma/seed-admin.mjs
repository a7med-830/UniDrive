import { readFileSync } from 'fs';
import { resolve } from 'path';

// Inject .env.local into process.env BEFORE any imports that need DATABASE_URL
const envPath = resolve(process.cwd(), '.env.local');
try {
  const envContent = readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?\s*$/);
    if (match) process.env[match[1]] = match[2];
  }
} catch (err) {
  console.log("Could not read .env.local, falling back to existing process.env");
}

const { PrismaClient } = await import('../src/generated/prisma/index.js');
const { PrismaNeon }   = await import('@prisma/adapter-neon');
const bcrypt = (await import('bcryptjs')).default;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma  = new PrismaClient({ adapter });

async function main() {
  const email = "admin@unidrive.com";
  const password = "password123"; // Default password

  console.log(`🌱 Checking for existing admin user...`);
  
  const existingAdmin = await prisma.user.findUnique({ where: { email } });
  
  if (existingAdmin) {
    console.log(`⚠️ Admin user (${email}) already exists. Skipping creation.`);
  } else {
    console.log(`Creating admin user...`);
    const hashedPassword = await bcrypt.hash(password, 10);
    
    await prisma.user.create({
      data: {
        name: "Super Admin",
        email,
        password: hashedPassword,
        role: "admin",
      }
    });
    console.log(`✅ Admin user created successfully!`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Please make sure to log in and change this password if possible!`);
  }
}

main()
  .catch(e => { 
    console.error('❌ Seed failed:', e.message ?? e); 
    process.exit(1); 
  })
  .finally(() => prisma.$disconnect());
