// PATCH /api/admin/appointments/[id] — update appointment status

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
  notes:  z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const apptId = parseInt(id);

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const appointment = await prisma.appointment.update({
      where: { id: apptId },
      data: parsed.data,
    });
    return NextResponse.json(appointment);
  } catch {
    return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  }
}
