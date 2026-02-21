"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, Tooltip,
} from "recharts";
import { CONSTRUCTS, LAYER_INFO, type LayerType } from "@/lib/constructs";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreBar } from "@/components/ui/score-bar";
import { Button } from "@/components/ui/button";

interface DemoDashboardProps {
  answers: Record<string, number>;
}

function generateDemoScores(answers: Record<string, number>) {
  const baseScores: Record<string, number> = {};
  const constructKeys = Object.keys(CONSTRUCTS);

  for (const key of constructKeys) {
    if (answers[key] !== undefined) {
      baseScores[key] = answers[key];
    } else {
      baseScores[key] = 40 + Math.floor(Math.random() * 40);
    }
  }

  return baseScores;
}

export function DemoDashboard({ answers }: DemoDashboardProps) {
  const scores = useMemo(() => generateDemoScores(answers), [answers]);

  const compositeScore = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
  );

  const status = compositeScore >= 65 ? "RECOMMENDED" : compositeScore >= 45 ? "REVIEW_REQUIRED" : "DO_NOT_ADVANCE";

  const chartData = Object.entries(CONSTRUCTS).map(([key, meta]) => ({
    construct: meta.abbreviation,
    fullName: meta.name,
    percentile: scores[key] ?? 50,
    average: 50,
    layer: meta.layer,
    layerColor: LAYER_INFO[meta.layer as LayerType].color,
  }));

  const strengths = Object.entries(scores)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([key]) => CONSTRUCTS[key as keyof typeof CONSTRUCTS]?.name);

  const devAreas = Object.entries(scores)
    .sort(([, a], [, b]) => a - b)
    .slice(0, 2)
    .map(([key]) => CONSTRUCTS[key as keyof typeof CONSTRUCTS]?.name);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Demo Banner */}
      <div className="bg-naib-gold text-naib-navy text-center py-2 px-4 text-sm font-medium">
        You&apos;re viewing the interactive demo.{" "}
        <Link href="/signup" className="underline font-bold">Create an account</Link> to assess your real candidates.
      </div>

      {/* Nav */}
      <header className="h-14 bg-naib-navy border-b border-white/10 flex items-center justify-between px-6">
        <span className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-dm-sans)" }}>
          NAIB
        </span>
        <Link href="/signup">
          <Button variant="gold" size="sm">Get Started</Button>
        </Link>
      </header>

      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Your Results Header */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-naib-navy" style={{ fontFamily: "var(--font-dm-sans)" }}>
                Your Assessment Results
              </h1>
              <p className="text-sm text-naib-slate mt-1">
                Based on your 4-question mini assessment (full version: 12 constructs, 45-60 min)
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-naib-navy">{compositeScore}</div>
              <StatusBadge status={status} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-naib-navy mb-4">Your Construct Profile</h2>
            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                  <PolarGrid stroke="#e2e8f0" />
                  <PolarAngleAxis dataKey="construct" tick={{ fill: "#64748b", fontSize: 11 }} />
                  <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fill: "#94a3b8", fontSize: 10 }} tickCount={5} />
                  <Radar name="Average" dataKey="average" stroke="#94a3b8" strokeDasharray="4 4" fill="none" strokeWidth={1} />
                  <Radar name="You" dataKey="percentile" stroke="#2563EB" fill="#2563EB" fillOpacity={0.15} strokeWidth={2} dot={{ fill: "#2563EB", r: 4 }} />
                  <Tooltip />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side panel */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-naib-navy mb-3">Top Strengths</h3>
              <div className="space-y-2">
                {strengths.map((name) => (
                  <div key={name} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-naib-green" />
                    <span className="text-gray-700">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-naib-navy mb-3">Development Areas</h3>
              <div className="space-y-2">
                {devAreas.map((name) => (
                  <div key={name} className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 rounded-full bg-naib-amber" />
                    <span className="text-gray-700">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3 className="text-sm font-medium text-naib-navy mb-3">Construct Scores</h3>
              <div className="space-y-2">
                {Object.entries(CONSTRUCTS).map(([key, meta]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs text-naib-slate mb-0.5">
                      <span>{meta.abbreviation}</span>
                      <span className="font-medium">{scores[key]}</span>
                    </div>
                    <ScoreBar percentile={scores[key] ?? 0} showLabel={false} height={3} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-naib-navy rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Ready to assess your real candidates?
          </h2>
          <p className="text-white/60 mb-6 max-w-lg mx-auto text-sm">
            NAIB measures 12 cognitive, technical, and behavioral constructs in 45-60 minutes.
            Get composite scores, intelligence reports, and actionable hiring recommendations.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/signup">
              <Button variant="gold" size="lg" className="px-8">
                Create Account
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="px-8 text-white border-white/30 hover:bg-white/10">
              Schedule Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
