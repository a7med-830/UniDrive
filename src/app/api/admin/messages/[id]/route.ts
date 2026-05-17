import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || (session.user as { role?: string })?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const messageId = parseInt(id);
  if (Number.isNaN(messageId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    await prisma.contactMessage.delete({ where: { id: messageId } });
    return NextResponse.json({ message: "Deleted" });
  } catch (err) {
    console.error("[DELETE /api/admin/messages/[id]]", err);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
