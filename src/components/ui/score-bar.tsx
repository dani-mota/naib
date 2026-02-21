import { getScoreTier } from "@/lib/format";

interface ScoreBarProps {
  percentile: number;
  showLabel?: boolean;
  height?: number;
}

export function ScoreBar({ percentile, showLabel = true, height = 6 }: ScoreBarProps) {
  const tier = getScoreTier(percentile);

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-muted overflow-hidden" style={{ height }}>
        <div
          className="h-full transition-all duration-300"
          style={{
            width: `${percentile}%`,
            backgroundColor: tier.color,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-[10px] font-mono font-medium tabular-nums min-w-[2rem] text-right" style={{ color: tier.color }}>
          {percentile}
        </span>
      )}
    </div>
  );
}
