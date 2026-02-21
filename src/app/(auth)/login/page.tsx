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
    // Mock login — just redirect to dashboard
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
          <label htmlFor="email" className="block text-sm font-medium text-naib-navy mb-1">
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
          <label htmlFor="password" className="block text-sm font-medium text-naib-navy mb-1">
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
          <label className="flex items-center gap-2 text-sm text-naib-slate">
            <input type="checkbox" className="rounded border-gray-300" />
            Remember me
          </label>
          <Link href="/forgot-password" className="text-sm text-naib-blue hover:text-naib-blue/80">
            Forgot password?
          </Link>
        </div>
        <Button type="submit" variant="gold" className="w-full h-11 text-base" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100">
        <Link href="/demo">
          <Button variant="outline" className="w-full text-naib-navy border-naib-navy/20 hover:bg-naib-navy/5">
            Try Interactive Demo
          </Button>
        </Link>
      </div>
    </AuthCard>
  );
}
