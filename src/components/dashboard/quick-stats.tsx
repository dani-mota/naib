"use client";

import { Users, CheckCircle, Clock, Activity } from "lucide-react";

interface QuickStatsProps {
  totalAssessed: number;
  strongFitRate: number;
  avgDuration: number;
  weeklyVolume: number;
}

export function QuickStats({ totalAssessed, strongFitRate, avgDuration, weeklyVolume }: QuickStatsProps) {
  const stats = [
    {
      label: "TOTAL ASSESSED",
      value: totalAssessed.toString(),
      icon: Users,
      color: "text-naib-blue",
      bg: "bg-naib-blue/10",
    },
    {
      label: "STRONG FIT RATE",
      value: `${strongFitRate}%`,
      icon: CheckCircle,
      color: "text-naib-green",
      bg: "bg-naib-green/10",
    },
    {
      label: "AVG DURATION",
      value: `${avgDuration}m`,
      icon: Clock,
      color: "text-naib-amber",
      bg: "bg-naib-amber/10",
    },
    {
      label: "THIS WEEK",
      value: weeklyVolume.toString(),
      icon: Activity,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card border border-border p-4">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground font-mono">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
