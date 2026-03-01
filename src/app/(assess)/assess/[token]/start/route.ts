import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ token: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { token } = await params;

  const invitation = await prisma.assessmentInvitation.findUnique({
    where: { linkToken: token },
    include: { candidate: true },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Invalid token" }, { status: 404 });
  }

  if (invitation.status === "EXPIRED" || new Date() > invitation.expiresAt) {
    return NextResponse.json({ error: "Invitation expired" }, { status: 410 });
  }

  if (invitation.status === "COMPLETED") {
    return NextResponse.json({ error: "Assessment already completed" }, { status: 400 });
  }

  // Check if assessment already exists
  const existing = await prisma.assessment.findUnique({
    where: { candidateId: invitation.candidateId },
  });

  if (existing) {
    return NextResponse.json({ assessmentId: existing.id });
  }

  // Create assessment and update statuses
  const result = await prisma.$transaction(async (tx) => {
    const assessment = await tx.assessment.create({
      data: {
        candidateId: invitation.candidateId,
        startedAt: new Date(),
      },
    });

    await tx.assessmentInvitation.update({
      where: { id: invitation.id },
      data: { status: "STARTED" },
    });

    await tx.candidate.update({
      where: { id: invitation.candidateId },
      data: { status: "INCOMPLETE" },
    });

    return assessment;
  });

  return NextResponse.json({ assessmentId: result.id });
}
