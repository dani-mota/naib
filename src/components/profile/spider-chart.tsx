"use client";

import { useState, useCallback } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer,
} from "recharts";
import { CONSTRUCTS, LAYER_INFO, type LayerType } from "@/lib/constructs";

interface SpiderChartProps {
  subtestResults: any[];
  roleWeights: any[];
  cutline?: any;
  roleSlug?: string;
}

function getBenchmark(constructKey: string, layer: LayerType, cutline: any): number {
  if (!cutline) return 0;
  if (constructKey === "LEARNING_VELOCITY") return cutline.learningVelocity ?? 0;
  if (layer === "TECHNICAL_APTITUDE") return cutline.technicalAptitude ?? 0;
  if (layer === "BEHAVIORAL_INTEGRITY") return cutline.behavioralIntegrity ?? 0;
  return cutline.overallMinimum ?? 30;
}

export function SpiderChart({ subtestResults, roleWeights, cutline, roleSlug }: SpiderChartProps) {
  const [viewType, setViewType] = useState<"radar" | "bar">("radar");
  const [hoveredLabel, setHoveredLabel] = useState<string | null>(null);
  const [labelPos, setLabelPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const data = Object.entries(CONSTRUCTS).map(([key, meta]) => {
    const result = subtestResults.find((r: any) => r.construct === key);
    const weight = roleWeights.find((w: any) => w.constructId === key);
    const layer = meta.layer as LayerType;
    const percentile = result?.percentile ?? 0;
    const benchmark = getBenchmark(key, layer, cutline);

    return {
      key,
      construct: meta.abbreviation,
      fullName: meta.name,
      definition: meta.definition,
      roleRelevance: roleSlug ? meta.roleRelevance[roleSlug] : undefined,
      percentile,
      benchmark,
      weight: weight?.weight ?? 0,
      layer,
      layerColor: LAYER_INFO[layer].color,
    };
  });

  const hoveredData = hoveredLabel ? data.find((d) => d.construct === hoveredLabel) : null;

  // Custom dot — only for candidate score, colored by layer
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

  // Axis labels colored by layer, hover triggers tooltip
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

  // Custom grid: concentric circles (neutral) + radial lines colored by layer
  const CustomPolarGrid = useCallback((props: any) => {
    const { cx, cy, outerRadius } = props;
    if (!cx || !cy || !outerRadius) return null;

    const count = data.length;
    const concentricRadii = [0.2, 0.4, 0.6, 0.8, 1.0];

    return (
      <g>
        {concentricRadii.map((ratio) => (
          <circle
            key={ratio}
            cx={cx}
            cy={cy}
            r={outerRadius * ratio}
            fill="none"
            stroke="var(--border)"
            strokeWidth={1}
          />
        ))}
        {data.map((d, i) => {
          const angle = (Math.PI * 2 * i) / count - Math.PI / 2;
          const x2 = cx + outerRadius * Math.cos(angle);
          const y2 = cy + outerRadius * Math.sin(angle);
          return (
            <line
              key={d.key}
              x1={cx}
              y1={cy}
              x2={x2}
              y2={y2}
              stroke={d.layerColor}
              strokeWidth={1}
              strokeOpacity={0.3}
            />
          );
        })}
      </g>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
              <PolarGrid gridType="circle" stroke="var(--border)" radialLines={false} />
              <CustomPolarGrid cx={0} cy={0} outerRadius={0} />
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
              {/* Role benchmark — dashed, no dots */}
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                fill="none"
                strokeWidth={1}
                dot={false}
                isAnimationActive={false}
              />
              {/* Candidate score — filled polygon with layer-colored dots */}
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
              {/* No <Tooltip> — popup only on axis label hover */}
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
                {/* Benchmark marker */}
                <div
                  className="absolute top-0 bottom-0 w-px bg-muted-foreground/50"
                  style={{ left: `${d.benchmark}%` }}
                />
              </div>
              <span className="w-8 text-[10px] font-mono font-medium tabular-nums text-right" style={{ color: d.layerColor }}>
                {d.percentile}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Tooltip — only appears when hovering axis labels (FL, EC, etc.) */}
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
          <p className="text-lg font-bold font-mono mb-1" style={{ color: hoveredData.layerColor }}>
            {hoveredData.percentile}<span className="text-[10px] font-normal text-muted-foreground ml-0.5">th percentile</span>
          </p>
          <p className="text-[10px] text-muted-foreground font-mono mb-2">
            Benchmark: {hoveredData.benchmark}th
            {hoveredData.percentile >= hoveredData.benchmark
              ? <span className="text-naib-green ml-1">(+{hoveredData.percentile - hoveredData.benchmark} above)</span>
              : <span className="text-naib-red ml-1">({hoveredData.percentile - hoveredData.benchmark} below)</span>
            }
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

      {/* Legend */}
      <div className="flex justify-center gap-5 mt-4 pt-3 border-t border-border">
        {Object.entries(LAYER_INFO).map(([key, info]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className="w-2 h-2" style={{ backgroundColor: info.color }} />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{info.name}</span>
          </div>
        ))}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-0 border-t border-dashed border-muted-foreground" />
          <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Role Benchmark</span>
        </div>
      </div>
    </div>
  );
}
