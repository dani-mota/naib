import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const VALID_STATUSES = ["RECOMMENDED", "REVIEW_REQUIRED", "DO_NOT_ADVANCE", "INCOMPLETE", "SCORING"];

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { candidateIds, status } = body;

  if (!Array.isArray(candidateIds) || candidateIds.length === 0) {
    return NextResponse.json({ error: "candidateIds array is required" }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  const result = await prisma.candidate.updateMany({
    where: { id: { in: candidateIds } },
    data: { status },
  });

  return NextResponse.json({ updated: result.count });
}
