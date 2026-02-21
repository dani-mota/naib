"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 500);
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your assessment dashboard"
      footer={
        <span>
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-naib-gold hover:text-naib-gold/80 font-medium">
            Create one
          </Link>
        </span>
      }
    >
      <form onSubmit={handleLogin} className="space-y-4">
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
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs text-muted-foreground">
            <input type="checkbox" className="border-border" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-xs text-naib-blue hover:text-naib-blue/80">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="gold" className="w-full h-10 text-sm" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-border">
        <Link href="/demo">
          <Button variant="outline" className="w-full">
            Try Interactive Demo
          </Button>
        </Link>
      </div>
    </AuthCard>
  );
}
