// GET  /api/news  — list all published articles (public)
// POST /api/news  — create a new article (admin only)
// DELETE /api/news?id=X — delete an article (admin only)

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const articleSchema = z.object({
  title:       z.string().min(1, "Title is required"),
  image:       z.string().optional(),
  category:    z.string().optional(),
  publishedAt: z.string().optional(), // ISO date string
});

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    const articles = await prisma.newsArticle.findMany({
      orderBy: { publishedAt: "desc" },
    });
    return NextResponse.json(articles);
  } catch (err) {
    console.error("[GET /api/news]", err);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const article = await prisma.newsArticle.create({
      data: {
        title:       parsed.data.title,
        image:       parsed.data.image || null,
        category:    parsed.data.category || null,
        publishedAt: parsed.data.publishedAt
          ? new Date(parsed.data.publishedAt)
          : new Date(),
      },
    });
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.error("[POST /api/news]", err);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}

// ─── PUT ──────────────────────────────────────────────────────────────────────
export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(req.nextUrl.searchParams.get("id") ?? "");
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json();
  const parsed = articleSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const article = await prisma.newsArticle.update({
      where: { id },
      data: {
        title:       parsed.data.title,
        image:       parsed.data.image || null,
        category:    parsed.data.category || null,
        publishedAt: parsed.data.publishedAt
          ? new Date(parsed.data.publishedAt)
          : new Date(),
      },
    });
    return NextResponse.json(article, { status: 200 });
  } catch (err) {
    console.error("[PUT /api/news]", err);
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = parseInt(req.nextUrl.searchParams.get("id") ?? "");
  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.newsArticle.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[DELETE /api/news]", err);
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
