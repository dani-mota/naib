"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ASSESSMENT_BLOCKS } from "@/lib/assessment/blocks";

interface BlockInterstitialProps {
  token: string;
  nextBlockIndex: number;
}

export function BlockInterstitial({ token, nextBlockIndex }: BlockInterstitialProps) {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);
  const nextBlock = ASSESSMENT_BLOCKS[nextBlockIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push(`/assess/${token}/block/${nextBlockIndex}`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, token, nextBlockIndex]);

  if (!nextBlock) return null;

  return (
    <div className="max-w-lg mx-auto mt-24 px-6 text-center">
      <div className="bg-card border border-border p-8">
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">
          Up Next
        </div>
        <h1
          className="text-xl font-bold text-foreground mb-2"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          {nextBlock.name}
        </h1>
        <p className="text-xs text-muted-foreground mb-6">
          {nextBlock.description}
        </p>
        <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground font-mono mb-6">
          <span>~{nextBlock.estimatedMinutes} min</span>
          <span>{nextBlock.constructs.length} dimensions</span>
        </div>
        <div className="text-xs text-muted-foreground">
          Continuing in <span className="font-mono font-medium text-aci-gold">{countdown}</span> seconds...
        </div>
        <button
          onClick={() => router.push(`/assess/${token}/block/${nextBlockIndex}`)}
          className="mt-4 text-xs text-aci-gold hover:text-aci-gold/80 transition-colors uppercase tracking-wider font-medium"
        >
          Start Now
        </button>
      </div>
    </div>
  );
}
