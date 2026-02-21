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
      <div className="flex-1 bg-gray-100 rounded-full overflow-hidden" style={{ height }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentile}%`,
            backgroundColor: tier.color,
          }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-medium tabular-nums min-w-[2rem] text-right" style={{ color: tier.color }}>
          {percentile}
        </span>
      )}
    </div>
  );
}
