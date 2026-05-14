import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const appointmentSchema = z.object({
  carId:       z.number().int().positive(),
  clientName:  z.string().min(1),
  clientEmail: z.string().email().optional().or(z.literal('')),
  scheduledAt: z.string().datetime(), // expects ISO string
  notes:       z.string().optional(),
  status:      z.enum(["under reviewing", "confirmed", "completed", "cancelled"]).default("under reviewing"),
});

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        car: {
          select: { make: true, model: true, name: true, image: true }
        }
      },
      orderBy: { scheduledAt: 'desc' }
    });
    return NextResponse.json(appointments);
  } catch (err) {
    console.error("[GET /api/appointments]", err);
    return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = appointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const appointment = await prisma.appointment.create({ 
      data: {
        ...parsed.data,
        clientEmail: parsed.data.clientEmail || null,
      } 
    });
    return NextResponse.json(appointment, { status: 201 });
  } catch (err) {
    console.error("[POST /api/appointments]", err);
    return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 });
  }
}
