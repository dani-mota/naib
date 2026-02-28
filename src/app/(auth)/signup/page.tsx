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
      <form onSubmit={handleSignup} className="space-y-4">
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
    </AuthCard>
  );
}
