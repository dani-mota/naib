"use client";

import { Users, CheckCircle, BarChart3, AlertTriangle } from "lucide-react";

interface RoleHeaderProps {
  role: { name: string; description: string | null };
  stats: {
    totalAssessed: number;
    recommendedCount: number;
    strongFitPct: number;
    avgComposite: number;
    reviewCount: number;
  };
}

const STAT_CARDS = [
  { key: "totalAssessed", label: "Total Assessed", Icon: Users, color: "text-aci-blue" },
  { key: "strongFit", label: "Strong Fit", Icon: CheckCircle, color: "text-aci-green" },
  { key: "avgComposite", label: "Avg Composite", Icon: BarChart3, color: "text-aci-gold" },
  { key: "reviewCount", label: "Needs Review", Icon: AlertTriangle, color: "text-aci-amber" },
] as const;

export function RoleHeader({ role, stats }: RoleHeaderProps) {
  return (
    <div className="bg-card border border-border p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold text-foreground tracking-wider" style={{ fontFamily: "var(--font-dm-sans)" }}>
            {role.name}
          </h1>
          {role.description && (
            <p className="text-xs text-muted-foreground mt-1 max-w-xl leading-relaxed">{role.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {STAT_CARDS.map(({ key, label, Icon, color }) => {
          let value: string;
          if (key === "totalAssessed") value = String(stats.totalAssessed);
          else if (key === "strongFit") value = `${stats.recommendedCount} (${stats.strongFitPct}%)`;
          else if (key === "avgComposite") value = String(stats.avgComposite);
          else value = String(stats.reviewCount);

          return (
            <div key={key} className="p-3 bg-accent/30 border border-border">
              <div className="flex items-center gap-1.5 mb-1">
                <Icon className={`w-3.5 h-3.5 ${color}`} />
                <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
              </div>
              <p className={`text-lg font-bold font-mono ${color}`}>{value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
