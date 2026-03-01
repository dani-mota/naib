"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SurveyFormProps {
  token: string;
  candidateName: string;
  assessmentId: string;
}

const SCALE_LABELS = {
  difficulty: [
    "Very Easy",
    "Easy",
    "About Right",
    "Difficult",
    "Very Difficult",
  ],
  fairness: [
    "Very Unfair",
    "Somewhat Unfair",
    "Neutral",
    "Somewhat Fair",
    "Very Fair",
  ],
  faceValidity: [
    "Not at All",
    "Slightly",
    "Moderately",
    "Very",
    "Extremely",
  ],
};

export function SurveyForm({ token, candidateName, assessmentId }: SurveyFormProps) {
  const router = useRouter();
  const [difficulty, setDifficulty] = useState<number | null>(null);
  const [fairness, setFairness] = useState<number | null>(null);
  const [faceValidity, setFaceValidity] = useState<number | null>(null);
  const [openFeedback, setOpenFeedback] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = difficulty !== null && fairness !== null && faceValidity !== null;

  async function handleSubmit() {
    if (!canSubmit) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/assess/${token}/survey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assessmentId,
          difficulty,
          fairness,
          faceValidity,
          openFeedback: openFeedback.trim() || null,
        }),
      });

      if (res.ok) {
        router.push(`/assess/${token}/thank-you`);
      }
    } catch {
      // Allow retry
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-lg mx-auto mt-12 px-6">
      <div className="bg-card border border-border p-8">
        <h1
          className="text-xl font-bold text-foreground mb-1"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Quick Feedback
        </h1>
        <p className="text-xs text-muted-foreground mb-6">
          {candidateName}, please take a moment to share your experience. This helps us improve.
        </p>

        <div className="space-y-6">
          {/* Difficulty */}
          <ScaleQuestion
            label="How would you rate the difficulty of the assessment?"
            options={SCALE_LABELS.difficulty}
            value={difficulty}
            onChange={setDifficulty}
          />

          {/* Fairness */}
          <ScaleQuestion
            label="How fair did the assessment feel?"
            options={SCALE_LABELS.fairness}
            value={fairness}
            onChange={setFairness}
          />

          {/* Face Validity */}
          <ScaleQuestion
            label="How relevant did the questions feel to a real job?"
            options={SCALE_LABELS.faceValidity}
            value={faceValidity}
            onChange={setFaceValidity}
          />

          {/* Open Feedback */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-2">
              Any additional comments? (optional)
            </label>
            <textarea
              value={openFeedback}
              onChange={(e) => setOpenFeedback(e.target.value)}
              className="w-full bg-background border border-border rounded-md p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-aci-gold resize-none"
              rows={3}
              placeholder="Share any thoughts about your experience..."
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full bg-aci-gold hover:bg-aci-gold/90 text-aci-navy font-semibold"
          >
            {submitting ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              "Submit Feedback"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ScaleQuestion({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: number | null;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-foreground mb-2">
        {label}
      </label>
      <div className="flex gap-1">
        {options.map((opt, i) => (
          <button
            key={i}
            onClick={() => onChange(i + 1)}
            className={`flex-1 py-2 px-1 text-[10px] rounded-md border transition-colors ${
              value === i + 1
                ? "bg-aci-gold/10 border-aci-gold text-aci-gold font-medium"
                : "bg-background border-border text-muted-foreground hover:border-aci-gold/40"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
