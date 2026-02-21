"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { CONSTRUCTS, LAYER_INFO, type LayerType } from "@/lib/constructs";
import { getScoreTier, formatPercentile } from "@/lib/format";

interface HeatmapClientProps {
  candidates: any[];
  roles: any[];
  weights: any[];
  cutlines: any[];
}

const CONSTRUCT_ORDER = Object.keys(CONSTRUCTS);

export function HeatmapClient({ candidates, roles, weights, cutlines }: HeatmapClientProps) {
  const router = useRouter();
  const [selectedRoleSlug, setSelectedRoleSlug] = useState(roles[0]?.slug || "");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const selectedRole = roles.find((r: any) => r.slug === selectedRoleSlug);
  const roleCutline = cutlines.find((c: any) => c.roleId === selectedRole?.id);
  const roleWeights = weights.filter((w: any) => w.roleId === selectedRole?.id);

  const highWeightConstructs = useMemo(() => {
    const sorted = [...roleWeights].sort((a: any, b: any) => b.weight - a.weight);
    return new Set(sorted.slice(0, 3).map((w: any) => w.constructId));
  }, [roleWeights]);

  const rows = useMemo(() => {
    return candidates
      .filter((c: any) => c.assessment?.subtestResults?.length > 0)
      .map((c: any) => {
        const composite = c.assessment?.compositeScores?.find(
          (cs: any) => cs.roleSlug === selectedRoleSlug
        );
        const scores: Record<string, number> = {};
        for (const r of c.assessment?.subtestResults || []) {
          scores[r.construct] = r.percentile;
        }
        return {
          id: c.id,
          name: `${c.firstName} ${c.lastName}`,
          firstName: c.firstName,
          lastName: c.lastName,
          composite: composite?.percentile ?? 0,
          passed: composite?.passed ?? false,
          scores,
        };
      })
      .sort((a, b) => b.composite - a.composite);
  }, [candidates, selectedRoleSlug]);

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else if (next.size < 3) next.add(id);
    setSelectedIds(next);
  };

  const handleCompare = () => {
    if (selectedIds.size >= 2) {
      router.push(`/compare?ids=${Array.from(selectedIds).join(",")}`);
    }
  };

  const getCellColor = (percentile: number) => {
    const tier = getScoreTier(percentile);
    return tier.color;
  };

  const getCellBg = (percentile: number) => {
    if (percentile >= 90) return "rgba(6, 95, 70, 0.15)";
    if (percentile >= 75) return "rgba(5, 150, 105, 0.12)";
    if (percentile >= 50) return "rgba(148, 163, 184, 0.1)";
    if (percentile >= 25) return "rgba(245, 158, 11, 0.12)";
    return "rgba(220, 38, 38, 0.12)";
  };

  const cutlineIndex = rows.findIndex((r) => !r.passed);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Role Matrix
          </h1>
          <p className="text-[10px] text-muted-foreground mt-0.5 uppercase tracking-wider">
            Candidate scores by construct for each role
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.size >= 2 && (
            <button
              onClick={handleCompare}
              className="px-3 py-1.5 bg-naib-gold text-naib-navy text-[10px] font-semibold uppercase tracking-wider hover:bg-naib-gold/90 transition-colors"
            >
              Compare ({selectedIds.size})
            </button>
          )}
          <select
            value={selectedRoleSlug}
            onChange={(e) => setSelectedRoleSlug(e.target.value)}
            className="h-7 border border-border px-2 text-[10px] bg-card text-foreground font-mono"
          >
            {roles.map((r: any) => (
              <option key={r.slug} value={r.slug}>{r.name}</option>
            ))}
          </select>
          <Link
            href={`/roles/${selectedRoleSlug}`}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-naib-gold border border-naib-gold/30 hover:bg-naib-gold/10 transition-colors"
          >
            Role Profile
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Heatmap */}
      <div className="bg-card border border-border overflow-x-auto">
        <table className="w-full text-[9px]">
          <thead>
            <tr className="border-b border-border">
              <th className="sticky left-0 bg-card z-10 py-1.5 px-1.5 text-left font-medium text-muted-foreground w-7" />
              <th className="sticky left-7 bg-card z-10 py-1.5 px-1.5 text-left font-medium text-muted-foreground uppercase tracking-wider min-w-[120px]">
                Candidate
              </th>
              <th className="py-1.5 px-1 text-center font-semibold text-foreground min-w-[38px] uppercase tracking-wider">
                CI
              </th>
              {CONSTRUCT_ORDER.map((key) => {
                const meta = CONSTRUCTS[key as keyof typeof CONSTRUCTS];
                const layerInfo = LAYER_INFO[meta.layer as LayerType];
                const isHighWeight = highWeightConstructs.has(key);

                return (
                  <th
                    key={key}
                    className={`py-1.5 px-1 text-center font-medium min-w-[36px] ${isHighWeight ? "border-l-2 border-l-naib-gold" : ""}`}
                    style={{ borderTop: `2px solid ${layerInfo.color}` }}
                    title={meta.name}
                  >
                    <span className="font-mono" style={{ color: layerInfo.color }}>{meta.abbreviation}</span>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={row.id}
                className={`border-b hover:bg-accent/30 transition-colors ${
                  cutlineIndex === i ? "border-b-2 border-b-naib-red/50 border-dashed" : "border-border/50"
                }`}
              >
                <td className="sticky left-0 bg-card py-0.5 px-1.5">
                  <input
                    type="checkbox"
                    checked={selectedIds.has(row.id)}
                    onChange={() => toggleSelect(row.id)}
                    className="border-border w-3 h-3"
                  />
                </td>
                <td className="sticky left-7 bg-card py-0.5 px-1.5">
                  <Link
                    href={`/candidates/${row.id}`}
                    className="text-[10px] font-medium text-foreground hover:text-naib-gold transition-colors"
                  >
                    {row.name}
                  </Link>
                </td>
                <td className="py-0.5 px-1 text-center">
                  <span
                    className="inline-flex items-center justify-center w-8 h-5 text-[9px] font-bold font-mono"
                    style={{
                      backgroundColor: getCellBg(row.composite),
                      color: getCellColor(row.composite),
                    }}
                  >
                    {row.composite}
                  </span>
                </td>
                {CONSTRUCT_ORDER.map((key) => {
                  const val = row.scores[key] ?? 0;
                  const isHighWeight = highWeightConstructs.has(key);
                  return (
                    <td
                      key={key}
                      className={`py-0.5 px-1 text-center ${isHighWeight ? "border-l-2 border-l-naib-gold/30" : ""}`}
                      title={`${CONSTRUCTS[key as keyof typeof CONSTRUCTS].name}: ${formatPercentile(val)}`}
                    >
                      <span
                        className="inline-flex items-center justify-center w-8 h-5 text-[9px] font-medium font-mono"
                        style={{
                          backgroundColor: getCellBg(val),
                          color: getCellColor(val),
                        }}
                      >
                        {val}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="flex items-center justify-between mt-2 text-[9px] text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className="font-medium uppercase tracking-wider">Tiers:</span>
          {[
            { label: "90+", color: "#065F46", bg: "rgba(6,95,70,0.15)" },
            { label: "75-89", color: "#059669", bg: "rgba(5,150,105,0.12)" },
            { label: "50-74", color: "#94A3B8", bg: "rgba(148,163,184,0.1)" },
            { label: "25-49", color: "#F59E0B", bg: "rgba(245,158,11,0.12)" },
            { label: "<25", color: "#DC2626", bg: "rgba(220,38,38,0.12)" },
          ].map((t) => (
            <div key={t.label} className="flex items-center gap-0.5">
              <span className="w-4 h-4 flex items-center justify-center text-[8px] font-bold font-mono" style={{ backgroundColor: t.bg, color: t.color }}>
                {t.label.split("-")[0]}
              </span>
              <span className="font-mono">{t.label}</span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-4 h-0.5 border-t-2 border-dashed border-naib-red/50" />
          <span className="uppercase tracking-wider">Cutline</span>
        </div>
      </div>
    </div>
  );
}
