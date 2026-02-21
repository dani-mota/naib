import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id: candidateId } = await params;
  const body = await request.json();
  const { content, authorId } = body;

  if (!content?.trim()) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  // If no authorId provided, use the first user in the system
  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const firstUser = await prisma.user.findFirst();
    if (!firstUser) {
      return NextResponse.json({ error: "No users found" }, { status: 500 });
    }
    resolvedAuthorId = firstUser.id;
  }

  const note = await prisma.note.create({
    data: {
      candidateId,
      authorId: resolvedAuthorId,
      content: content.trim(),
    },
    include: { author: true },
  });

  return NextResponse.json(note, { status: 201 });
}
