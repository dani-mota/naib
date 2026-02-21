"use client";

import { Clock, Eye, TrendingUp, AlertTriangle } from "lucide-react";

interface PredictionsGridProps {
  prediction: any;
}

export function PredictionsGrid({ prediction }: PredictionsGridProps) {
  if (!prediction) return null;

  const cards = [
    {
      icon: Clock,
      label: "Ramp Time",
      value: prediction.rampTimeLabel,
      detail: `${prediction.rampTimeMonths} months`,
      color: prediction.rampTimeMonths <= 1 ? "#059669" : prediction.rampTimeMonths <= 2 ? "#D97706" : "#DC2626",
    },
    {
      icon: Eye,
      label: "Supervision",
      value: prediction.supervisionLoad,
      detail: `Score: ${prediction.supervisionScore}`,
      color: prediction.supervisionLoad === "LOW" ? "#059669" : prediction.supervisionLoad === "MEDIUM" ? "#D97706" : "#DC2626",
    },
    {
      icon: TrendingUp,
      label: "Performance Ceiling",
      value: prediction.performanceCeiling,
      detail: (prediction.ceilingCareerPath as string[])?.join(" → "),
      color: prediction.performanceCeiling === "HIGH" ? "#059669" : prediction.performanceCeiling === "MEDIUM" ? "#D97706" : "#DC2626",
    },
    {
      icon: AlertTriangle,
      label: "Attrition Risk",
      value: prediction.attritionRisk,
      detail: (prediction.attritionStrategies as string[])?.slice(0, 2).join(", "),
      color: prediction.attritionRisk === "LOW" ? "#059669" : prediction.attritionRisk === "MEDIUM" ? "#D97706" : "#DC2626",
    },
  ];

  return (
    <div className="bg-card border border-border p-5">
      <h2 className="text-xs font-semibold text-foreground mb-4 uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-sans)" }}>
        Predictions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {cards.map((card) => (
          <div key={card.label} className="border border-border p-3">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className="w-3.5 h-3.5" style={{ color: card.color }} />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-sm font-bold font-mono" style={{ color: card.color }}>{card.value}</p>
            {card.detail && (
              <p className="text-[10px] text-muted-foreground mt-1 line-clamp-2 font-mono">{card.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
