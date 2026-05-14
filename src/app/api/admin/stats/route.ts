// GET /api/admin/stats — dashboard summary numbers

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [totalCars, totalInquiries, pendingAppointments, publishedArticles] =
    await Promise.all([
      prisma.car.count({ where: { NOT: { status: "removed" } } }),
      prisma.inquiry.count(),
      prisma.appointment.count({ where: { status: "pending" } }),
      prisma.newsArticle.count({ where: { status: "published" } }),
    ]);

  return NextResponse.json({
    totalCars,
    totalInquiries,
    pendingAppointments,
    publishedArticles,
  });
}
