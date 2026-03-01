"use client";

import { useState } from "react";

interface MultipleChoiceProps {
  prompt: string;
  options: string[];
  onSubmit: (response: string) => void;
}

export function MultipleChoice({ prompt, options, onSubmit }: MultipleChoiceProps) {
  const [selected, setSelected] = useState<string | null>(null);

  return (
    <div className="space-y-6">
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
        onClick={() => selected && onSubmit(selected)}
        disabled={!selected}
        className="w-full bg-aci-gold text-aci-navy font-bold text-xs py-3 uppercase tracking-wider disabled:opacity-50 hover:bg-aci-gold/90 transition-colors"
      >
        Submit Answer
      </button>
    </div>
  );
}
