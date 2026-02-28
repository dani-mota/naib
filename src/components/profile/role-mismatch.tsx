"use client";

import { ArrowRight, Sparkles } from "lucide-react";
import { ScoreBar } from "@/components/ui/score-bar";

interface RoleMismatchProps {
  compositeScores: any[];
  primaryRoleSlug: string;
  candidateStatus: string;
  roles: any[];
  onSelect: (slug: string) => void;
}

export function RoleMismatch({
  compositeScores,
  primaryRoleSlug,
  candidateStatus,
  roles,
  onSelect,
}: RoleMismatchProps) {
  // Only show for DO_NOT_ADVANCE or REVIEW_REQUIRED
  if (candidateStatus !== "DO_NOT_ADVANCE" && candidateStatus !== "REVIEW_REQUIRED") {
    return null;
  }

  // Find roles where the candidate passes but it's not their primary role
  const alternatives = compositeScores
    .filter((cs: any) => cs.passed && cs.roleSlug !== primaryRoleSlug)
    .map((cs: any) => {
      const role = roles.find((r: any) => r.slug === cs.roleSlug);
      return {
        slug: cs.roleSlug,
        name: role?.name ?? cs.roleSlug,
        percentile: cs.percentile,
        distance: cs.distanceFromCutline,
      };
    })
    .sort((a, b) => b.percentile - a.percentile);

  if (alternatives.length === 0) {
    return null;
  }

  return (
    <div className="bg-card border border-aci-gold/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-3.5 h-3.5 text-aci-gold" />
        <h3 className="text-[10px] font-semibold text-aci-gold uppercase tracking-wider">
          Alternative Role Fits
        </h3>
      </div>
      <p className="text-[10px] text-muted-foreground mb-3 leading-relaxed">
        This candidate may be a stronger fit for other roles in your pipeline.
      </p>
      <div className="space-y-2">
        {alternatives.map((alt) => (
          <button
            key={alt.slug}
            onClick={() => onSelect(alt.slug)}
            className="w-full p-2.5 border border-border hover:border-aci-gold/30 hover:bg-aci-gold/5 transition-all text-left group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-foreground uppercase tracking-wider">
                {alt.name}
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold font-mono text-aci-green">{alt.percentile}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-aci-green/10 text-aci-green font-semibold uppercase tracking-wider">
                  Strong Fit
                </span>
              </div>
            </div>
            <ScoreBar percentile={alt.percentile} height={3} showLabel={false} />
            <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground group-hover:text-aci-gold transition-colors">
              <span>View role profile</span>
              <ArrowRight className="w-3 h-3" />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
