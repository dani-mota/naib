"use client";

import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreBar } from "@/components/ui/score-bar";
import { AlertTriangle, Clock, Eye, TrendingUp } from "lucide-react";

interface DecisionSummaryProps {
  candidate: any;
  compositeScore: any;
  roleName: string;
}

export function DecisionSummary({ candidate, compositeScore, roleName }: DecisionSummaryProps) {
  const prediction = candidate.assessment?.predictions;
  const redFlags = candidate.assessment?.redFlags || [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div>
        <p className="text-xs text-naib-slate uppercase tracking-wider mb-2">Decision</p>
        <StatusBadge status={candidate.status} />
      </div>

      <div>
        <p className="text-xs text-naib-slate uppercase tracking-wider mb-2">
          {roleName} Composite
        </p>
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-naib-navy">
            {compositeScore?.percentile ?? "—"}
          </span>
          <span className="text-sm text-naib-slate">/ 100</span>
        </div>
        <ScoreBar percentile={compositeScore?.percentile ?? 0} showLabel={false} height={8} />
        <p className="text-xs text-naib-slate mt-1">
          {compositeScore?.passed ? "Above cutline" : `${Math.abs(compositeScore?.distanceFromCutline ?? 0)} pts from cutline`}
        </p>
      </div>

      {redFlags.length > 0 && (
        <div>
          <p className="text-xs text-naib-slate uppercase tracking-wider mb-2">Flags</p>
          {redFlags.map((flag: any) => (
            <div key={flag.id} className={`flex items-start gap-2 text-xs p-2 rounded mb-1 ${
              flag.severity === "CRITICAL" ? "bg-red-50 text-red-700" : flag.severity === "WARNING" ? "bg-amber-50 text-amber-700" : "bg-blue-50 text-blue-700"
            }`}>
              <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              <span>{flag.title}</span>
            </div>
          ))}
        </div>
      )}

      {prediction && (
        <div className="space-y-2.5 pt-2 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-naib-slate">
              <Clock className="w-3.5 h-3.5" /> Ramp Time
            </div>
            <span className="text-xs font-medium text-naib-navy">{prediction.rampTimeLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-naib-slate">
              <Eye className="w-3.5 h-3.5" /> Supervision
            </div>
            <span className="text-xs font-medium text-naib-navy">{prediction.supervisionLoad}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-naib-slate">
              <TrendingUp className="w-3.5 h-3.5" /> Ceiling
            </div>
            <span className="text-xs font-medium text-naib-navy">{prediction.performanceCeiling}</span>
          </div>
        </div>
      )}
    </div>
  );
}
