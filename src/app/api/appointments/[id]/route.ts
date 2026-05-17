import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updateAppointmentSchema = z.object({
  status: z.enum(["under reviewing", "confirmed", "completed", "cancelled"]).optional(),
  notes:  z.string().optional(),
  scheduledAt: z.string().datetime().optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const appointmentId = parseInt(id);
  if (isNaN(appointmentId)) {
    return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 });
  }

  try {
    const body = await req.json();
    const parsed = updateAppointmentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const { scheduledAt, ...rest } = parsed.data;
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        ...rest,
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
      },
      include: {
        car: { select: { make: true, model: true, name: true } }
      }
    });
    return NextResponse.json(appointment);
  } catch (err) {
    console.error("[PUT /api/appointments/[id]]", err);
    return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const appointmentId = parseInt(id);
  if (isNaN(appointmentId)) {
    return NextResponse.json({ error: "Invalid appointment ID" }, { status: 400 });
  }

  try {
    await prisma.appointment.delete({
      where: { id: appointmentId },
    });
    return NextResponse.json({ message: "Appointment deleted" });
  } catch (err) {
    console.error("[DELETE /api/appointments/[id]]", err);
    return NextResponse.json({ error: "Appointment not found or could not be deleted" }, { status: 500 });
  }
}
