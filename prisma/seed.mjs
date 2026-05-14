// prisma/seed.mjs — plain ESM, uses the Neon adapter like the app does
import { readFileSync } from 'fs';
import { resolve } from 'path';

// Inject .env.local into process.env BEFORE any imports that need DATABASE_URL
const envPath = resolve(process.cwd(), '.env.local');
const envContent = readFileSync(envPath, 'utf8');
for (const line of envContent.split('\n')) {
  const match = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?\s*$/);
  if (match) process.env[match[1]] = match[2];
}

const { PrismaClient } = await import('../src/generated/prisma/index.js');
const { PrismaNeon }   = await import('@prisma/adapter-neon');
const { allCars }      = await import('./carsData.mjs');

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL });
const prisma  = new PrismaClient({ adapter });

async function main() {
  console.log(`🌱 Seeding ${allCars.length} cars into Neon...`);
  for (const car of allCars) {
    await prisma.car.upsert({
      where: { id: car.id },
      update: {},
      create: {
        id:           car.id,
        name:         car.name,
        make:         car.make,
        model:        car.model,
        year:         car.year,
        price:        car.price,
        body:         car.body         ?? '',
        color:        car.color        ?? '',
        mileage:      car.mileage      ?? '',
        mpg:          car.mpg          ?? '',
        fuelType:     car.fuelType,
        image:        car.image        ?? '',
        images:       car.images       ?? [],
        badge:        car.badge        ?? '',
        trim:         car.trim         ?? '',
        engine:       car.engine       ?? '',
        transmission: car.transmission ?? '',
        drivetrain:   car.drivetrain   ?? '',
        seats:        car.seats        ?? 5,
        description:  car.description  ?? '',
        features:     car.features     ?? [],
      },
    });
    console.log(`  ✓ ${car.make} ${car.name}`);
  }
  console.log(`\n✅ Done! Seeded ${allCars.length} cars.`);
}

main()
  .catch(e => { console.error('❌ Seed failed:', e.message ?? e); process.exit(1); })
  .finally(() => prisma.$disconnect());
