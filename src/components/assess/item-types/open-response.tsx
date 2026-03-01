"use client";

import { useState } from "react";

interface OpenResponseProps {
  prompt: string;
  onSubmit: (response: string) => void;
}

export function OpenResponse({ prompt, onSubmit }: OpenResponseProps) {
  const [text, setText] = useState("");
  const minLength = 50;

  return (
    <div className="space-y-6">
      <p className="text-sm text-foreground leading-relaxed">{prompt}</p>
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-40 p-4 border border-border bg-card text-xs text-foreground resize-none focus:outline-none focus:border-aci-gold/50 transition-colors"
          placeholder="Type your response here..."
        />
        <div className="flex items-center justify-between mt-1.5">
          <span className={`text-[10px] font-mono ${text.length < minLength ? "text-muted-foreground" : "text-aci-green"}`}>
            {text.length} characters
          </span>
          {text.length < minLength && (
            <span className="text-[10px] text-muted-foreground">
              Minimum {minLength} characters
            </span>
          )}
        </div>
      </div>
      <button
        onClick={() => onSubmit(text)}
        disabled={text.length < minLength}
        className="w-full bg-aci-gold text-aci-navy font-bold text-xs py-3 uppercase tracking-wider disabled:opacity-50 hover:bg-aci-gold/90 transition-colors"
      >
        Submit Response
      </button>
    </div>
  );
}
