import { getDashboardData, getDemoOrgId } from "@/lib/data";
import { PipelineCards } from "@/components/dashboard/pipeline-cards";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { CandidateTable } from "@/components/dashboard/candidate-table";
import { AttentionItems } from "@/components/dashboard/attention-items";
import { redirect } from "next/navigation";

export default async function TutorialDashboardPage() {
  const demoOrgId = await getDemoOrgId();
  if (!demoOrgId) redirect("/login");

  const { candidates, rolePipelines, stats } = await getDashboardData(demoOrgId);

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

      <AttentionItems candidates={candidates} />

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
