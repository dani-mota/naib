import prisma from "@/lib/prisma";
import { HeatmapClient } from "@/components/roles/heatmap-client";

async function getHeatmapData() {
  const [candidates, roles, weights, cutlines] = await Promise.all([
    prisma.candidate.findMany({
      include: {
        primaryRole: true,
        assessment: {
          include: {
            subtestResults: true,
            compositeScores: true,
          },
        },
      },
    }),
    prisma.role.findMany(),
    prisma.compositeWeight.findMany(),
    prisma.cutline.findMany(),
  ]);

  return {
    candidates: JSON.parse(JSON.stringify(candidates)),
    roles: JSON.parse(JSON.stringify(roles)),
    weights: JSON.parse(JSON.stringify(weights)),
    cutlines: JSON.parse(JSON.stringify(cutlines)),
  };
}

export default async function RolesPage() {
  const data = await getHeatmapData();
  return <HeatmapClient {...data} />;
}
