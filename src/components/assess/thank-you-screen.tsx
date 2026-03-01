"use client";

import { CheckCircle2 } from "lucide-react";

export function ThankYouScreen() {
  return (
    <div className="max-w-lg mx-auto mt-24 px-6 text-center">
      <div className="bg-card border border-border p-8">
        <div className="w-12 h-12 bg-aci-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-6 h-6 text-aci-green" />
        </div>
        <h1
          className="text-xl font-bold text-foreground mb-2"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Thank You!
        </h1>
        <p className="text-xs text-muted-foreground mb-4">
          Your assessment is complete and your feedback has been recorded.
        </p>
        <p className="text-xs text-muted-foreground">
          Results will be shared with you within one week. You may now close this window.
        </p>
      </div>
    </div>
  );
}
