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
      label: "Total Assessed",
      value: totalAssessed.toString(),
      icon: Users,
      color: "text-naib-blue",
      bg: "bg-naib-blue/10",
    },
    {
      label: "Strong Fit Rate",
      value: `${strongFitRate}%`,
      icon: CheckCircle,
      color: "text-naib-green",
      bg: "bg-naib-green/10",
    },
    {
      label: "Avg Duration",
      value: `${avgDuration}m`,
      icon: Clock,
      color: "text-naib-amber",
      bg: "bg-naib-amber/10",
    },
    {
      label: "This Week",
      value: weeklyVolume.toString(),
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-naib-navy">{stat.value}</p>
              <p className="text-xs text-naib-slate">{stat.label}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
