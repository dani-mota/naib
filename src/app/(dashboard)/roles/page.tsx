import { getHeatmapData } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { HeatmapClient } from "@/components/roles/heatmap-client";

export default async function RolesPage() {
  const session = await getSession();
  const orgId = session?.user.orgId ?? undefined;
  const data = await getHeatmapData(orgId);
  return <HeatmapClient {...data} />;
}
