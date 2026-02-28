"use client";

import { useState, useRef } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { Download } from "lucide-react";
import { CONSTRUCTS, LAYER_INFO, type LayerType } from "@/lib/constructs";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreBar } from "@/components/ui/score-bar";
import { captureElementAsPNG, downloadCSV } from "@/lib/export";

const CANDIDATE_COLORS = ["#2563EB", "#059669", "#D97706"];

interface CompareClientProps {
  candidates: any[];
  roles: any[];
}

export function CompareClient({ candidates, roles }: CompareClientProps) {
  const compareRef = useRef<HTMLDivElement>(null);
  const [selectedRoleSlug, setSelectedRoleSlug] = useState(
    candidates[0]?.primaryRole?.slug || roles[0]?.slug
  );

  const constructKeys = Object.keys(CONSTRUCTS);

  const handleExportPNG = async () => {
    if (compareRef.current) {
      await captureElementAsPNG(compareRef.current, "aci-comparison.png");
    }
  };

  const handleExportCSV = () => {
    const headers = ["Construct", ...candidates.map((c: any) => `${c.firstName} ${c.lastName}`)];
    const csvRows = constructKeys.map((key) => {
      const meta = CONSTRUCTS[key as keyof typeof CONSTRUCTS];
      return [
        meta.name,
        ...candidates.map((c: any) => {
          const r = c.assessment?.subtestResults?.find((r: any) => r.construct === key);
          return String(r?.percentile ?? 0);
        }),
      ];
    });
    downloadCSV("aci-comparison.csv", headers, csvRows);
  };

  const chartData = constructKeys.map((key) => {
    const meta = CONSTRUCTS[key as keyof typeof CONSTRUCTS];
    const entry: any = {
      construct: meta.abbreviation,
      fullName: meta.name,
    };
    candidates.forEach((c: any, i: number) => {
      const result = c.assessment?.subtestResults?.find((r: any) => r.construct === key);
      entry[`c${i}`] = result?.percentile ?? 0;
    });
    return entry;
  });

  return (
    <div ref={compareRef} className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Candidate Comparison
          </h1>
          <p className="text-xs text-muted-foreground mt-1 uppercase tracking-wider">
            Comparing {candidates.length} candidates side-by-side
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border hover:bg-accent transition-colors"
          >
            <Download className="w-3 h-3" />
            CSV
          </button>
          <button
            onClick={handleExportPNG}
            className="flex items-center gap-1 px-2.5 py-1.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground border border-border hover:bg-accent transition-colors"
          >
            <Download className="w-3 h-3" />
            PNG
          </button>
          <select
            value={selectedRoleSlug}
            onChange={(e) => setSelectedRoleSlug(e.target.value)}
            className="h-8 border border-border px-3 text-xs bg-card text-foreground font-mono"
          >
            {roles.map((r: any) => (
              <option key={r.slug} value={r.slug}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidate cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {candidates.map((c: any, i: number) => {
          const composite = c.assessment?.compositeScores?.find(
            (cs: any) => cs.roleSlug === selectedRoleSlug
          );
          return (
            <div key={c.id} className="bg-card border-2 p-4" style={{ borderColor: CANDIDATE_COLORS[i] }}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-9 h-9 flex items-center justify-center text-white font-semibold text-xs"
                  style={{ backgroundColor: CANDIDATE_COLORS[i] }}
                >
                  {c.firstName[0]}{c.lastName[0]}
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{c.firstName} {c.lastName}</p>
                  <p className="text-[10px] text-muted-foreground font-mono uppercase">{c.primaryRole.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={c.status} size="sm" />
                <span className="text-lg font-bold font-mono" style={{ color: CANDIDATE_COLORS[i] }}>
                  {composite?.percentile ?? "—"}
                </span>
              </div>
              <ScoreBar percentile={composite?.percentile ?? 0} height={3} />
            </div>
          );
        })}
      </div>

      {/* Overlaid Spider Chart */}
      <div className="bg-card border border-border p-5">
        <h2 className="text-xs font-semibold text-foreground mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Construct Overlay
        </h2>
        <div className="h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis dataKey="construct" tick={{ fill: "var(--muted-foreground)", fontSize: 10 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 9 }} tickCount={5} />
              {candidates.map((c: any, i: number) => (
                <Radar
                  key={c.id}
                  name={`${c.firstName} ${c.lastName}`}
                  dataKey={`c${i}`}
                  stroke={CANDIDATE_COLORS[i]}
                  fill={CANDIDATE_COLORS[i]}
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              ))}
              <Tooltip />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Construct-by-construct table */}
      <div className="bg-card border border-border overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border bg-accent/30">
              <th className="py-2.5 px-4 text-left font-medium text-muted-foreground uppercase tracking-wider text-[10px]">Construct</th>
              {candidates.map((c: any, i: number) => (
                <th key={c.id} className="py-2.5 px-4 text-center font-medium text-[10px] uppercase tracking-wider" style={{ color: CANDIDATE_COLORS[i] }}>
                  {c.firstName} {c.lastName[0]}.
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {constructKeys.map((key) => {
              const meta = CONSTRUCTS[key as keyof typeof CONSTRUCTS];
              const layerInfo = LAYER_INFO[meta.layer as LayerType];
              const scores = candidates.map((c: any) => {
                const r = c.assessment?.subtestResults?.find((r: any) => r.construct === key);
                return r?.percentile ?? 0;
              });
              const maxScore = Math.max(...scores);

              return (
                <tr key={key} className="border-b border-border/50">
                  <td className="py-2.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2" style={{ backgroundColor: layerInfo.color }} />
                      <span className="font-medium text-foreground">{meta.name}</span>
                      <span className="text-[10px] text-muted-foreground font-mono">({meta.abbreviation})</span>
                    </div>
                  </td>
                  {scores.map((score, i) => (
                    <td key={i} className="py-2.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-10 h-7 text-xs font-semibold font-mono ${
                          score === maxScore && candidates.length > 1 ? "ring-2 ring-aci-gold bg-aci-gold/10" : ""
                        }`}
                        style={{ color: CANDIDATE_COLORS[i] }}
                      >
                        {score}
                      </span>
                    </td>
                  ))}
                </tr>
              );
            })}
            {/* Predictions rows */}
            <tr className="bg-accent/30 border-t-2 border-border">
              <td className="py-2.5 px-4 font-medium text-foreground uppercase tracking-wider text-[10px]">Ramp Time</td>
              {candidates.map((c: any, i: number) => (
                <td key={c.id} className="py-2.5 px-4 text-center font-mono" style={{ color: CANDIDATE_COLORS[i] }}>
                  {c.assessment?.predictions?.rampTimeLabel ?? "—"}
                </td>
              ))}
            </tr>
            <tr className="bg-accent/30">
              <td className="py-2.5 px-4 font-medium text-foreground uppercase tracking-wider text-[10px]">Supervision</td>
              {candidates.map((c: any, i: number) => (
                <td key={c.id} className="py-2.5 px-4 text-center font-mono" style={{ color: CANDIDATE_COLORS[i] }}>
                  {c.assessment?.predictions?.supervisionLoad ?? "—"}
                </td>
              ))}
            </tr>
            <tr className="bg-accent/30">
              <td className="py-2.5 px-4 font-medium text-foreground uppercase tracking-wider text-[10px]">Ceiling</td>
              {candidates.map((c: any, i: number) => (
                <td key={c.id} className="py-2.5 px-4 text-center font-mono" style={{ color: CANDIDATE_COLORS[i] }}>
                  {c.assessment?.predictions?.performanceCeiling ?? "—"}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
