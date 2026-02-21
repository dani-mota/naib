"use client";

import { InitialsBadge } from "@/components/ui/initials-badge";
import { Mail, Phone, Calendar } from "lucide-react";
import { formatRelativeDate } from "@/lib/format";

interface IdentityCardProps {
  candidate: any;
}

export function IdentityCard({ candidate }: IdentityCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex flex-col items-center text-center">
        <InitialsBadge firstName={candidate.firstName} lastName={candidate.lastName} size="lg" />
        <h2 className="mt-3 text-lg font-semibold text-naib-navy">
          {candidate.firstName} {candidate.lastName}
        </h2>
        <p className="text-sm text-naib-slate">{candidate.primaryRole.name}</p>
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4 text-naib-slate" />
          <span className="truncate">{candidate.email}</span>
        </div>
        {candidate.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Phone className="w-4 h-4 text-naib-slate" />
            <span>{candidate.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-naib-slate" />
          <span>Assessed {formatRelativeDate(new Date(candidate.createdAt))}</span>
        </div>
      </div>
    </div>
  );
}
