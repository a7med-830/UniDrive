// Run this once to seed all 38 cars into the database:
//   npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import { allCars } from "../src/lib/cars";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding cars into Neon...");

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
        body:         car.body,
        color:        car.color,
        mileage:      car.mileage,
        mpg:          car.mpg,
        fuelType:     car.fuelType,
        image:        car.image,
        images:       car.images,
        badge:        car.badge ?? "",
        trim:         car.trim,
        engine:       car.engine,
        transmission: car.transmission,
        drivetrain:   car.drivetrain,
        seats:        car.seats,
        description:  car.description,
        features:     car.features,
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
