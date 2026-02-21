import prisma from "@/lib/prisma";
import { PipelineCards } from "@/components/dashboard/pipeline-cards";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { CandidateTable } from "@/components/dashboard/candidate-table";

async function getDashboardData() {
  const [candidates, roles] = await Promise.all([
    prisma.candidate.findMany({
      include: {
        primaryRole: true,
        assessment: {
          include: {
            compositeScores: true,
            redFlags: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.role.findMany({
      include: {
        candidates: true,
      },
    }),
  ]);

  const rolePipelines = roles.map((role) => {
    const roleCandidates = candidates.filter((c) => c.primaryRoleId === role.id);
    return {
      slug: role.slug,
      name: role.name,
      total: roleCandidates.length,
      recommended: roleCandidates.filter((c) => c.status === "RECOMMENDED").length,
      review: roleCandidates.filter((c) => c.status === "REVIEW_REQUIRED").length,
      doNotAdvance: roleCandidates.filter((c) => c.status === "DO_NOT_ADVANCE").length,
    };
  });

  const totalAssessed = candidates.length;
  const recommended = candidates.filter((c) => c.status === "RECOMMENDED").length;
  const strongFitRate = totalAssessed > 0 ? Math.round((recommended / totalAssessed) * 100) : 0;

  const durations = candidates
    .map((c) => c.assessment?.durationMinutes)
    .filter((d): d is number => d != null);
  const avgDuration = durations.length > 0 ? Math.round(durations.reduce((a, b) => a + b, 0) / durations.length) : 0;

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyVolume = candidates.filter((c) => new Date(c.createdAt) > oneWeekAgo).length;

  return {
    candidates: JSON.parse(JSON.stringify(candidates)),
    rolePipelines,
    stats: { totalAssessed, strongFitRate, avgDuration, weeklyVolume },
  };
}

export default async function DashboardPage() {
  const { candidates, rolePipelines, stats } = await getDashboardData();

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Assessment Dashboard
        </h1>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
          Overview of your talent assessment pipeline
        </p>
      </div>

      <QuickStats {...stats} />

      <div>
        <h2 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Pipeline by Role</h2>
        <PipelineCards roles={rolePipelines} />
      </div>

      <div>
        <h2 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">All Candidates</h2>
        <CandidateTable candidates={candidates} />
      </div>
    </div>
  );
}
