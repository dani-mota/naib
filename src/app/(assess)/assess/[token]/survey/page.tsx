import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { SurveyForm } from "@/components/assess/survey-form";

interface SurveyPageProps {
  params: Promise<{ token: string }>;
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const { token } = await params;

  const invitation = await prisma.assessmentInvitation.findFirst({
    where: { linkToken: token },
    include: {
      candidate: {
        include: {
          assessment: {
            include: { survey: true },
          },
        },
      },
    },
  });

  if (!invitation || !invitation.candidate.assessment) {
    notFound();
  }

  const assessment = invitation.candidate.assessment;

  // Already submitted survey
  if (assessment.survey) {
    return (
      <div className="max-w-lg mx-auto mt-24 px-6 text-center">
        <div className="bg-card border border-border p-8">
          <h1
            className="text-xl font-bold text-foreground mb-2"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Survey Already Submitted
          </h1>
          <p className="text-xs text-muted-foreground">
            Thank you — your feedback has already been recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <SurveyForm
      token={token}
      candidateName={`${invitation.candidate.firstName} ${invitation.candidate.lastName}`}
      assessmentId={assessment.id}
    />
  );
}
