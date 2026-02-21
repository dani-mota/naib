"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AnimatedGrid } from "@/components/auth/animated-grid";

interface MiniAssessmentProps {
  onComplete: (answers: Record<string, number>) => void;
}

const QUESTIONS = [
  {
    id: "spatial",
    construct: "SPATIAL_VISUALIZATION",
    title: "Spatial Reasoning",
    prompt: "If you mentally rotate this L-shaped piece 90° clockwise, which position would it be in?",
    options: [
      { label: "A — rotated right, short arm points up", value: 85 },
      { label: "B — rotated right, short arm points down", value: 40 },
      { label: "C — flipped horizontally", value: 20 },
      { label: "D — no change needed", value: 10 },
    ],
  },
  {
    id: "pattern",
    construct: "PATTERN_RECOGNITION",
    title: "Pattern Detection",
    prompt: "A machine produces the following daily scrap rates: 2%, 3%, 2%, 4%, 3%, 5%, 4%, ?%. What comes next?",
    options: [
      { label: "6% — the pattern alternates and trends upward", value: 90 },
      { label: "5% — it repeats the last peak", value: 45 },
      { label: "4% — it averages out", value: 25 },
      { label: "3% — it corrects back down", value: 15 },
    ],
  },
  {
    id: "sjt",
    construct: "ETHICAL_JUDGMENT",
    title: "Situational Judgment",
    prompt: "You notice a part is 0.001\" outside tolerance. Your shift ends in 10 minutes. The next inspector won't check for 2 hours. What do you do?",
    options: [
      { label: "Flag it immediately and document in the system, even if it means staying late", value: 95 },
      { label: "Set it aside with a note for the next shift to re-check", value: 65 },
      { label: "Re-measure it — measurement uncertainty might account for the difference", value: 50 },
      { label: "It's within the measurement uncertainty range, so it's probably fine", value: 15 },
    ],
  },
  {
    id: "metacog",
    construct: "METACOGNITIVE_CALIBRATION",
    title: "Self-Assessment",
    prompt: "Of the three questions you just answered, how many do you think you got correct?",
    options: [
      { label: "I'm fairly sure I got all 3 right", value: 40 },
      { label: "Probably 2 out of 3 — I was unsure about one", value: 80 },
      { label: "Maybe 1 — these were harder than expected", value: 60 },
      { label: "Hard to say — I'd want to review my reasoning", value: 75 },
    ],
  },
];

export function MiniAssessment({ onComplete }: MiniAssessmentProps) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [selected, setSelected] = useState<number | null>(null);

  const question = QUESTIONS[current];
  const isLast = current === QUESTIONS.length - 1;

  const handleNext = () => {
    if (selected === null) return;

    const newAnswers = { ...answers, [question.construct]: selected };
    setAnswers(newAnswers);

    if (isLast) {
      onComplete(newAnswers);
    } else {
      setCurrent(current + 1);
      setSelected(null);
    }
  };

  return (
    <div className="min-h-screen bg-naib-navy flex items-center justify-center p-4 relative">
      <AnimatedGrid />

      <div className="w-full max-w-2xl relative z-10">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-white/60 uppercase tracking-wider font-mono">
            Question {current + 1} of {QUESTIONS.length}
          </span>
          <div className="flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <div
                key={i}
                className={`h-1 w-8 transition-colors ${
                  i <= current ? "bg-naib-gold" : "bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-card border border-border shadow-lg p-8">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] px-2 py-0.5 bg-naib-blue/10 text-naib-blue font-medium font-mono uppercase tracking-wider">
              {question.title}
            </span>
          </div>

          <h2 className="text-sm font-semibold text-foreground mb-6">
            {question.prompt}
          </h2>

          <div className="space-y-2">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => setSelected(option.value)}
                className={`w-full text-left p-3 border-2 transition-all ${
                  selected === option.value
                    ? "border-naib-gold bg-naib-gold/5"
                    : "border-border hover:border-muted-foreground/30"
                }`}
              >
                <span className="text-xs text-foreground">{option.label}</span>
              </button>
            ))}
          </div>

          <div className="mt-6 flex justify-end">
            <Button
              variant="gold"
              onClick={handleNext}
              disabled={selected === null}
              className="px-8"
            >
              {isLast ? "See My Results" : "Next"}
            </Button>
          </div>
        </div>

        <p className="text-center text-[10px] text-white/40 mt-4 uppercase tracking-wider">
          This is a simplified demo. The full assessment takes 45-60 minutes.
        </p>
      </div>
    </div>
  );
}
