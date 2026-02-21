"use client";

import { useState, useCallback } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { CONSTRUCTS, LAYER_INFO, type LayerType } from "@/lib/constructs";

interface SpiderChartProps {
  subtestResults: any[];
  roleWeights: any[];
  cutline?: any;
  roleSlug?: string;
}

export function SpiderChart({ subtestResults, roleWeights, roleSlug }: SpiderChartProps) {
  const [viewType, setViewType] = useState<"radar" | "bar">("radar");
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [labelPos, setLabelPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const data = Object.entries(CONSTRUCTS).map(([key, meta]) => {
    const result = subtestResults.find((r: any) => r.construct === key);
    const weight = roleWeights.find((w: any) => w.constructId === key);
    const layer = meta.layer as LayerType;
    const percentile = result?.percentile ?? 0;

    return {
      key,
      construct: meta.abbreviation,
      fullName: meta.name,
      definition: meta.definition,
      roleRelevance: roleSlug ? meta.roleRelevance[roleSlug] : undefined,
      percentile,
      average: 50,
      weight: weight?.weight ?? 0,
      layer,
      layerColor: LAYER_INFO[layer].color,
    };
  });

  const hoveredData = hoveredLabel ? data.find((d) => d.construct === hoveredLabel) : null;

  // Custom dot renderer — colors each dot by its layer
  const CustomDot = useCallback((props: any) => {
    const { cx, cy, payload } = props;
    if (!payload) return null;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill={payload.layerColor}
        stroke="var(--card)"
        strokeWidth={2}
      />
    );
  }, []);

  // Axis labels colored by layer, interactive for hover tooltip
  const CustomTick = useCallback((props: any) => {
    const { x, y, payload } = props;
    const d = data.find((item) => item.construct === payload.value);
    const color = d?.layerColor ?? "var(--muted-foreground)";

    return (
      <g
        onMouseEnter={(e) => {
          setHoveredLabel(payload.value);
          setLabelPos({ x: e.clientX, y: e.clientY });
        }}
        onMouseLeave={() => setHoveredLabel(null)}
        style={{ cursor: "pointer" }}
      >
        <circle cx={x} cy={y} r={12} fill="transparent" />
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={color}
          fontSize={11}
          fontWeight={700}
          style={{ fontFamily: "var(--font-mono, monospace)" }}
        >
          {payload.value}
        </text>
      </g>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  // Rich tooltip for data point hover
  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.length) return null;
    const d = payload[0]?.payload;
    if (!d) return null;

    return (
      <div
        className="bg-card/95 backdrop-blur-sm p-4 shadow-xl border border-border max-w-[280px]"
        style={{ pointerEvents: "none", animation: "spiderFadeIn 150ms ease-out" }}
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2" style={{ backgroundColor: d.layerColor }} />
          <p className="font-semibold text-xs text-foreground uppercase tracking-wider">{d.fullName}</p>
        </div>

        <p className="text-lg font-bold font-mono mb-2" style={{ color: d.layerColor }}>
          {d.percentile}<span className="text-[10px] font-normal text-muted-foreground ml-0.5">th percentile</span>
        </p>

        <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">
          {d.definition}
        </p>

        {d.roleRelevance && (
          <div className="pt-2 border-t border-border">
            <p className="text-[9px] text-naib-gold uppercase tracking-wider font-medium mb-1">Why This Matters</p>
            <p className="text-[10px] text-muted-foreground leading-relaxed">{d.roleRelevance}</p>
          </div>
        )}

        {d.weight > 0 && (
          <p className="text-[9px] text-muted-foreground mt-2 font-mono uppercase tracking-wider">
            Role weight: {d.weight}%
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="bg-card border border-border p-5 relative">
      <style>{`@keyframes spiderFadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }`}</style>

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
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
              <PolarGrid stroke="var(--border)" />
              <PolarAngleAxis
                dataKey="construct"
                tick={<CustomTick />}
              />
              <PolarRadiusAxis
                angle={90}
                domain={[0, 100]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 9 }}
                tickCount={5}
              />
              {/* Dashed 50th percentile reference */}
              <Radar
                name="Average"
                dataKey="average"
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                fill="none"
                strokeWidth={1}
              />
              {/* Single continuous filled polygon */}
              <Radar
                name="Score"
                dataKey="percentile"
                stroke="var(--muted-foreground)"
                strokeOpacity={0.4}
                fill="var(--muted-foreground)"
                fillOpacity={0.06}
                strokeWidth={1.5}
                dot={<CustomDot />}
              />
              <Tooltip content={<CustomTooltip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-1.5">
          {data.map((d) => (
            <div key={d.construct} className="flex items-center gap-3">
              <span className="w-7 text-[10px] font-mono font-medium text-right" style={{ color: d.layerColor }}>{d.construct}</span>
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

      {/* Axis label hover tooltip — rendered as a portal-like fixed div */}
      {hoveredData && (
        <div
          className="fixed z-50 bg-card/95 backdrop-blur-sm p-4 shadow-xl border border-border max-w-[280px]"
          style={{
            left: labelPos.x + 16,
            top: labelPos.y - 12,
            pointerEvents: "none",
            animation: "spiderFadeIn 120ms ease-out",
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2" style={{ backgroundColor: hoveredData.layerColor }} />
            <p className="font-semibold text-xs text-foreground uppercase tracking-wider">{hoveredData.fullName}</p>
          </div>
          <p className="text-lg font-bold font-mono mb-2" style={{ color: hoveredData.layerColor }}>
            {hoveredData.percentile}<span className="text-[10px] font-normal text-muted-foreground ml-0.5">th percentile</span>
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{hoveredData.definition}</p>
          {hoveredData.roleRelevance && (
            <div className="pt-2 border-t border-border">
              <p className="text-[9px] text-naib-gold uppercase tracking-wider font-medium mb-1">Why This Matters</p>
              <p className="text-[10px] text-muted-foreground leading-relaxed">{hoveredData.roleRelevance}</p>
            </div>
          )}
        </div>
      )}

      {/* Layer legend */}
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
