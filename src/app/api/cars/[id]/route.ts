// GET    /api/cars/[id]  — single car
// PUT    /api/cars/[id]  — update (admin only)
// DELETE /api/cars/[id]  — soft-delete (admin only)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateSchema = z.object({
  name:         z.string().min(1).optional(),
  make:         z.string().min(1).optional(),
  model:        z.string().min(1).optional(),
  year:         z.number().int().optional(),
  price:        z.number().int().positive().optional(),
  body:         z.string().optional(),
  color:        z.string().optional(),
  mileage:      z.string().optional(),
  mpg:          z.string().optional(),
  fuelType:     z.enum(["Petrol", "Electric", "Hybrid"]).optional(),
  image:        z.string().optional(),
  images:       z.array(z.string()).optional(),
  badge:        z.string().optional(),
  trim:         z.string().optional(),
  engine:       z.string().optional(),
  transmission: z.string().optional(),
  drivetrain:   z.string().optional(),
  seats:        z.number().int().positive().optional(),
  description:  z.string().optional(),
  features:     z.array(z.string()).optional(),
  status:       z.enum(["available", "reserved", "sold"]).optional(),
});

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const carId = parseInt(id);

  if (isNaN(carId)) {
    return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
  }

  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  return NextResponse.json(car);
}

// ─── PUT ──────────────────────────────────────────────────────────────────────
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const carId = parseInt(id);
  if (isNaN(carId)) {
    return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const car = await prisma.car.update({
      where: { id: carId },
      data: parsed.data,
    });
    return NextResponse.json(car);
  } catch {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const carId = parseInt(id);
  if (isNaN(carId)) {
    return NextResponse.json({ error: "Invalid car ID" }, { status: 400 });
  }

  try {
    // Soft-delete: set status to 'removed' so data is preserved
    await prisma.car.update({
      where: { id: carId },
      data: { status: "removed" },
    });
    return NextResponse.json({ message: "Car removed" });
  } catch {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }
}
