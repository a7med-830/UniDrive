// PUT    /api/admin/news/[id] — update an article
// DELETE /api/admin/news/[id] — delete an article

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSchema = z.object({
  title:    z.string().min(1).optional(),
  body:     z.string().optional(),
  category: z.string().optional(),
  status:   z.enum(["draft", "published"]).optional(),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articleId = parseInt(id);

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (parsed.data.status === "published") {
    data.publishedAt = new Date();
  }

  try {
    const article = await prisma.newsArticle.update({
      where: { id: articleId },
      data,
    });
    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const articleId = parseInt(id);

  try {
    await prisma.newsArticle.delete({ where: { id: articleId } });
    return NextResponse.json({ message: "Article deleted" });
  } catch {
    return NextResponse.json({ error: "Article not found" }, { status: 404 });
  }
}
