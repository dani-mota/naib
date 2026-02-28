"use client";

import { useState, useCallback } from "react";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Customized,
} from "recharts";
import { CONSTRUCTS, LAYER_INFO, type LayerType } from "@/lib/constructs";

interface SpiderChartProps {
  subtestResults: any[];
  roleWeights: any[];
  cutline?: any;
  roleSlug?: string;
  weightDiffs?: Record<string, number>;
  showAnimation?: boolean;
}

function getBenchmark(constructKey: string, layer: LayerType, cutline: any): number {
  if (!cutline) return 0;
  if (constructKey === "LEARNING_VELOCITY") return cutline.learningVelocity ?? 0;
  if (layer === "TECHNICAL_APTITUDE") return cutline.technicalAptitude ?? 0;
  if (layer === "BEHAVIORAL_INTEGRITY") return cutline.behavioralIntegrity ?? 0;
  return cutline.overallMinimum ?? 30;
}

export function SpiderChart({ subtestResults, roleWeights, cutline, roleSlug, weightDiffs, showAnimation }: SpiderChartProps) {
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
    const diff = showAnimation && weightDiffs ? weightDiffs[payload.key] : 0;
    const pulseColor = diff > 0 ? "rgba(5, 150, 105, 0.6)" : diff < 0 ? "rgba(217, 119, 6, 0.6)" : null;
    return (
      <g>
        {pulseColor && (
          <circle
            cx={cx}
            cy={cy}
            r={10}
            fill="none"
            stroke={pulseColor}
            strokeWidth={2}
          >
            <animate attributeName="r" from="4" to="14" dur="0.6s" repeatCount="2" />
            <animate attributeName="opacity" from="1" to="0" dur="0.6s" repeatCount="2" />
          </circle>
        )}
        <circle
          cx={cx}
          cy={cy}
          r={4}
          fill={payload.layerColor}
          stroke="var(--card)"
          strokeWidth={2}
        />
      </g>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showAnimation, weightDiffs]);

  // Axis labels colored by layer, hover triggers tooltip
  const CustomTick = useCallback((props: any) => {
    const { x, y, payload } = props;
    const d = data.find((item) => item.construct === payload.value);
    const color = d?.layerColor ?? "var(--muted-foreground)";
    const diff = showAnimation && weightDiffs && d ? weightDiffs[d.key] : 0;
    const animColor = diff > 0 ? "#059669" : diff < 0 ? "#D97706" : null;

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
        {animColor && (
          <circle cx={x} cy={y} r={14} fill={animColor} fillOpacity={0.15}>
            <animate attributeName="fillOpacity" values="0.15;0.3;0.15" dur="0.6s" repeatCount="2" />
          </circle>
        )}
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={animColor ?? color}
          fontSize={11}
          fontWeight={700}
          style={{ fontFamily: "var(--font-mono, monospace)" }}
        >
          {payload.value}
        </text>
      </g>
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, showAnimation, weightDiffs]);

  // Colored radial lines + subtle layer wedge fills, rendered behind the grid
  const LayerOverlay = useCallback((props: any) => {
    // Customized passes width/height; compute cx/cy/outerRadius matching RadarChart's 50%/50%/72%
    const width = props.width ?? 0;
    const height = props.height ?? 0;
    const cx = props.cx ?? width / 2;
    const cy = props.cy ?? height / 2;
    const outerRadius = props.outerRadius ?? Math.min(width, height) * 0.72 / 2;
    if (!outerRadius) return null;

    const count = data.length;

    // Build wedge paths for each layer section
    const wedges: { path: string; color: string }[] = [];
    for (let i = 0; i < count; i++) {
      const d = data[i];
      const nextD = data[(i + 1) % count];

      // Only draw wedge fill between adjacent constructs of the same layer
      if (d.layer === nextD.layer) {
        const angle1 = (Math.PI * 2 * i) / count - Math.PI / 2;
        const angle2 = (Math.PI * 2 * (i + 1)) / count - Math.PI / 2;
        const x1 = cx + outerRadius * Math.cos(angle1);
        const y1 = cy + outerRadius * Math.sin(angle1);
        const x2 = cx + outerRadius * Math.cos(angle2);
        const y2 = cy + outerRadius * Math.sin(angle2);
        const largeArc = 0;

        wedges.push({
          path: `M ${cx} ${cy} L ${x1} ${y1} A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2} Z`,
          color: d.layerColor,
        });
      }
    }

    return (
      <g>
        {/* Subtle layer wedge fills */}
        {wedges.map((w, i) => (
          <path key={`wedge-${i}`} d={w.path} fill={w.color} fillOpacity={0.04} />
        ))}
        {/* Colored radial lines from center to each axis */}
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
              strokeWidth={1.5}
              strokeOpacity={0.7}
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
              {/* Default polygon grid (concentric rings), no radial lines — we draw our own */}
              <PolarGrid stroke="var(--border)" radialLines={false} />
              {/* Layer-colored radial lines + subtle wedge fills */}
              <Customized component={(props: any) => <LayerOverlay {...props} />} />
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
              {/* Role benchmark — dashed, absolutely no dots */}
              <Radar
                name="Benchmark"
                dataKey="benchmark"
                stroke="var(--muted-foreground)"
                strokeDasharray="4 4"
                fill="none"
                strokeWidth={1}
                dot={false}
                activeDot={false}
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
                activeDot={false}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="space-y-1.5">
          {data.map((d) => {
            const diff = showAnimation && weightDiffs ? weightDiffs[d.key] : 0;
            const animClass = diff > 0 ? "animate-pulse-green" : diff < 0 ? "animate-pulse-amber" : "";
            return (
              <div key={d.construct} className={`flex items-center gap-3 ${animClass}`}>
                <span className={`w-7 text-[10px] font-mono font-medium text-right ${diff > 0 ? "animate-pulse-green-text" : diff < 0 ? "animate-pulse-amber-text" : ""}`} style={{ color: d.layerColor }}>{d.construct}</span>
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
            );
          })}
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
              ? <span className="text-aci-green ml-1">(+{hoveredData.percentile - hoveredData.benchmark} above)</span>
              : <span className="text-aci-red ml-1">({hoveredData.percentile - hoveredData.benchmark} below)</span>
            }
          </p>
          <p className="text-[10px] text-muted-foreground leading-relaxed mb-2">{hoveredData.definition}</p>
          {hoveredData.roleRelevance && (
            <div className="pt-2 border-t border-border">
              <p className="text-[9px] text-aci-gold uppercase tracking-wider font-medium mb-1">Why This Matters</p>
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
