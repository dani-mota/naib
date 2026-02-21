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
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <h3 className="text-xs font-medium text-naib-slate uppercase tracking-wider mb-3">Role Fit</h3>

      <div className="space-y-2">
        {roles.map((role: any) => {
          const score = compositeScores.find((cs: any) => cs.roleSlug === role.slug);
          const isSelected = role.slug === selectedSlug;

          return (
            <button
              key={role.slug}
              onClick={() => onSelect(role.slug)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all ${
                isSelected
                  ? "bg-naib-blue/5 border border-naib-blue/20 ring-1 ring-naib-blue/10"
                  : "hover:bg-gray-50 border border-transparent"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isSelected ? "text-naib-blue" : "text-naib-navy"}`}>
                  {role.name}
                </p>
                <div className="mt-1">
                  <ScoreBar percentile={score?.percentile ?? 0} height={4} />
                </div>
              </div>
              <div className="text-right">
                <span className={`text-lg font-bold ${isSelected ? "text-naib-blue" : "text-naib-navy"}`}>
                  {score?.percentile ?? "—"}
                </span>
                <p className="text-[10px] text-naib-slate">
                  {score?.passed ? "Pass" : "Below"}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
