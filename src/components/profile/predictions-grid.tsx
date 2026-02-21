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
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-naib-navy mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
        Predictions
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {cards.map((card) => (
          <div key={card.label} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <card.icon className="w-4 h-4" style={{ color: card.color }} />
              <span className="text-xs font-medium text-naib-slate uppercase tracking-wider">{card.label}</span>
            </div>
            <p className="text-lg font-bold" style={{ color: card.color }}>{card.value}</p>
            {card.detail && (
              <p className="text-xs text-naib-slate mt-1 line-clamp-2">{card.detail}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
