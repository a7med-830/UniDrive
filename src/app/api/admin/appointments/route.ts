// GET  /api/admin/appointments — list all appointments
// POST /api/admin/appointments — create a new appointment

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  carId:        z.number().int().positive(),
  clientName:   z.string().min(1),
  clientEmail:  z.string().email().optional(),
  scheduledAt:  z.string().datetime(),
  notes:        z.string().optional(),
});

export async function GET() {
  const appointments = await prisma.appointment.findMany({
    orderBy: { scheduledAt: "asc" },
    include: {
      car: { select: { id: true, name: true, make: true, image: true } },
    },
  });
  return NextResponse.json(appointments);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { carId, clientName, clientEmail, scheduledAt, notes } = parsed.data;

  try {
    const appointment = await prisma.appointment.create({
      data: {
        carId,
        clientName,
        clientEmail,
        scheduledAt: new Date(scheduledAt),
        notes,
      },
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/appointments]", err);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
