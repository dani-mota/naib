"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, ClipboardCheck, Compass, Wrench, Users, Lightbulb, Rocket } from "lucide-react";
import { generateAllPanels } from "@/lib/intelligence";

const ICONS: Record<string, any> = {
  "clipboard-check": ClipboardCheck,
  "compass": Compass,
  "wrench": Wrench,
  "users": Users,
  "lightbulb": Lightbulb,
  "rocket": Rocket,
};

interface IntelligenceReportProps {
  subtestResults: any[];
  roleName?: string;
}

export function IntelligenceReport({ subtestResults, roleName }: IntelligenceReportProps) {
  const panels = generateAllPanels(
    subtestResults.map((r: any) => ({ construct: r.construct, percentile: r.percentile })),
    roleName
  );

  const [openPanels, setOpenPanels] = useState<Set<number>>(new Set([0]));

  const toggle = (index: number) => {
    const next = new Set(openPanels);
    if (next.has(index)) next.delete(index);
    else next.add(index);
    setOpenPanels(next);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-naib-navy mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
        Candidate Intelligence Report
      </h2>

      <div className="space-y-2">
        {panels.map((panel, i) => {
          const isOpen = openPanels.has(i);
          const Icon = ICONS[panel.icon] || ClipboardCheck;

          return (
            <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors"
              >
                <Icon className="w-5 h-5 text-naib-blue shrink-0" />
                <span className="flex-1 text-sm font-medium text-naib-navy">{panel.title}</span>
                {isOpen ? (
                  <ChevronDown className="w-4 h-4 text-naib-slate" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-naib-slate" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-gray-100">
                  <p className="text-sm text-gray-700 leading-relaxed mt-3">
                    {panel.narrative}
                  </p>
                  {panel.keyPoints.length > 0 && (
                    <ul className="mt-3 space-y-1.5">
                      {panel.keyPoints.map((point, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-naib-slate">
                          <span className="w-1.5 h-1.5 rounded-full bg-naib-blue mt-1.5 shrink-0" />
                          {point}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
