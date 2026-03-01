import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;
  const body = await request.json();
  const { assessmentId, difficulty, fairness, faceValidity, openFeedback } = body;

  // Validate token matches assessment via candidate
  const invitation = await prisma.assessmentInvitation.findFirst({
    where: { linkToken: token },
    include: {
      candidate: {
        include: { assessment: true },
      },
    },
  });

  if (
    !invitation ||
    !invitation.candidate.assessment ||
    invitation.candidate.assessment.id !== assessmentId
  ) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  // Check for existing survey
  const existing = await prisma.postAssessmentSurvey.findUnique({
    where: { assessmentId },
  });

  if (existing) {
    return NextResponse.json({ error: "Survey already submitted" }, { status: 409 });
  }

  await prisma.postAssessmentSurvey.create({
    data: {
      assessmentId,
      difficulty,
      fairness,
      faceValidity,
      openFeedback,
    },
  });

  return NextResponse.json({ success: true });
}
