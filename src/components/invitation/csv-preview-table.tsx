"use client";

import type { ValidatedRow } from "@/lib/csv-templates";

interface CsvPreviewTableProps {
  rows: ValidatedRow[];
}

export function CsvPreviewTable({ rows }: CsvPreviewTableProps) {
  const hasErrors = rows.some((r) => r.errors.length > 0);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
          Preview ({rows.length} candidates)
        </p>
        {hasErrors && (
          <span className="text-[10px] font-medium text-aci-red uppercase tracking-wider">
            {rows.filter((r) => r.errors.length > 0).length} rows with errors
          </span>
        )}
      </div>

      <div className="border border-border overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-accent/30">
              <th className="text-left py-2 px-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Row</th>
              <th className="text-left py-2 px-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Name</th>
              <th className="text-left py-2 px-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Email</th>
              <th className="text-left py-2 px-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="text-left py-2 px-3 text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const hasErr = row.errors.length > 0;
              return (
                <tr
                  key={row.rowIndex}
                  className={`border-b border-border/50 ${hasErr ? "bg-aci-red/5" : ""}`}
                >
                  <td className="py-2 px-3 text-[10px] text-muted-foreground font-mono">{row.rowIndex}</td>
                  <td className="py-2 px-3 text-xs text-foreground">
                    {row.first_name} {row.last_name}
                  </td>
                  <td className="py-2 px-3 text-xs text-muted-foreground font-mono">{row.email}</td>
                  <td className="py-2 px-3 text-xs text-muted-foreground">{row.role_slug}</td>
                  <td className="py-2 px-3">
                    {hasErr ? (
                      <div className="space-y-0.5">
                        {row.errors.map((err, i) => (
                          <p key={i} className="text-[10px] text-aci-red">{err}</p>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[10px] text-aci-green font-medium">Valid</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
