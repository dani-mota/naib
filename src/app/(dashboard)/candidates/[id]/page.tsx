import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProfileClient } from "@/components/profile/profile-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getCandidateData(id: string) {
  const candidate = await prisma.candidate.findUnique({
    where: { id },
    include: {
      primaryRole: true,
      notes: {
        include: { author: true },
        orderBy: { createdAt: "desc" },
      },
      assessment: {
        include: {
          subtestResults: true,
          compositeScores: true,
          predictions: true,
          redFlags: true,
          aiInteractions: true,
        },
      },
    },
  });

  if (!candidate) return null;

  const allRoles = await prisma.role.findMany({
    include: { compositeWeights: true },
  });

  const cutlines = await prisma.cutline.findMany();

  return {
    candidate: JSON.parse(JSON.stringify(candidate)),
    allRoles: JSON.parse(JSON.stringify(allRoles)),
    cutlines: JSON.parse(JSON.stringify(cutlines)),
  };
}

export default async function CandidateProfilePage({ params }: PageProps) {
  const { id } = await params;
  const data = await getCandidateData(id);

  if (!data) notFound();

  return <ProfileClient {...data} />;
}
