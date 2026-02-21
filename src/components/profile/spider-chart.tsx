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
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200 max-w-xs">
        <p className="font-semibold text-sm text-naib-navy">{d.fullName}</p>
        <p className="text-lg font-bold" style={{ color: d.layerColor }}>
          {d.percentile}th percentile
        </p>
        {d.weight > 0 && (
          <p className="text-xs text-naib-slate mt-1">Role weight: {d.weight}%</p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-naib-navy" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Construct Profile
        </h2>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewType("radar")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewType === "radar" ? "bg-white shadow-sm text-naib-navy" : "text-naib-slate hover:text-naib-navy"
            }`}
          >
            Radar
          </button>
          <button
            onClick={() => setViewType("bar")}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              viewType === "bar" ? "bg-white shadow-sm text-naib-navy" : "text-naib-slate hover:text-naib-navy"
            }`}
          >
            Bar
          </button>
        </div>
      </div>

      {viewType === "radar" ? (
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis
                dataKey="construct"
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "#94a3b8", fontSize: 10 }}
                tickCount={5}
              />
              {/* 50th percentile reference */}
              <Radar
                name="Average"
                dataKey="average"
                stroke="#94a3b8"
                strokeDasharray="4 4"
                fill="none"
                strokeWidth={1}
              />
              {/* Candidate scores */}
              <Radar
                name="Score"
                dataKey="percentile"
                stroke="#2563EB"
                fill="#2563EB"
                fillOpacity={0.15}
                strokeWidth={2}
                dot={{ fill: "#2563EB", r: 4 }}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-2">
          {data.map((d) => (
            <div key={d.construct} className="flex items-center gap-3">
              <span className="w-8 text-xs font-medium text-naib-slate text-right">{d.construct}</span>
              <div className="flex-1 h-6 bg-gray-100 rounded-full overflow-hidden relative">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${d.percentile}%`,
                    backgroundColor: d.layerColor,
                    opacity: 0.8,
                  }}
                />
                {/* 50th percentile marker */}
                <div className="absolute top-0 bottom-0 left-[50%] w-px bg-gray-400 border-dashed" />
              </div>
              <span className="w-10 text-xs font-medium tabular-nums text-right" style={{ color: d.layerColor }}>
                {d.percentile}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-gray-100">
        {Object.entries(LAYER_INFO).map(([key, info]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: info.color }} />
            <span className="text-xs text-naib-slate">{info.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
