import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { token } = await params;
  const body = await request.json();
  const { itemId, itemType, response, responseTimeMs, confidence } = body;

  if (!itemId || !response) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const invitation = await prisma.assessmentInvitation.findUnique({
    where: { linkToken: token },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  const assessment = await prisma.assessment.findUnique({
    where: { candidateId: invitation.candidateId },
  });

  if (!assessment) {
    return NextResponse.json({ error: "Assessment not found" }, { status: 404 });
  }

  // Upsert the response (idempotent)
  const itemResponse = await prisma.itemResponse.upsert({
    where: {
      assessmentId_itemId: {
        assessmentId: assessment.id,
        itemId,
      },
    },
    create: {
      assessmentId: assessment.id,
      itemId,
      itemType: itemType || "MULTIPLE_CHOICE",
      response,
      responseTimeMs: responseTimeMs || null,
      confidence: confidence || null,
    },
    update: {
      response,
      responseTimeMs: responseTimeMs || null,
      confidence: confidence || null,
    },
  });

  return NextResponse.json({ id: itemResponse.id });
}
