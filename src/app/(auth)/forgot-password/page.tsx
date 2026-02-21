"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <AuthCard
      title={sent ? "Check your email" : "Reset your password"}
      subtitle={sent ? "We sent a password reset link to your email" : "Enter your email and we'll send you a reset link"}
      footer={
        <Link href="/login" className="text-naib-gold hover:text-naib-gold/80 font-medium">
          Back to sign in
        </Link>
      }
    >
      {sent ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-naib-green/10 border border-naib-green/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-naib-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-xs text-muted-foreground">
            Didn&apos;t receive the email? Check your spam folder or{" "}
            <button onClick={() => setSent(false)} className="text-naib-blue hover:underline">try again</button>.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">Email</label>
            <Input id="email" type="email" placeholder="you@company.com" />
          </div>
          <Button type="submit" variant="gold" className="w-full h-10 text-sm">
            Send Reset Link
          </Button>
        </form>
      )}
    </AuthCard>
  );
}
