"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured. Please contact your administrator.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your assessment dashboard"
      footer={
        <span>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-aci-gold hover:text-aci-gold/80 font-medium">
            Request Access
          </Link>
        </span>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
        {error && (
          <div className="p-3 bg-aci-red/10 border border-aci-red/20 text-xs text-aci-red">
            {error}
          </div>
        )}
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" className="border-border" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-xs text-aci-blue hover:text-aci-blue/80">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="gold" className="w-full h-10 text-sm" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border">
        <Link href="/tutorial/dashboard">
          <Button variant="outline" className="w-full">
            Try Interactive Demo
          </Button>
        </Link>
      </div>
    </AuthCard>
  );
}
