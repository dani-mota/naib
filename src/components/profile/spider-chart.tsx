"use client";

import { useState } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { CONSTRUCTS, LAYER_INFO, type LayerType } from "@/lib/constructs";

interface SpiderChartProps {
  subtestResults: any[];
  roleWeights: any[];
  cutline?: any;
}

export function SpiderChart({ subtestResults, roleWeights }: SpiderChartProps) {
  const [viewType, setViewType] = useState<"radar" | "bar">("radar");

  const data = Object.entries(CONSTRUCTS).map(([key, meta]) => {
    const result = subtestResults.find((r: any) => r.construct === key);
    const weight = roleWeights.find((w: any) => w.constructId === key);
    return {
      construct: meta.abbreviation,
      fullName: meta.name,
      percentile: result?.percentile ?? 0,
      average: 50,
      weight: weight?.weight ?? 0,
      layer: meta.layer,
      layerColor: LAYER_INFO[meta.layer as LayerType].color,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="bg-card p-3 shadow-lg border border-border max-w-xs">
        <p className="font-semibold text-xs text-foreground">{d.fullName}</p>
        <p className="text-sm font-bold font-mono" style={{ color: d.layerColor }}>
          {d.percentile}th percentile
        </p>
        {d.weight > 0 && (
          <p className="text-[10px] text-muted-foreground mt-1 font-mono">Role weight: {d.weight}%</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Construct Profile
        </h2>
        <div className="flex gap-0.5 bg-muted p-0.5">
          <button
            onClick={() => setViewType("radar")}
            className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${
              viewType === "radar" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            RADAR
          </button>
          <button
            onClick={() => setViewType("bar")}
            className={`px-2.5 py-1 text-[10px] font-medium transition-colors ${
              viewType === "bar" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            BAR
          </button>
        </div>
      </div>

      {viewType === "radar" ? (
        <div className="h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="construct"
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                tickCount={5}
              />
              <Radar
                name="Average"
                dataKey="average"
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                fill="none"
                strokeWidth={1}
              />
              <Radar
                name="Score"
                dataKey="percentile"
                stroke="#2563EB"
                fill="#2563EB"
                fillOpacity={0.12}
                strokeWidth={2}
                dot={{ fill: "#2563EB", r: 3 }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-1.5">
          {data.map((d) => (
            <div key={d.construct} className="flex items-center gap-3">
              <span className="w-7 text-[10px] font-mono font-medium text-muted-foreground text-right">{d.construct}</span>
              <div className="flex-1 h-5 bg-muted overflow-hidden relative">
                <div
                  className="h-full transition-all duration-500"
                  style={{
                    width: `${d.percentile}%`,
                    backgroundColor: d.layerColor,
                    opacity: 0.8,
                  }}
                />
                <div className="absolute top-0 bottom-0 left-[50%] w-px bg-muted-foreground/30" />
              </div>
              <span className="w-8 text-[10px] font-mono font-medium tabular-nums text-right" style={{ color: d.layerColor }}>
                {d.percentile}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="flex justify-center gap-5 mt-4 pt-3 border-t border-border">
        {Object.entries(LAYER_INFO).map(([key, info]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2 h-2" style={{ backgroundColor: info.color }} />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{info.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
