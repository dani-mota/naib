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
    <div className="bg-card border border-border p-5">
      <h2 className="text-sm font-semibold text-foreground mb-3 uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-sans)" }}>
        Candidate Intelligence Report
      </h2>

      <div className="space-y-1">
        {panels.map((panel, i) => {
          const isOpen = openPanels.has(i);
          const Icon = ICONS[panel.icon] || ClipboardCheck;

          return (
            <div key={i} className="border border-border overflow-hidden">
              <button
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-3 p-3 text-left hover:bg-accent transition-colors"
              >
                <Icon className="w-4 h-4 text-naib-blue shrink-0" />
                <span className="flex-1 text-xs font-medium text-foreground">{panel.title}</span>
                {isOpen ? (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
                )}
              </button>

              {isOpen && (
                <div className="px-3 pb-3 border-t border-border">
                  <p className="text-xs text-muted-foreground leading-relaxed mt-2.5">
                    {panel.narrative}
                  </p>
                  {panel.keyPoints.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {panel.keyPoints.map((point, j) => (
                        <li key={j} className="flex items-start gap-2 text-[11px] text-muted-foreground">
                          <span className="w-1 h-1 bg-naib-gold mt-1.5 shrink-0" />
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
