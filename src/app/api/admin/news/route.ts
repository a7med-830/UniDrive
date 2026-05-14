// GET  /api/admin/news — list all articles
// POST /api/admin/news — create a new article

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSchema = z.object({
  title:    z.string().min(1),
  body:     z.string().optional(),
  category: z.string().optional(),
  status:   z.enum(["draft", "published"]).default("draft"),
});

export async function GET() {
  const articles = await prisma.newsArticle.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(articles);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data = {
    ...parsed.data,
    publishedAt: parsed.data.status === "published" ? new Date() : null,
  };

  try {
    const article = await prisma.newsArticle.create({ data });
    return NextResponse.json(article, { status: 201 });
  } catch (err) {
    console.error("[POST /api/admin/news]", err);
    return NextResponse.json({ error: "Failed to create article" }, { status: 500 });
  }
}
