"use client";

import { Check } from "lucide-react";
import { CONSTRUCTS } from "@/lib/constructs";

interface Role {
  id: string;
  name: string;
  slug: string;
  compositeWeights: { constructId: string; weight: number }[];
}

interface RoleSelectionCardProps {
  role: Role;
  selected: boolean;
  onSelect: () => void;
}

export function RoleSelectionCard({ role, selected, onSelect }: RoleSelectionCardProps) {
  const topWeights = [...role.compositeWeights]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3);

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left p-4 border transition-all ${
        selected
          ? "border-aci-gold bg-aci-gold/5"
          : "border-border hover:border-aci-gold/30"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-foreground uppercase tracking-wider">
          {role.name}
        </h3>
        {selected && (
          <div className="w-5 h-5 bg-aci-gold rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-aci-navy" />
          </div>
        )}
      </div>
      <div className="flex gap-2">
        {topWeights.map((w) => {
          const construct = CONSTRUCTS[w.constructId as keyof typeof CONSTRUCTS];
          return (
            <span
              key={w.constructId}
              className="text-[9px] font-mono text-muted-foreground bg-accent px-1.5 py-0.5 uppercase tracking-wider"
            >
              {construct?.abbreviation || w.constructId}
            </span>
          );
        })}
      </div>
    </button>
  );
}
