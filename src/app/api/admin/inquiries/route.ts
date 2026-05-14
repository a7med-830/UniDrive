// GET /api/admin/inquiries — list all inquiries with car info

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const inquiries = await prisma.inquiry.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      car: { select: { id: true, name: true, make: true, image: true } },
    },
  });
  return NextResponse.json(inquiries);
}
