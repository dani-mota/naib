"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Grid3X3, GitCompareArrows, Sparkles } from "lucide-react";
import { UserMenu } from "./user-menu";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roles", label: "Roles", icon: Grid3X3 },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 h-14 bg-naib-navy border-b border-white/10">
      <div className="h-full max-w-[1600px] mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-white tracking-tight" style={{ fontFamily: "var(--font-dm-sans)" }}>
            NAIB
          </span>
          <span className="hidden sm:block text-[10px] tracking-[0.2em] text-white/40 uppercase mt-1">
            Assessment Platform
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive
                    ? "text-naib-gold bg-white/10"
                    : "text-white/70 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}

          <div className="w-px h-6 bg-white/10 mx-2" />

          <Link
            href="/demo"
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-naib-gold hover:bg-naib-gold/10 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">Demo</span>
          </Link>
        </nav>

        {/* User Menu */}
        <UserMenu />
      </div>
    </header>
  );
}
