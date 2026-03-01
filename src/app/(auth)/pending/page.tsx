"use client";

import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Clock } from "lucide-react";

export default function PendingPage() {
  const router = useRouter();

  const handleSignOut = async () => {
    const supabase = createSupabaseBrowserClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/login");
    router.refresh();
  };

  return (
    <AuthCard
      title="Access Pending"
      subtitle="Your request is being reviewed"
    >
      <div className="text-center py-4">
        <div className="w-14 h-14 bg-aci-amber/10 border border-aci-amber/20 flex items-center justify-center mx-auto mb-4">
          <Clock className="w-7 h-7 text-aci-amber" />
        </div>
        <p className="text-sm font-medium text-foreground mb-2">
          Waiting for administrator approval
        </p>
        <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
          An administrator is reviewing your access request. You will receive an
          email once your account has been approved.
        </p>
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleSignOut}
          >
            Sign Out
          </Button>
          <button
            onClick={() => router.push("/login")}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Back to login
          </button>
        </div>
      </div>
    </AuthCard>
  );
}
