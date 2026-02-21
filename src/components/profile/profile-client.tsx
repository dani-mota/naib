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
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_320px] gap-6">
        {/* Left Sidebar */}
        <div className="space-y-4">
          <IdentityCard candidate={candidate} />
          <DecisionSummary
            candidate={candidate}
            compositeScore={compositeScore}
            roleName={selectedRole?.name}
          />
        </div>

        {/* Center Column */}
        <div className="space-y-6 min-w-0">
          {/* Executive Summary */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-naib-navy mb-3" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Executive Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {candidate.firstName} {candidate.lastName} was assessed for the{" "}
              <strong>{selectedRole?.name}</strong> role and received a composite score of{" "}
              <strong>{compositeScore?.percentile ?? "N/A"}th percentile</strong>.{" "}
              {compositeScore?.passed
                ? "The candidate meets all cutline thresholds and is recommended for advancement."
                : `The candidate is ${Math.abs(compositeScore?.distanceFromCutline ?? 0)} points from the nearest cutline threshold.`}
            </p>
            {candidate.assessment?.redFlags?.length > 0 && (
              <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                <p className="text-sm text-red-800 font-medium">
                  {candidate.assessment.redFlags.length} flag(s) identified during assessment
                </p>
              </div>
            )}
          </div>

          {/* Spider Chart */}
          <SpiderChart
            subtestResults={candidate.assessment?.subtestResults || []}
            roleWeights={selectedRole?.compositeWeights || []}
            cutline={cutline}
          />

          {/* Intelligence Report */}
          <IntelligenceReport
            subtestResults={candidate.assessment?.subtestResults || []}
            roleName={selectedRole?.name}
          />

          {/* Layer Results */}
          <LayerResults
            subtestResults={candidate.assessment?.subtestResults || []}
            aiInteractions={candidate.assessment?.aiInteractions || []}
          />

          {/* Predictions */}
          <PredictionsGrid prediction={candidate.assessment?.predictions} />
        </div>

        {/* Right Sidebar */}
        <div className="space-y-4">
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
