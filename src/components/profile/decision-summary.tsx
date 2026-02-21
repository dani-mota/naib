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
    <div className="bg-card border border-border p-4 space-y-3">
      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Decision</p>
        <StatusBadge status={candidate.status} />
      </div>

      <div>
        <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">
          {roleName} Composite
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xl font-bold text-foreground font-mono">
            {compositeScore?.percentile ?? "—"}
          </span>
          <span className="text-[10px] text-muted-foreground font-mono">/ 100</span>
        </div>
        <ScoreBar percentile={compositeScore?.percentile ?? 0} showLabel={false} height={6} />
        <p className="text-[10px] text-muted-foreground mt-1 font-mono">
          {compositeScore?.passed ? "ABOVE CUTLINE" : `${Math.abs(compositeScore?.distanceFromCutline ?? 0)} PTS FROM CUTLINE`}
        </p>
      </div>

      {redFlags.length > 0 && (
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1.5">Flags</p>
          {redFlags.map((flag: any) => (
            <div key={flag.id} className={`flex items-start gap-2 text-[11px] p-2 mb-1 border ${
              flag.severity === "CRITICAL" ? "bg-naib-red/5 border-naib-red/20 text-naib-red" : flag.severity === "WARNING" ? "bg-naib-amber/5 border-naib-amber/20 text-naib-amber" : "bg-naib-blue/5 border-naib-blue/20 text-naib-blue"
            }`}>
              <AlertTriangle className="w-3 h-3 mt-0.5 shrink-0" />
              <span>{flag.title}</span>
            </div>
          ))}
        </div>
      )}

      {prediction && (
        <div className="space-y-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Clock className="w-3 h-3" /> RAMP TIME
            </div>
            <span className="text-[10px] font-mono font-medium text-foreground">{prediction.rampTimeLabel}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Eye className="w-3 h-3" /> SUPERVISION
            </div>
            <span className="text-[10px] font-mono font-medium text-foreground">{prediction.supervisionLoad}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <TrendingUp className="w-3 h-3" /> CEILING
            </div>
            <span className="text-[10px] font-mono font-medium text-foreground">{prediction.performanceCeiling}</span>
          </div>
        </div>
      )}
    </div>
  );
}
