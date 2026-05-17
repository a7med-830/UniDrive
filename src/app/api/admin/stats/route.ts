import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any)?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

    // Run all queries in parallel
    const [
      allCars,
      totalInquiries,
      newInquiries,
      totalAppointments,
      pendingAppointments,
      upcomingAppointments,
      recentInquiries,
      recentCars,
      topCars,
      soldThisMonth,
      soldLastMonth,
      totalContactMessages,
      recentContactMessages,
    ] = await Promise.all([
      // All cars for inventory breakdown
      prisma.car.findMany({
        select: { id: true, status: true, price: true },
      }),

      // Inquiries
      prisma.inquiry.count(),
      prisma.inquiry.count({ where: { status: "new" } }),

      // Appointments
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "pending" } }),
      prisma.appointment.findMany({
        where: {
          scheduledAt: { gte: now },
          status: { not: "cancelled" },
        },
        orderBy: { scheduledAt: "asc" },
        take: 5,
        include: {
          car: { select: { name: true, make: true, model: true, image: true } },
        },
      }),

      // Recent inquiries
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        include: {
          car: { select: { name: true, make: true, image: true } },
        },
      }),

      // Recently added cars
      prisma.car.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
        select: {
          id: true, name: true, make: true, model: true,
          year: true, price: true, status: true,
          fuelType: true, image: true, createdAt: true,
        },
      }),

      // Top cars by price (sold)
      prisma.car.findMany({
        where: { status: "sold" },
        orderBy: { price: "desc" },
        take: 8,
        select: {
          id: true, name: true, make: true, model: true,
          price: true, fuelType: true, image: true,
          status: true, createdAt: true,
        },
      }),

      // Revenue this month (cars created this month that are sold)
      prisma.car.findMany({
        where: {
          status: "sold",
          createdAt: { gte: startOfMonth },
        },
        select: { price: true },
      }),

      // Revenue last month
      prisma.car.findMany({
        where: {
          status: "sold",
          createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
        },
        select: { price: true },
      }),

      prisma.contactMessage.count(),

      prisma.contactMessage.findMany({
        orderBy: { createdAt: "desc" },
        take: 6,
      }),
    ]);

    // Compute inventory stats from allCars
    const available = allCars.filter(c => c.status === "available");
    const reserved  = allCars.filter(c => c.status === "reserved");
    const sold      = allCars.filter(c => c.status === "sold");
    const totalValue = available.reduce((s, c) => s + c.price, 0);

    // Revenue
    const revenueThisMonth = soldThisMonth.reduce((s, c) => s + c.price, 0);
    const revenueLastMonth = soldLastMonth.reduce((s, c) => s + c.price, 0);
    const revenueGrowth =
      revenueLastMonth > 0
        ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
        : soldThisMonth.length > 0 ? 100 : 0;

    return NextResponse.json({
      inventory: {
        total:      allCars.length,
        available:  available.length,
        reserved:   reserved.length,
        sold:       sold.length,
        totalValue,
      },
      inquiries: {
        total: totalInquiries,
        new:   newInquiries,
      },
      contactMessages: {
        total: totalContactMessages,
        recent: recentContactMessages,
      },
      appointments: {
        total:    totalAppointments,
        pending:  pendingAppointments,
        upcoming: upcomingAppointments,
      },
      revenue: {
        thisMonth:     revenueThisMonth,
        lastMonth:     revenueLastMonth,
        growth:        revenueGrowth,
        soldThisMonth: soldThisMonth.length,
      },
      recentInquiries,
      recentCars,
      topCars,
    });
  } catch (err: any) {
    console.error("[GET /api/admin/stats]", err);
    return NextResponse.json(
      { error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
