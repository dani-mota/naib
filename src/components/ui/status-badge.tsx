import { getStatusLabel } from "@/lib/format";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md";
}

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  RECOMMENDED: {
    bg: "bg-naib-green/10 dark:bg-naib-green/15",
    text: "text-naib-green",
    border: "border-naib-green/20",
    dot: "bg-naib-green",
  },
  REVIEW_REQUIRED: {
    bg: "bg-naib-amber/10 dark:bg-naib-amber/15",
    text: "text-naib-amber",
    border: "border-naib-amber/20",
    dot: "bg-naib-amber",
  },
  DO_NOT_ADVANCE: {
    bg: "bg-naib-red-muted/10 dark:bg-naib-red-muted/15",
    text: "text-naib-red-muted dark:text-naib-red",
    border: "border-naib-red-muted/20",
    dot: "bg-naib-red-muted dark:bg-naib-red",
  },
  INCOMPLETE: {
    bg: "bg-muted",
    text: "text-muted-foreground",
    border: "border-border",
    dot: "bg-muted-foreground",
  },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const label = getStatusLabel(status);
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.INCOMPLETE;

  return (
    <span
      className={`inline-flex items-center border font-mono uppercase tracking-wider ${config.bg} ${config.text} ${config.border} ${
        size === "sm" ? "px-1.5 py-0.5 text-[10px]" : "px-2 py-0.5 text-[10px]"
      }`}
    >
      <span className={`w-1.5 h-1.5 mr-1.5 ${config.dot}`} />
      {label}
    </span>
  );
}
