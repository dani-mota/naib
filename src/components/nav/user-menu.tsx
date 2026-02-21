"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, Settings, LogOut, ChevronDown } from "lucide-react";
import { getMockSession } from "@/lib/rbac";

export function UserMenu() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const session = getMockSession();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-md text-white/80 hover:text-white hover:bg-white/5 transition-colors"
      >
        <div className="w-7 h-7 rounded-full bg-naib-blue flex items-center justify-center text-xs font-semibold text-white">
          {session.user.name.split(" ").map(n => n[0]).join("")}
        </div>
        <span className="hidden md:block text-sm">{session.user.name}</span>
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <div className="px-3 py-2 border-b border-gray-100">
            <p className="text-sm font-medium text-naib-navy">{session.user.name}</p>
            <p className="text-xs text-naib-slate">{session.user.email}</p>
            <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 bg-naib-blue/10 text-naib-blue rounded font-medium">
              {session.user.role.replace("_", " ")}
            </span>
          </div>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => { setOpen(false); }}
          >
            <User className="w-4 h-4" /> Profile
          </button>
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => { setOpen(false); }}
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
            onClick={() => { setOpen(false); router.push("/login"); }}
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
