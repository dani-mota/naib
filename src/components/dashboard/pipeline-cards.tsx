"use client";

import Link from "next/link";
import { Users, TrendingUp } from "lucide-react";

interface RolePipeline {
  slug: string;
  name: string;
  total: number;
  recommended: number;
  review: number;
  doNotAdvance: number;
}

interface PipelineCardsProps {
  roles: RolePipeline[];
}

export function PipelineCards({ roles }: PipelineCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
      {roles.map((role) => {
        const strongFitPct = role.total > 0 ? Math.round((role.recommended / role.total) * 100) : 0;

        return (
          <Link
            key={role.slug}
            href={`/roles?role=${role.slug}`}
            className="bg-white rounded-xl border border-gray-200 p-4 hover:border-naib-blue/30 hover:shadow-md transition-all group"
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-naib-navy truncate group-hover:text-naib-blue transition-colors">
                {role.name}
              </h3>
              <Users className="w-4 h-4 text-naib-slate" />
            </div>

            <div className="text-2xl font-bold text-naib-navy mb-2">{role.total}</div>

            {/* Strong fit bar */}
            <div className="mb-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-naib-slate">Strong Fit</span>
                <span className="font-medium text-naib-green flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {strongFitPct}%
                </span>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-naib-green rounded-full transition-all duration-500"
                  style={{ width: `${strongFitPct}%` }}
                />
              </div>
            </div>

            {/* Status breakdown */}
            <div className="flex gap-3 text-[11px] text-naib-slate">
              <span>{role.recommended} pass</span>
              <span>{role.review} review</span>
              <span>{role.doNotAdvance} decline</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
