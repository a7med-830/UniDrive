// POST /api/contact — submit a general contact message

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const contactSchema = z.object({
  name:    z.string().min(1, "Name is required"),
  email:   z.string().email("Invalid email address"),
  phone:   z.string().optional(),
  message: z.string().min(5, "Message must be at least 5 characters"),
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = contactSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  try {
    await prisma.contactMessage.create({ data: parsed.data });
    return NextResponse.json(
      { message: "Message received. We'll be in touch within 24 hours." },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/contact]", err);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
