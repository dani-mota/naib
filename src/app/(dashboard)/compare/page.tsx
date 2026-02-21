import prisma from "@/lib/prisma";
import { CompareClient } from "@/components/compare/compare-client";

interface PageProps {
  searchParams: Promise<{ ids?: string }>;
}

async function getCompareData(ids: string[]) {
  const candidates = await prisma.candidate.findMany({
    where: { id: { in: ids } },
    include: {
      primaryRole: true,
      assessment: {
        include: {
          subtestResults: true,
          compositeScores: true,
          predictions: true,
          redFlags: true,
        },
      },
    },
  });

  const roles = await prisma.role.findMany();

  return {
    candidates: JSON.parse(JSON.stringify(candidates)),
    roles: JSON.parse(JSON.stringify(roles)),
  };
}

export default async function ComparePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const ids = params.ids?.split(",").filter(Boolean) || [];

  if (ids.length < 2) {
    return (
      <div className="p-6">
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <h2 className="text-lg font-semibold text-naib-navy mb-2">Select Candidates to Compare</h2>
          <p className="text-sm text-naib-slate">
            Go to the{" "}
            <a href="/roles" className="text-naib-blue hover:underline">Role Matrix</a>{" "}
            and select 2-3 candidates to compare side-by-side.
          </p>
        </div>
      </div>
    );
  }

  const data = await getCompareData(ids);
  return <CompareClient {...data} />;
}
