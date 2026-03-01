"use client";

import { ASSESSMENT_BLOCKS } from "@/lib/assessment/blocks";

interface ProgressBarProps {
  blockIndex: number;
  currentItem: number;
  totalItems: number;
  timeRemaining?: number;
}

export function ProgressBar({ blockIndex, currentItem, totalItems, timeRemaining }: ProgressBarProps) {
  const block = ASSESSMENT_BLOCKS[blockIndex];
  const itemProgress = totalItems > 0 ? (currentItem / totalItems) * 100 : 0;

  return (
    <div className="bg-card border-b border-border px-6 py-3">
      <div className="max-w-3xl mx-auto">
        {/* Block segments */}
        <div className="flex gap-1 mb-2">
          {ASSESSMENT_BLOCKS.map((b, i) => (
            <div
              key={i}
              className={`h-1 flex-1 transition-colors ${
                i < blockIndex
                  ? "bg-aci-green"
                  : i === blockIndex
                  ? "bg-aci-gold"
                  : "bg-muted"
              }`}
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Block {blockIndex + 1} of {ASSESSMENT_BLOCKS.length}
            </span>
            <span className="text-[10px] text-muted-foreground">
              {block?.name}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-muted-foreground">
              {currentItem} / {totalItems}
            </span>
            {timeRemaining !== undefined && timeRemaining > 0 && (
              <span className={`text-[10px] font-mono font-medium ${timeRemaining < 10 ? "text-aci-red" : "text-aci-amber"}`}>
                {timeRemaining}s
              </span>
            )}
          </div>
        </div>

        {/* Item progress within block */}
        <div className="h-0.5 bg-muted mt-2 overflow-hidden">
          <div
            className="h-full bg-aci-gold transition-all duration-300"
            style={{ width: `${itemProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
