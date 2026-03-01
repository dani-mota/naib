"use client";

import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface BatchProgressProps {
  status: "idle" | "sending" | "complete" | "error";
  total: number;
  sent: number;
  failed: number;
}

export function BatchProgress({ status, total, sent, failed }: BatchProgressProps) {
  if (status === "idle") return null;

  const progress = total > 0 ? Math.round(((sent + failed) / total) * 100) : 0;

  return (
    <div className="bg-card border border-border p-4 space-y-3">
      <div className="flex items-center gap-2">
        {status === "sending" && <Loader2 className="w-4 h-4 text-aci-gold animate-spin" />}
        {status === "complete" && <CheckCircle2 className="w-4 h-4 text-aci-green" />}
        {status === "error" && <AlertCircle className="w-4 h-4 text-aci-red" />}
        <span className="text-xs font-medium text-foreground uppercase tracking-wider">
          {status === "sending" && "Sending invitations..."}
          {status === "complete" && "Batch complete"}
          {status === "error" && "Batch completed with errors"}
        </span>
      </div>

      <div className="h-1.5 bg-muted overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            failed > 0 ? "bg-aci-amber" : "bg-aci-green"
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex gap-4 text-[10px] text-muted-foreground font-mono">
        <span>{total} total</span>
        <span className="text-aci-green">{sent} sent</span>
        {failed > 0 && <span className="text-aci-red">{failed} failed</span>}
      </div>
    </div>
  );
}
