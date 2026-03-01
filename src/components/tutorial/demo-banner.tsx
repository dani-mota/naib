"use client";

import Link from "next/link";
import { useAppStore } from "@/stores/app-store";
import { GraduationCap } from "lucide-react";

export function DemoBanner() {
  const { tutorialStep, enterTutorial } = useAppStore();

  return (
    <div className="bg-aci-gold text-aci-navy text-center py-2 px-4 text-xs font-medium uppercase tracking-wider z-50 flex items-center justify-center gap-4">
      <span>
        You are viewing the Tutorial Demo with sample data.{" "}
        <Link href="/dashboard" className="underline font-bold">
          Go to your live dashboard
        </Link>
      </span>
      {tutorialStep === null && (
        <button
          onClick={enterTutorial}
          className="inline-flex items-center gap-1 bg-aci-navy text-aci-gold px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider hover:bg-aci-navy/90 transition-colors"
        >
          <GraduationCap className="w-3 h-3" />
          Start Guided Tour
        </button>
      )}
    </div>
  );
}
