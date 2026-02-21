"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => router.push("/dashboard"), 500);
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Start assessing candidates in minutes"
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/login" className="text-naib-gold hover:text-naib-gold/80 font-medium">
            Sign in
          </Link>
        </span>
      }
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-naib-navy mb-1">First name</label>
            <Input id="firstName" placeholder="Alex" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-naib-navy mb-1">Last name</label>
            <Input id="lastName" placeholder="Chen" />
          </div>
        </div>
        <div>
          <label htmlFor="company" className="block text-sm font-medium text-naib-navy mb-1">Company</label>
          <Input id="company" placeholder="Your company name" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-naib-navy mb-1">Work email</label>
          <Input id="email" type="email" placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-naib-navy mb-1">Password</label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <Button type="submit" variant="gold" className="w-full h-11 text-base" disabled={loading}>
          {loading ? "Creating account..." : "Get Started"}
        </Button>
      </form>
    </AuthCard>
  );
}
