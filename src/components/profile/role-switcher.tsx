"use client";

import { ScoreBar } from "@/components/ui/score-bar";

interface RoleSwitcherProps {
  roles: any[];
  selectedSlug: string;
  onSelect: (slug: string) => void;
  compositeScores: any[];
}

export function RoleSwitcher({ roles, selectedSlug, onSelect, compositeScores }: RoleSwitcherProps) {
  return (
    <div className="bg-card border border-border p-4">
      <h3 className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-3">Role Fit</h3>

      <div className="space-y-1.5">
        {roles.map((role: any) => {
          const score = compositeScores.find((cs: any) => cs.roleSlug === role.slug);
          const isSelected = role.slug === selectedSlug;

          return (
            <button
              key={role.slug}
              onClick={() => onSelect(role.slug)}
              className={`w-full flex items-center gap-3 p-2.5 text-left transition-all ${
                isSelected
                  ? "bg-naib-gold/5 border border-naib-gold/30"
                  : "hover:bg-accent/50 border border-transparent"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-xs font-medium truncate uppercase tracking-wider ${isSelected ? "text-naib-gold" : "text-foreground"}`}>
                  {role.name}
                </p>
                <div className="mt-1">
                  <ScoreBar percentile={score?.percentile ?? 0} height={3} />
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold font-mono ${isSelected ? "text-naib-gold" : "text-foreground"}`}>
                  {score?.percentile ?? "—"}
                </span>
                <p className="text-[10px] text-muted-foreground font-mono">
                  {score?.passed ? "PASS" : "BELOW"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
