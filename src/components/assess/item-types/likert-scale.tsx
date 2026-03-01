"use client";

import { useState } from "react";

interface LikertScaleProps {
  prompt: string;
  options: string[];
  onSubmit: (response: string) => void;
}

export function LikertScale({ prompt, options, onSubmit }: LikertScaleProps) {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <p className="text-sm text-foreground leading-relaxed">{prompt}</p>
      <div className="flex gap-2">
        {options.map((label, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`flex-1 p-3 border transition-all text-center ${
              selected === i
                ? "border-aci-gold bg-aci-gold/5"
                : "border-border hover:border-aci-gold/30"
            }`}
          >
            <div className={`text-lg font-bold font-mono mb-1 ${selected === i ? "text-aci-gold" : "text-muted-foreground"}`}>
              {i + 1}
            </div>
            <div className="text-[9px] text-muted-foreground leading-tight uppercase tracking-wider">
              {label}
            </div>
          </button>
        ))}
      </div>
      <button
        onClick={() => selected !== null && onSubmit(options[selected])}
        disabled={selected === null}
        className="w-full bg-aci-gold text-aci-navy font-bold text-xs py-3 uppercase tracking-wider disabled:opacity-50 hover:bg-aci-gold/90 transition-colors"
      >
        Continue
      </button>
    </div>
  );
}
