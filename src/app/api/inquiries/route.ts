// POST /api/inquiries — submit a test-drive or vehicle inquiry

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const inquirySchema = z.object({
  carId:         z.number().int().positive(),
  name:          z.string().min(1, "Name is required"),
  email:         z.string().email("Invalid email address"),
  phone:         z.string().optional(),
  message:       z.string().optional(),
  preferredDate: z.string().datetime().optional(), // ISO 8601
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = inquirySchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { carId, name, email, phone, message, preferredDate } = parsed.data;

  // Verify the car exists
  const car = await prisma.car.findUnique({ where: { id: carId } });
  if (!car) {
    return NextResponse.json({ error: "Car not found" }, { status: 404 });
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        carId,
        name,
        email,
        phone,
        message,
        preferredDate: preferredDate ? new Date(preferredDate) : undefined,
      },
    });
    return NextResponse.json(
      { message: "Inquiry submitted successfully", id: inquiry.id },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/inquiries]", err);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}
