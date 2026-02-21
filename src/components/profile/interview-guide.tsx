"use client";

import { Target, AlertTriangle } from "lucide-react";
import { CONSTRUCTS } from "@/lib/constructs";

interface InterviewGuideProps {
  subtestResults: any[];
  redFlags: any[];
}

export function InterviewGuide({ subtestResults, redFlags }: InterviewGuideProps) {
  const sorted = [...subtestResults].sort((a: any, b: any) => a.percentile - b.percentile);
  const weakest = sorted.slice(0, 3);
  const strongest = sorted.slice(-2).reverse();

  return (
    <div className="bg-card border border-border p-4">
      <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Interview Focus Areas
      </h3>

      {/* Areas to probe */}
      <div className="space-y-1.5 mb-4">
        <p className="text-[10px] font-medium text-foreground uppercase tracking-wider">Probe These Areas</p>
        {weakest.map((result: any) => {
          const meta = CONSTRUCTS[result.construct as keyof typeof CONSTRUCTS];
          return (
            <div key={result.construct} className="flex items-start gap-2 p-2 bg-naib-amber/5 border border-naib-amber/20">
              <Target className="w-3 h-3 text-naib-amber mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-medium text-foreground font-mono">{meta?.name} ({result.percentile}th)</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{meta?.definition}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths to validate */}
      <div className="space-y-1.5 mb-4">
        <p className="text-[10px] font-medium text-foreground uppercase tracking-wider">Validate Strengths</p>
        {strongest.map((result: any) => {
          const meta = CONSTRUCTS[result.construct as keyof typeof CONSTRUCTS];
          return (
            <div key={result.construct} className="flex items-start gap-2 p-2 bg-naib-green/5 border border-naib-green/20">
              <Target className="w-3 h-3 text-naib-green mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-medium text-foreground font-mono">{meta?.name} ({result.percentile}th)</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Red flag follow-ups */}
      {redFlags.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-medium text-foreground uppercase tracking-wider">Flag Follow-ups</p>
          {redFlags.map((flag: any) => (
            <div key={flag.id} className="flex items-start gap-2 p-2 bg-naib-red/5 border border-naib-red/20">
              <AlertTriangle className="w-3 h-3 text-naib-red mt-0.5 shrink-0" />
              <div>
                <p className="text-[10px] font-medium text-foreground font-mono">{flag.title}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">{flag.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
