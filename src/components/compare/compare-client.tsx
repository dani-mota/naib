"use client";

import { useState } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip, Legend,
} from "recharts";
import { CONSTRUCTS, LAYER_INFO, type LayerType } from "@/lib/constructs";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreBar } from "@/components/ui/score-bar";

const CANDIDATE_COLORS = ["#2563EB", "#059669", "#D97706"];

interface CompareClientProps {
  candidates: any[];
  roles: any[];
}

export function CompareClient({ candidates, roles }: CompareClientProps) {
  const [selectedRoleSlug, setSelectedRoleSlug] = useState(
    candidates[0]?.primaryRole?.slug || roles[0]?.slug
  );

  const constructKeys = Object.keys(CONSTRUCTS);

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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-naib-navy" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Candidate Comparison
          </h1>
          <p className="text-sm text-naib-slate mt-1">
            Comparing {candidates.length} candidates side-by-side
          </p>
        </div>
        <select
          value={selectedRoleSlug}
          onChange={(e) => setSelectedRoleSlug(e.target.value)}
          className="h-9 rounded-lg border border-gray-200 px-3 text-sm bg-white"
        >
          {roles.map((r: any) => (
            <option key={r.slug} value={r.slug}>{r.name}</option>
          ))}
        </select>
      </div>

      {/* Candidate cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {candidates.map((c: any, i: number) => {
          const composite = c.assessment?.compositeScores?.find(
            (cs: any) => cs.roleSlug === selectedRoleSlug
          );
          return (
            <div key={c.id} className="bg-white rounded-xl border-2 p-4" style={{ borderColor: CANDIDATE_COLORS[i] }}>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: CANDIDATE_COLORS[i] }}
                >
                  {c.firstName[0]}{c.lastName[0]}
                </div>
                <div>
                  <p className="font-semibold text-naib-navy">{c.firstName} {c.lastName}</p>
                  <p className="text-xs text-naib-slate">{c.primaryRole.name}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mb-2">
                <StatusBadge status={c.status} size="sm" />
                <span className="text-lg font-bold" style={{ color: CANDIDATE_COLORS[i] }}>
                  {composite?.percentile ?? "—"}
                </span>
              </div>
              <ScoreBar percentile={composite?.percentile ?? 0} height={4} />
            </div>
          );
        })}
      </div>

      {/* Overlaid Spider Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-naib-navy mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Construct Overlay
        </h2>
        <div className="h-[450px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="construct" tick={{ fill: "#64748b", fontSize: 11 }} />
              <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} tickCount={5} />
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
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="py-3 px-4 text-left font-medium text-naib-slate">Construct</th>
              {candidates.map((c: any, i: number) => (
                <th key={c.id} className="py-3 px-4 text-center font-medium" style={{ color: CANDIDATE_COLORS[i] }}>
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
                <tr key={key} className="border-b border-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: layerInfo.color }} />
                      <span className="font-medium text-naib-navy">{meta.name}</span>
                      <span className="text-xs text-naib-slate">({meta.abbreviation})</span>
                    </div>
                  </td>
                  {scores.map((score, i) => (
                    <td key={i} className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center justify-center w-12 h-8 rounded text-sm font-semibold ${
                          score === maxScore && candidates.length > 1 ? "ring-2 ring-naib-gold bg-naib-gold/10" : ""
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
            {/* Predictions row */}
            <tr className="bg-gray-50 border-t-2 border-gray-200">
              <td className="py-3 px-4 font-medium text-naib-navy">Ramp Time</td>
              {candidates.map((c: any, i: number) => (
                <td key={c.id} className="py-3 px-4 text-center text-sm" style={{ color: CANDIDATE_COLORS[i] }}>
                  {c.assessment?.predictions?.rampTimeLabel ?? "—"}
                </td>
              ))}
            </tr>
            <tr className="bg-gray-50">
              <td className="py-3 px-4 font-medium text-naib-navy">Supervision</td>
              {candidates.map((c: any, i: number) => (
                <td key={c.id} className="py-3 px-4 text-center text-sm" style={{ color: CANDIDATE_COLORS[i] }}>
                  {c.assessment?.predictions?.supervisionLoad ?? "—"}
                </td>
              ))}
            </tr>
            <tr className="bg-gray-50">
              <td className="py-3 px-4 font-medium text-naib-navy">Ceiling</td>
              {candidates.map((c: any, i: number) => (
                <td key={c.id} className="py-3 px-4 text-center text-sm" style={{ color: CANDIDATE_COLORS[i] }}>
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
