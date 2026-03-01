"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

interface CompletionScreenProps {
  token: string;
}

export function CompletionScreen({ token }: CompletionScreenProps) {
  const router = useRouter();
  const [completing, setCompleting] = useState(true);

  useEffect(() => {
    async function complete() {
      try {
        await fetch(`/api/assess/${token}/complete`, { method: "POST" });
      } catch {
        // Complete will be handled server-side eventually
      }
      setCompleting(false);
      // Redirect to survey after a brief moment
      setTimeout(() => {
        router.push(`/assess/${token}/survey`);
      }, 3000);
    }
    complete();
  }, [token, router]);

  return (
    <div className="max-w-lg mx-auto mt-24 px-6 text-center">
      <div className="bg-card border border-border p-8">
        {completing ? (
          <>
            <Loader2 className="w-8 h-8 text-aci-gold animate-spin mx-auto mb-4" />
            <h1 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Submitting Your Assessment
            </h1>
            <p className="text-xs text-muted-foreground">Please wait while we process your responses...</p>
          </>
        ) : (
          <>
            <div className="w-12 h-12 bg-aci-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-6 h-6 text-aci-green" />
            </div>
            <h1 className="text-xl font-bold text-foreground mb-2" style={{ fontFamily: "var(--font-dm-sans)" }}>
              Assessment Complete
            </h1>
            <p className="text-xs text-muted-foreground mb-4">
              Thank you for completing the assessment. You will now be directed to a brief survey.
            </p>
            <p className="text-[10px] text-muted-foreground">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
}
