// GET  /api/cars  — list with optional filters
// POST /api/cars  — create a new car (admin only)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Prisma } from "@/generated/prisma";
import { z } from "zod";

// ─── Zod schema for creating a car ────────────────────────────────────────────
const carSchema = z.object({
  name:         z.string().min(1),
  make:         z.string().min(1),
  model:        z.string().min(1),
  year:         z.number().int().min(1900).max(2100),
  price:        z.number().int().positive(),
  body:         z.string().optional(),
  color:        z.string().optional(),
  mileage:      z.string().optional(),
  mpg:          z.string().optional(),
  fuelType:     z.enum(["Petrol", "Electric", "Hybrid"]),
  image:        z.string().optional(),
  images:       z.array(z.string()).default([]),
  badge:        z.string().optional(),
  trim:         z.string().optional(),
  engine:       z.string().optional(),
  transmission: z.string().optional(),
  drivetrain:   z.string().optional(),
  seats:        z.number().int().positive().optional(),
  description:  z.string().optional(),
  features:     z.array(z.string()).default([]),
  status:       z.enum(["available", "reserved", "sold"]).default("available"),
});

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  const brand    = searchParams.get("brand");
  const body     = searchParams.get("body");
  const fuel     = searchParams.get("fuel");
  const year     = searchParams.get("year");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const search   = searchParams.get("search");
  const sort     = searchParams.get("sort") ?? "price_asc";
  const limit    = parseInt(searchParams.get("limit") ?? "100");
  const offset   = parseInt(searchParams.get("offset") ?? "0");

  const where: Record<string, unknown> = {
    NOT: { status: "removed" },
  };

  if (brand)    where.make     = { equals: brand, mode: "insensitive" };
  if (body)     where.body     = { equals: body,  mode: "insensitive" };
  if (fuel)     where.fuelType = fuel;
  if (year)     where.year     = parseInt(year);
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: parseInt(minPrice) } : {}),
      ...(maxPrice ? { lte: parseInt(maxPrice) } : {}),
    };
  }
  if (search) {
    where.OR = [
      { name:  { contains: search, mode: "insensitive" } },
      { make:  { contains: search, mode: "insensitive" } },
      { model: { contains: search, mode: "insensitive" } },
    ];
  }

  const orderBy: Record<string, string> = {
    price_asc:  "price",
    price_desc: "price",
    year_desc:  "year",
    year_asc:   "year",
    newest:     "createdAt",
  };
  const field = orderBy[sort] ?? "price";
  const dir   = sort.endsWith("_desc") || sort === "newest" ? "desc" : "asc";

  try {
    const cars = await prisma.car.findMany({
      where,
      orderBy: { [field]: dir },
      take: limit,
      skip: offset,
    });
    return NextResponse.json(cars);
  } catch (err) {
    console.error("[GET /api/cars]", err);
    return NextResponse.json({ error: "Failed to fetch cars" }, { status: 500 });
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = carSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    // Keep PostgreSQL sequence aligned with seeded IDs so auto-increment does not collide.
    await prisma.$executeRawUnsafe(`
      SELECT setval(
        pg_get_serial_sequence('"Car"', 'id'),
        COALESCE((SELECT MAX(id) FROM "Car"), 1),
        true
      )
    `);

    const car = await prisma.car.create({ data: parsed.data });
    return NextResponse.json(car, { status: 201 });
  } catch (err) {
    // Fallback in case sequence drifts again under concurrent writes.
    if ((err as { code?: string })?.code === "P2002") {
      try {
        const lastCar = await prisma.car.findFirst({
          orderBy: { id: "desc" },
          select: { id: true },
        });
        const baseId = (lastCar?.id ?? 0) + 1;

        // Try a few IDs in case of concurrent inserts.
        for (let attempt = 0; attempt < 5; attempt += 1) {
          try {
            const car = await prisma.car.create({
              data: {
                ...parsed.data,
                id: baseId + attempt,
              },
            });
            return NextResponse.json(car, { status: 201 });
          } catch (createErr) {
            if ((createErr as { code?: string })?.code !== "P2002") {
              throw createErr;
            }
          }
        }
      } catch (retryErr) {
        console.error("[POST /api/cars retry]", retryErr);
      }
    }

    console.error("[POST /api/cars]", err);
    return NextResponse.json({ error: "Failed to create car" }, { status: 500 });
  }
}
