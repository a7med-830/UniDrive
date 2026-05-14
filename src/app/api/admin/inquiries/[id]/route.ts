// PATCH /api/admin/inquiries/[id] — update inquiry status

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["new", "contacted", "closed"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const inquiryId = parseInt(id);

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const inquiry = await prisma.inquiry.update({
      where: { id: inquiryId },
      data: { status: parsed.data.status },
    });
    return NextResponse.json(inquiry);
  } catch {
    return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
  }
}
