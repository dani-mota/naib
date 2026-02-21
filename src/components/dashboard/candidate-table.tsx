"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ChevronUp, ChevronDown, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { ScoreBar } from "@/components/ui/score-bar";
import { InitialsBadge } from "@/components/ui/initials-badge";
import { formatRelativeDate } from "@/lib/format";

interface CandidateRow {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: string;
  createdAt: string;
  primaryRole: { name: string; slug: string };
  assessment?: {
    durationMinutes?: number;
    compositeScores: { roleSlug: string; percentile: number; passed: boolean }[];
    redFlags: { severity: string }[];
  };
}

interface CandidateTableProps {
  candidates: CandidateRow[];
}

type SortField = "name" | "status" | "role" | "score" | "date";

export function CandidateTable({ candidates }: CandidateTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const roles = useMemo(() => {
    const r = new Set(candidates.map((c) => c.primaryRole.slug));
    return Array.from(r).map((slug) => ({
      slug,
      name: candidates.find((c) => c.primaryRole.slug === slug)!.primaryRole.name,
    }));
  }, [candidates]);

  const getComposite = (c: CandidateRow) => {
    const score = c.assessment?.compositeScores.find(
      (cs) => cs.roleSlug === c.primaryRole.slug
    );
    return score?.percentile ?? 0;
  };

  const filtered = useMemo(() => {
    let result = [...candidates];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.firstName.toLowerCase().includes(q) ||
          c.lastName.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    if (statusFilter) {
      result = result.filter((c) => c.status === statusFilter);
    }

    if (roleFilter) {
      result = result.filter((c) => c.primaryRole.slug === roleFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`);
          break;
        case "status":
          cmp = a.status.localeCompare(b.status);
          break;
        case "role":
          cmp = a.primaryRole.name.localeCompare(b.primaryRole.name);
          break;
        case "score":
          cmp = getComposite(a) - getComposite(b);
          break;
        case "date":
          cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [candidates, search, statusFilter, roleFilter, sortField, sortDir]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDir("desc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === "asc" ? (
      <ChevronUp className="w-3 h-3" />
    ) : (
      <ChevronDown className="w-3 h-3" />
    );
  };

  return (
    <div className="bg-card border border-border">
      {/* Toolbar */}
      <div className="p-3 border-b border-border flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search candidates..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-8 text-xs"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 border border-border px-2 text-xs text-foreground bg-card"
          >
            <option value="">All Statuses</option>
            <option value="RECOMMENDED">Strong Fit</option>
            <option value="REVIEW_REQUIRED">Conditional Fit</option>
            <option value="DO_NOT_ADVANCE">Not a Direct Fit</option>
          </select>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-8 border border-border px-2 text-xs text-foreground bg-card"
          >
            <option value="">All Roles</option>
            {roles.map((r) => (
              <option key={r.slug} value={r.slug}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <button onClick={() => handleSort("name")} className="flex items-center gap-1 hover:text-foreground">
                  Candidate <SortIcon field="name" />
                </button>
              </th>
              <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <button onClick={() => handleSort("role")} className="flex items-center gap-1 hover:text-foreground">
                  Role <SortIcon field="role" />
                </button>
              </th>
              <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <button onClick={() => handleSort("score")} className="flex items-center gap-1 hover:text-foreground">
                  Composite <SortIcon field="score" />
                </button>
              </th>
              <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <button onClick={() => handleSort("status")} className="flex items-center gap-1 hover:text-foreground">
                  Status <SortIcon field="status" />
                </button>
              </th>
              <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Flags
              </th>
              <th className="text-left py-2.5 px-4 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                <button onClick={() => handleSort("date")} className="flex items-center gap-1 hover:text-foreground">
                  Assessed <SortIcon field="date" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((candidate) => {
              const composite = getComposite(candidate);
              const flagCount = candidate.assessment?.redFlags.length ?? 0;
              const hasCritical = candidate.assessment?.redFlags.some(f => f.severity === "CRITICAL");

              return (
                <tr
                  key={candidate.id}
                  className="border-b border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <td className="py-2.5 px-4">
                    <Link href={`/candidates/${candidate.id}`} className="flex items-center gap-3 group">
                      <InitialsBadge firstName={candidate.firstName} lastName={candidate.lastName} size="sm" />
                      <div>
                        <p className="text-xs font-medium text-foreground group-hover:text-naib-gold transition-colors">
                          {candidate.firstName} {candidate.lastName}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-mono">{candidate.email}</p>
                      </div>
                    </Link>
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-xs text-muted-foreground">{candidate.primaryRole.name}</span>
                  </td>
                  <td className="py-2.5 px-4 w-36">
                    <ScoreBar percentile={composite} />
                  </td>
                  <td className="py-2.5 px-4">
                    <StatusBadge status={candidate.status} size="sm" />
                  </td>
                  <td className="py-2.5 px-4">
                    {flagCount > 0 && (
                      <span className={`flex items-center gap-1 text-[10px] font-mono font-medium ${hasCritical ? "text-naib-red" : "text-naib-amber"}`}>
                        <AlertTriangle className="w-3 h-3" />
                        {flagCount}
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    <span className="text-[10px] text-muted-foreground font-mono">
                      {formatRelativeDate(new Date(candidate.createdAt))}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-xs">No candidates found matching your filters.</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
        <span>Showing {filtered.length} of {candidates.length} candidates</span>
      </div>
    </div>
  );
}
