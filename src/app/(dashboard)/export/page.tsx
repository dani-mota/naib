export const dynamic = "force-dynamic";

import { requireAuth } from "@/lib/auth";
import { ExportPanel } from "@/components/dashboard/export-panel";
import { redirect } from "next/navigation";

export default async function ExportPage() {
  const session = await requireAuth();

  // Only TA_LEADER and ADMIN can access exports
  if (!["TA_LEADER", "ADMIN"].includes(session.user.role)) {
    redirect("/dashboard");
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Data Export
        </h1>
        <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
          Download assessment data for analysis
        </p>
      </div>

      <div className="max-w-xl">
        <ExportPanel />
      </div>
    </div>
  );
}
