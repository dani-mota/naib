import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { RoleDetailClient } from "@/components/roles/role-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getRoleDetailData(slug: string) {
  const role = await prisma.role.findFirst({
    where: { slug },
    include: {
      compositeWeights: true,
      cutlines: true,
    },
  });

  if (!role) return null;

  const [allRoles, candidates] = await Promise.all([
    prisma.role.findMany({ orderBy: { name: "asc" } }),
    prisma.candidate.findMany({
      include: {
        primaryRole: true,
        assessment: {
          include: {
            subtestResults: true,
            compositeScores: true,
            redFlags: true,
          },
        },
      },
    }),
  ]);

  return {
    role: JSON.parse(JSON.stringify(role)),
    allRoles: JSON.parse(JSON.stringify(allRoles)),
    candidates: JSON.parse(JSON.stringify(candidates)),
  };
}

export default async function RoleDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getRoleDetailData(slug);

  if (!data) notFound();

  return <RoleDetailClient {...data} />;
}
