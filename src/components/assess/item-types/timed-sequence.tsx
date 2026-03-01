"use client";

import { useState, useEffect, useCallback } from "react";

interface TimedSequenceProps {
  prompt: string;
  options: string[];
  timeLimit: number;
  onSubmit: (response: string) => void;
}

export function TimedSequence({ prompt, options, timeLimit, onSubmit }: TimedSequenceProps) {
  const [selected, setSelected] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(timeLimit);

  const handleSubmit = useCallback(
    (response: string) => {
      onSubmit(response);
    },
    [onSubmit]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Auto-submit with whatever is selected, or empty
          handleSubmit(selected || "TIME_EXPIRED");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selected, handleSubmit]);

  return (
    <div className="space-y-6">
      {/* Timer */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Timed Question</span>
        <span className={`text-sm font-mono font-bold ${remaining < 10 ? "text-aci-red" : "text-aci-amber"}`}>
          {remaining}s
        </span>
      </div>
      <div className="h-1 bg-muted overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${remaining < 10 ? "bg-aci-red" : "bg-aci-amber"}`}
          style={{ width: `${(remaining / timeLimit) * 100}%` }}
        />
      </div>

      <p className="text-sm text-foreground leading-relaxed">{prompt}</p>
      <div className="space-y-2">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => setSelected(option)}
            className={`w-full text-left p-4 border transition-all text-xs ${
              selected === option
                ? "border-aci-gold bg-aci-gold/5 text-foreground"
                : "border-border hover:border-aci-gold/30 text-muted-foreground hover:text-foreground"
            }`}
          >
            <span className="font-mono text-[10px] text-muted-foreground mr-3">
              {String.fromCharCode(65 + i)}
            </span>
            {option}
          </button>
        ))}
      </div>
      <button
        onClick={() => selected && handleSubmit(selected)}
        disabled={!selected}
        className="w-full bg-aci-gold text-aci-navy font-bold text-xs py-3 uppercase tracking-wider disabled:opacity-50 hover:bg-aci-gold/90 transition-colors"
      >
        Submit Answer
      </button>
    </div>
  );
}
