"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, Loader2, Building2, Plus } from "lucide-react";

interface AccessRequest {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
  requestedRole: string;
  status: string;
  rejectionReason?: string | null;
  createdAt: string;
}

interface Organization {
  id: string;
  name: string;
}

interface Props {
  initialRequests: AccessRequest[];
  organizations: Organization[];
}

const ROLE_LABELS: Record<string, string> = {
  RECRUITER_COORDINATOR: "Recruiter",
  RECRUITING_MANAGER: "Recruiting Manager",
  HIRING_MANAGER: "Hiring Manager",
  TA_LEADER: "TA Leader",
  ADMIN: "Admin",
};

const STATUS_TABS = ["PENDING", "APPROVED", "REJECTED"] as const;

export function AccessRequestsTable({ initialRequests, organizations }: Props) {
  const router = useRouter();
  const [requests, setRequests] = useState(initialRequests);
  const [activeTab, setActiveTab] = useState<string>("PENDING");
  const [approveDialog, setApproveDialog] = useState<AccessRequest | null>(null);
  const [rejectDialog, setRejectDialog] = useState<AccessRequest | null>(null);

  const filtered = requests.filter((r) => r.status === activeTab);
  const pendingCount = requests.filter((r) => r.status === "PENDING").length;

  return (
    <div>
      {/* Tabs */}
      <div className="flex gap-1 mb-4">
        {STATUS_TABS.map((tab) => {
          const count = requests.filter((r) => r.status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === tab
                  ? "bg-aci-gold/10 text-aci-gold border border-aci-gold/30"
                  : "text-muted-foreground border border-transparent hover:text-foreground"
              }`}
            >
              {tab.charAt(0) + tab.slice(1).toLowerCase()} ({count})
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="bg-card border border-border">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-2.5 px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Name</th>
              <th className="text-left py-2.5 px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Email</th>
              <th className="text-left py-2.5 px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Organization</th>
              <th className="text-left py-2.5 px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Role</th>
              <th className="text-left py-2.5 px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Submitted</th>
              {activeTab === "PENDING" && (
                <th className="text-right py-2.5 px-3 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-muted-foreground text-xs">
                  No {activeTab.toLowerCase()} requests
                </td>
              </tr>
            ) : (
              filtered.map((req) => (
                <tr key={req.id} className="border-b border-border last:border-0 hover:bg-accent/30">
                  <td className="py-2.5 px-3 font-medium text-foreground">
                    {req.firstName} {req.lastName}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">{req.email}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{req.companyName}</td>
                  <td className="py-2.5 px-3">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-aci-blue">
                      {ROLE_LABELS[req.requestedRole] || req.requestedRole}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                  {activeTab === "PENDING" && (
                    <td className="py-2.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          className="h-7 px-2.5 text-[10px] bg-aci-green hover:bg-aci-green/90 text-white"
                          onClick={() => setApproveDialog(req)}
                        >
                          <Check className="w-3 h-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-7 px-2.5 text-[10px] text-aci-red border-aci-red/30 hover:bg-aci-red/10"
                          onClick={() => setRejectDialog(req)}
                        >
                          <X className="w-3 h-3 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Approve Dialog */}
      {approveDialog && (
        <ApproveDialog
          request={approveDialog}
          organizations={organizations}
          onClose={() => setApproveDialog(null)}
          onApproved={(id) => {
            setRequests((prev) =>
              prev.map((r) => (r.id === id ? { ...r, status: "APPROVED" } : r))
            );
            setApproveDialog(null);
            router.refresh();
          }}
        />
      )}

      {/* Reject Dialog */}
      {rejectDialog && (
        <RejectDialog
          request={rejectDialog}
          onClose={() => setRejectDialog(null)}
          onRejected={(id) => {
            setRequests((prev) =>
              prev.map((r) => (r.id === id ? { ...r, status: "REJECTED" } : r))
            );
            setRejectDialog(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function ApproveDialog({
  request,
  organizations,
  onClose,
  onApproved,
}: {
  request: AccessRequest;
  organizations: Organization[];
  onClose: () => void;
  onApproved: (id: string) => void;
}) {
  const [orgMode, setOrgMode] = useState<"existing" | "new">(
    organizations.length > 0 ? "existing" : "new"
  );
  const [orgId, setOrgId] = useState(organizations[0]?.id || "");
  const [newOrgName, setNewOrgName] = useState(request.companyName);
  const [role, setRole] = useState(request.requestedRole);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleApprove() {
    setLoading(true);
    setError(null);

    const body: Record<string, string> = { action: "approve", role };
    if (orgMode === "existing") {
      body.orgId = orgId;
    } else {
      body.newOrgName = newOrgName;
    }

    const res = await fetch(`/api/access-requests/${request.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to approve");
      setLoading(false);
      return;
    }

    onApproved(request.id);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border p-6 w-full max-w-md shadow-xl">
        <h3
          className="text-sm font-bold text-foreground mb-1"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Approve Access Request
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {request.firstName} {request.lastName} ({request.email})
        </p>

        {error && (
          <div className="p-2 bg-aci-red/10 border border-aci-red/20 text-xs text-aci-red mb-4">
            {error}
          </div>
        )}

        {/* Organization */}
        <div className="mb-4">
          <label className="block text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
            Organization
          </label>
          <div className="flex gap-1.5 mb-2">
            <button
              onClick={() => setOrgMode("existing")}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] rounded border transition-colors ${
                orgMode === "existing"
                  ? "border-aci-gold bg-aci-gold/5 text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              <Building2 className="w-3 h-3" />
              Existing
            </button>
            <button
              onClick={() => setOrgMode("new")}
              className={`flex items-center gap-1 px-2.5 py-1 text-[10px] rounded border transition-colors ${
                orgMode === "new"
                  ? "border-aci-gold bg-aci-gold/5 text-foreground"
                  : "border-border text-muted-foreground"
              }`}
            >
              <Plus className="w-3 h-3" />
              Create New
            </button>
          </div>

          {orgMode === "existing" ? (
            <select
              value={orgId}
              onChange={(e) => setOrgId(e.target.value)}
              className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name}
                </option>
              ))}
            </select>
          ) : (
            <Input
              value={newOrgName}
              onChange={(e) => setNewOrgName(e.target.value)}
              placeholder="Organization name"
              className="text-xs"
            />
          )}
        </div>

        {/* Role */}
        <div className="mb-6">
          <label className="block text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
            Role
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full h-9 rounded-md border border-input bg-transparent px-3 text-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="RECRUITER_COORDINATOR">Recruiter</option>
            <option value="RECRUITING_MANAGER">Recruiting Manager</option>
            <option value="HIRING_MANAGER">Hiring Manager</option>
            <option value="TA_LEADER">TA Leader</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-aci-green hover:bg-aci-green/90 text-white"
            onClick={handleApprove}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Approving...
              </>
            ) : (
              <>
                <Check className="w-3 h-3 mr-1" />
                Approve
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function RejectDialog({
  request,
  onClose,
  onRejected,
}: {
  request: AccessRequest;
  onClose: () => void;
  onRejected: (id: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReject() {
    setLoading(true);

    const res = await fetch(`/api/access-requests/${request.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "reject",
        rejectionReason: reason.trim() || undefined,
      }),
    });

    if (res.ok) {
      onRejected(request.id);
    }
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border p-6 w-full max-w-md shadow-xl">
        <h3
          className="text-sm font-bold text-foreground mb-1"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Reject Access Request
        </h3>
        <p className="text-xs text-muted-foreground mb-4">
          {request.firstName} {request.lastName} ({request.email})
        </p>

        <div className="mb-6">
          <label className="block text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-2">
            Reason (optional)
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full bg-background border border-border rounded-md p-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-aci-gold resize-none"
            rows={3}
            placeholder="Provide a reason for rejection..."
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            size="sm"
            className="bg-aci-red hover:bg-aci-red/90 text-white"
            onClick={handleReject}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Rejecting...
              </>
            ) : (
              <>
                <X className="w-3 h-3 mr-1" />
                Reject
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
