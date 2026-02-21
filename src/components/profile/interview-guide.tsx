"use client";

import { Target, AlertTriangle } from "lucide-react";
import { CONSTRUCTS } from "@/lib/constructs";

interface InterviewGuideProps {
  subtestResults: any[];
  redFlags: any[];
}

export function InterviewGuide({ subtestResults, redFlags }: InterviewGuideProps) {
  // Find weakest constructs for interview focus
  const sorted = [...subtestResults].sort((a: any, b: any) => a.percentile - b.percentile);
  const weakest = sorted.slice(0, 3);

  // Find strengths to validate
  const strongest = sorted.slice(-2).reverse();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-xs font-medium text-naib-slate uppercase tracking-wider mb-3">
        Interview Focus Areas
      </h3>

      {/* Areas to probe */}
      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-naib-navy">Probe These Areas</p>
        {weakest.map((result: any) => {
          const meta = CONSTRUCTS[result.construct as keyof typeof CONSTRUCTS];
          return (
            <div key={result.construct} className="flex items-start gap-2 p-2 bg-amber-50 rounded-lg">
              <Target className="w-3.5 h-3.5 text-amber-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-amber-800">{meta?.name} ({result.percentile}th)</p>
                <p className="text-[11px] text-amber-700 mt-0.5">{meta?.definition}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths to validate */}
      <div className="space-y-2 mb-4">
        <p className="text-xs font-medium text-naib-navy">Validate Strengths</p>
        {strongest.map((result: any) => {
          const meta = CONSTRUCTS[result.construct as keyof typeof CONSTRUCTS];
          return (
            <div key={result.construct} className="flex items-start gap-2 p-2 bg-green-50 rounded-lg">
              <Target className="w-3.5 h-3.5 text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-green-800">{meta?.name} ({result.percentile}th)</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Red flag follow-ups */}
      {redFlags.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-naib-navy">Flag Follow-ups</p>
          {redFlags.map((flag: any) => (
            <div key={flag.id} className="flex items-start gap-2 p-2 bg-red-50 rounded-lg">
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-red-800">{flag.title}</p>
                <p className="text-[11px] text-red-700 mt-0.5">{flag.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
