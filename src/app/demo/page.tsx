"use client";

import { useState } from "react";
import { MiniAssessment } from "@/components/demo/mini-assessment";
import { CinematicLoading } from "@/components/demo/cinematic-loading";
import { DemoDashboard } from "@/components/demo/demo-dashboard";

type Stage = "assessment" | "loading" | "dashboard";

export default function DemoPage() {
  const [stage, setStage] = useState<Stage>("assessment");
  const [answers, setAnswers] = useState<Record<string, number>>({});

  return (
    <>
      {stage === "assessment" && (
        <MiniAssessment
          onComplete={(a) => {
            setAnswers(a);
            setStage("loading");
          }}
        />
      )}
      {stage === "loading" && (
        <CinematicLoading onComplete={() => setStage("dashboard")} />
      )}
      {stage === "dashboard" && (
        <DemoDashboard answers={answers} />
      )}
    </>
  );
}
