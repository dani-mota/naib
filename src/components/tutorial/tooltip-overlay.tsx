"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppStore } from "@/stores/app-store";
import { TUTORIAL_STEPS } from "./tutorial-steps";
import { TutorialComplete } from "./tutorial-complete";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function TooltipOverlay() {
  const { tutorialStep, setTutorialStep, exitTutorial } = useAppStore();
  const router = useRouter();
  const pathname = usePathname();
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);

  const step = tutorialStep !== null ? TUTORIAL_STEPS[tutorialStep - 1] : null;
  const isLastStep = tutorialStep === TUTORIAL_STEPS.length;

  const findTarget = useCallback(() => {
    if (!step) return;
    const el = document.querySelector(`[data-tutorial="${step.target}"]`);
    if (el) {
      const rect = el.getBoundingClientRect();
      setTargetRect({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
      // Scroll into view if needed
      el.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      setTargetRect(null);
    }
  }, [step]);

  // Navigate to the correct page for the current step
  useEffect(() => {
    if (!step) return;

    // For candidate profile steps, navigate to the first demo candidate
    let targetPath = step.page;
    if (targetPath === "/tutorial/candidates") {
      // Will be handled by the page — just navigate to dashboard
      // The profile page will be reached by clicking a candidate
      targetPath = "/tutorial/dashboard";
    }

    if (!pathname.startsWith(targetPath)) {
      router.push(targetPath);
    }
  }, [step, pathname, router]);

  // Find and position the tooltip when step changes or after navigation
  useEffect(() => {
    if (!step) return;
    // Small delay to allow DOM to update after navigation
    const timer = setTimeout(findTarget, 300);
    window.addEventListener("resize", findTarget);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", findTarget);
    };
  }, [step, pathname, findTarget]);

  if (tutorialStep === null) return null;

  // Show completion screen on the last step
  if (isLastStep && step?.target === "tutorial-complete") {
    return <TutorialComplete />;
  }

  const handleNext = () => {
    if (!tutorialStep) return;
    if (tutorialStep < TUTORIAL_STEPS.length) {
      setTutorialStep(tutorialStep + 1);
    }
  };

  const handlePrev = () => {
    if (!tutorialStep || tutorialStep <= 1) return;
    setTutorialStep(tutorialStep - 1);
  };

  const handleSkip = () => {
    exitTutorial();
    router.push("/dashboard");
  };

  // Calculate tooltip position
  const getTooltipStyle = (): React.CSSProperties => {
    if (!targetRect || !step) {
      return { top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }

    const padding = 12;
    const position = step.position || "bottom";

    switch (position) {
      case "bottom":
        return {
          top: targetRect.top + targetRect.height + padding,
          left: targetRect.left + targetRect.width / 2,
          transform: "translateX(-50%)",
        };
      case "top":
        return {
          top: targetRect.top - padding,
          left: targetRect.left + targetRect.width / 2,
          transform: "translate(-50%, -100%)",
        };
      case "left":
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left - padding,
          transform: "translate(-100%, -50%)",
        };
      case "right":
        return {
          top: targetRect.top + targetRect.height / 2,
          left: targetRect.left + targetRect.width + padding,
          transform: "translateY(-50%)",
        };
    }
  };

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Backdrop overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto" style={{ minHeight: "100vh" }}>
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left - 8}
                y={targetRect.top - 8}
                width={targetRect.width + 16}
                height={targetRect.height + 16}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.6)"
          mask="url(#spotlight-mask)"
        />
      </svg>

      {/* Spotlight border */}
      {targetRect && (
        <div
          className="absolute border-2 border-aci-gold rounded-lg pointer-events-none"
          style={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
        />
      )}

      {/* Tooltip card */}
      {step && (
        <div
          className="absolute bg-card border border-aci-gold/30 shadow-lg rounded-lg p-4 w-80 pointer-events-auto z-[101]"
          style={getTooltipStyle()}
        >
          {/* Close button */}
          <button
            onClick={handleSkip}
            className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Step indicator */}
          <div className="flex items-center gap-1.5 mb-2">
            {TUTORIAL_STEPS.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-colors ${
                  i + 1 === tutorialStep
                    ? "w-4 bg-aci-gold"
                    : i + 1 < (tutorialStep || 0)
                    ? "w-2 bg-aci-gold/50"
                    : "w-2 bg-border"
                }`}
              />
            ))}
          </div>

          <h3
            className="text-sm font-bold text-foreground mb-1"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            {step.title}
          </h3>
          <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
            {step.description}
          </p>

          <div className="flex items-center justify-between">
            <button
              onClick={handleSkip}
              className="text-[10px] text-muted-foreground hover:text-foreground"
            >
              Skip tutorial
            </button>
            <div className="flex items-center gap-1.5">
              {(tutorialStep || 0) > 1 && (
                <button
                  onClick={handlePrev}
                  className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-1 rounded border border-border"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Back
                </button>
              )}
              <button
                onClick={handleNext}
                className="flex items-center gap-1 text-xs text-aci-navy bg-aci-gold hover:bg-aci-gold/90 px-3 py-1 rounded font-medium"
              >
                {tutorialStep === TUTORIAL_STEPS.length - 1 ? "Finish" : "Next"}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
