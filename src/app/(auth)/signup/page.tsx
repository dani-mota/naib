"use client";

import { useState } from "react";
import Link from "next/link";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.target as HTMLFormElement;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirmPassword = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;
    const firstName = (form.elements.namedItem("firstName") as HTMLInputElement).value;
    const lastName = (form.elements.namedItem("lastName") as HTMLInputElement).value;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured. Please contact your administrator.");
      setLoading(false);
      return;
    }

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
        },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <AuthCard
      title="Request Access"
      subtitle="Submit a request to join your organization&apos;s assessment platform"
      footer={
        <span>
          Already have an account?{" "}
          <Link href="/login" className="text-aci-gold hover:text-aci-gold/80 font-medium">
            Sign in
          </Link>
        </span>
      }
    >
      {success ? (
        <div className="text-center py-4">
          <div className="w-14 h-14 bg-aci-green/10 border border-aci-green/20 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-aci-green" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium text-foreground mb-2">Request submitted</p>
          <p className="text-xs text-muted-foreground">
            Check your email to confirm your account. An administrator will approve your access shortly.
          </p>
        </div>
      ) : (
      <form onSubmit={handleSignup} className="space-y-4">
        {error && (
          <div className="p-3 bg-aci-red/10 border border-aci-red/20 text-xs text-aci-red">
            {error}
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="firstName" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">First name</label>
            <Input id="firstName" placeholder="Alex" />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">Last name</label>
            <Input id="lastName" placeholder="Chen" />
          </div>
        </div>
        <div>
          <label htmlFor="company" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">Organization</label>
          <Input id="company" placeholder="Your company name" />
        </div>
        <div>
          <label htmlFor="role" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">Role</label>
          <select
            id="role"
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            defaultValue=""
          >
            <option value="" disabled>Select your role</option>
            <option value="RECRUITER_COORDINATOR">Recruiter</option>
            <option value="RECRUITING_MANAGER">Recruiting Manager</option>
            <option value="HIRING_MANAGER">Hiring Manager</option>
            <option value="TA_LEADER">TA Leader</option>
          </select>
        </div>
        <div>
          <label htmlFor="email" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">Work email</label>
          <Input id="email" type="email" placeholder="you@company.com" />
        </div>
        <div>
          <label htmlFor="password" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">Password</label>
          <Input id="password" type="password" placeholder="••••••••" />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-xs font-medium text-foreground mb-1.5 uppercase tracking-wider">Confirm Password</label>
          <Input id="confirmPassword" type="password" placeholder="••••••••" />
        </div>
        <Button type="submit" variant="gold" className="w-full h-10 text-sm" disabled={loading}>
          {loading ? "Submitting..." : "Request Access"}
        </Button>
      </form>
      )}
    </AuthCard>
  );
}
