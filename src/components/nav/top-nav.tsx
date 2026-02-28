"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Grid3X3, GitCompareArrows, Sparkles, Sun, Moon } from "lucide-react";
import { UserMenu } from "./user-menu";
import { NotificationBell } from "./notification-bell";
import { useTheme } from "@/components/theme-provider";
import type { Notification } from "@/lib/notifications";

function hoursAgo(h: number) { return new Date(Date.now() - h * 3600000); }
function daysAgo(d: number) { return new Date(Date.now() - d * 86400000); }

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "ASSESSMENT_COMPLETED", title: "Assessment Completed", message: "Sarah Okafor completed their CNC Machinist assessment.", timestamp: hoursAgo(2), read: false },
  { id: "n2", type: "AWAITING_DECISION", title: "Awaiting Decision", message: "Kevin Park has been awaiting decision for 3 days.", timestamp: hoursAgo(72), read: false },
  { id: "n3", type: "ASSESSMENT_COMPLETED", title: "Assessment Completed", message: "Maria Santos completed their Manufacturing Engineer assessment.", timestamp: hoursAgo(6), read: false },
  { id: "n4", type: "STATUS_CHANGED", title: "Status Updated", message: "James Chen marked as Strong Fit for CAM Programmer.", timestamp: daysAgo(1), read: true },
  { id: "n5", type: "NEW_CANDIDATE", title: "New Candidate", message: "Lisa Wong was added to the CMM Programmer pipeline.", timestamp: daysAgo(2), read: true },
];

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/roles", label: "Roles", icon: Grid3X3 },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
];

export function TopNav() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 h-12 bg-card border-b border-border">
      <div className="h-full max-w-[1600px] mx-auto px-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="text-lg font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
            ACI
          </span>
          <div className="hidden sm:block h-4 w-px bg-border" />
          <span className="hidden sm:block text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
            Assessment Platform
          </span>
        </Link>

        <nav className="flex items-center gap-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-colors ${
                  isActive
                    ? "text-aci-gold border-b-2 border-aci-gold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{label}</span>
              </Link>
            );
          })}
          <div className="w-px h-5 bg-border mx-1.5" />
          <Link
            href="/demo"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-aci-gold hover:text-aci-gold/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Demo</span>
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <NotificationBell notifications={MOCK_NOTIFICATIONS} />
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
