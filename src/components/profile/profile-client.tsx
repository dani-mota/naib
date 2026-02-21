"use client";

import { useState } from "react";
import { IdentityCard } from "./identity-card";
import { DecisionSummary } from "./decision-summary";
import { SpiderChart } from "./spider-chart";
import { IntelligenceReport } from "./intelligence-report";
import { LayerResults } from "./layer-results";
import { PredictionsGrid } from "./predictions-grid";
import { RoleSwitcher } from "./role-switcher";
import { InterviewGuide } from "./interview-guide";

interface ProfileClientProps {
  candidate: any;
  allRoles: any[];
  cutlines: any[];
}

export function ProfileClient({ candidate, allRoles, cutlines }: ProfileClientProps) {
  const [selectedRoleSlug, setSelectedRoleSlug] = useState(candidate.primaryRole.slug);

  const selectedRole = allRoles.find((r: any) => r.slug === selectedRoleSlug) || allRoles[0];
  const compositeScore = candidate.assessment?.compositeScores?.find(
    (cs: any) => cs.roleSlug === selectedRoleSlug
  );
  const cutline = cutlines.find((c: any) => c.roleId === selectedRole?.id);

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr_300px] gap-4">
        {/* Left Sidebar */}
        <div className="space-y-3">
          <IdentityCard candidate={candidate} />
          <DecisionSummary
            candidate={candidate}
            compositeScore={compositeScore}
            roleName={selectedRole?.name}
          />
        </div>

        {/* Center Column */}
        <div className="space-y-4 min-w-0">
          {/* Executive Summary */}
          <div className="bg-card border border-border p-5">
            <h2 className="text-sm font-semibold text-foreground mb-2 uppercase tracking-wider" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Executive Summary
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {candidate.firstName} {candidate.lastName} was assessed for the{" "}
              <strong className="text-foreground">{selectedRole?.name}</strong> role and received a composite score of{" "}
              <strong className="text-foreground font-mono">{compositeScore?.percentile ?? "N/A"}th percentile</strong>.{" "}
              {compositeScore?.passed
                ? "The candidate meets all cutline thresholds and is recommended for advancement."
                : `The candidate is ${Math.abs(compositeScore?.distanceFromCutline ?? 0)} points from the nearest cutline threshold.`}
            </p>
            {candidate.assessment?.redFlags?.length > 0 && (
              <div className="mt-3 p-3 bg-naib-red/5 border border-naib-red/20">
                <p className="text-xs text-naib-red font-medium font-mono uppercase tracking-wider">
                  {candidate.assessment.redFlags.length} flag(s) identified during assessment
                </p>
              </div>
            )}
          </div>

          <SpiderChart
            subtestResults={candidate.assessment?.subtestResults || []}
            roleWeights={selectedRole?.compositeWeights || []}
            cutline={cutline}
            roleSlug={selectedRoleSlug}
          />

          <IntelligenceReport
            subtestResults={candidate.assessment?.subtestResults || []}
            roleName={selectedRole?.name}
          />

          <LayerResults
            subtestResults={candidate.assessment?.subtestResults || []}
            aiInteractions={candidate.assessment?.aiInteractions || []}
          />

          <PredictionsGrid prediction={candidate.assessment?.predictions} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-3">
          <RoleSwitcher
            roles={allRoles}
            selectedSlug={selectedRoleSlug}
            onSelect={setSelectedRoleSlug}
            compositeScores={candidate.assessment?.compositeScores || []}
          />
          <InterviewGuide
            subtestResults={candidate.assessment?.subtestResults || []}
            redFlags={candidate.assessment?.redFlags || []}
          />
        </div>
      </div>
    </div>
  );
}
