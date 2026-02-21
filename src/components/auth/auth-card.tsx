"use client";

import { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthCard({ title, subtitle, children, footer }: AuthCardProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-8 relative z-10">
        {/* NAIB Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-naib-navy" style={{ fontFamily: "var(--font-dm-sans)" }}>
            NAIB
          </h1>
          <p className="text-xs tracking-[0.3em] text-naib-slate mt-1 uppercase">
            NextGen Aptitude & Integrity Battery
          </p>
        </div>

        <h2 className="text-xl font-semibold text-naib-navy mb-1">{title}</h2>
        {subtitle && <p className="text-sm text-naib-slate mb-6">{subtitle}</p>}

        {children}
      </div>
      {footer && (
        <div className="text-center mt-4 text-sm text-white/60">
          {footer}
        </div>
      )}
    </div>
  );
}
