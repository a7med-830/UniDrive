// Run once to seed cars (requires `npx prisma generate` first):
//   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
//
// Prefer the maintained ESM script: node prisma/seed.mjs

import { resolve } from "path";
import { config } from "dotenv";
import { PrismaClient } from "../src/generated/prisma";
import { PrismaNeon } from "@prisma/adapter-neon";
import { allCars } from "../src/lib/cars";

config({ path: resolve(process.cwd(), ".env.local") });

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding cars into Neon...");

  for (const car of allCars) {
    await prisma.car.upsert({
      where: { id: car.id },
      update: {},
      create: {
        id: car.id,
        name: car.name,
        make: car.make,
        model: car.model,
        year: car.year,
        price: car.price,
        body: car.body,
        color: car.color,
        mileage: car.mileage,
        mpg: car.mpg,
        fuelType: car.fuelType,
        image: car.image,
        images: car.images,
        badge: car.badge ?? "",
        trim: car.trim,
        engine: car.engine,
        transmission: car.transmission,
        drivetrain: car.drivetrain,
        seats: car.seats,
        description: car.description,
        features: car.features,
      },
    });
    console.log(`  ✓ ${car.make} ${car.name} (id: ${car.id})`);
  }

  console.log(`\n✅ Done! Seeded ${allCars.length} cars.`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
