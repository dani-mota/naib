import { AlertTriangle } from "lucide-react";

interface ExpiredScreenProps {
  companyName: string;
}

export function ExpiredScreen({ companyName }: ExpiredScreenProps) {
  return (
    <div className="max-w-lg mx-auto mt-24 px-6">
      <div className="bg-card border border-border p-8 text-center">
        <div className="w-12 h-12 bg-aci-amber/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertTriangle className="w-6 h-6 text-aci-amber" />
        </div>
        <h1
          className="text-lg font-bold text-foreground mb-2"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Link Expired
        </h1>
        <p className="text-xs text-muted-foreground mb-4">
          This assessment invitation has expired. Please contact the recruiting team at{" "}
          <span className="font-medium text-foreground">{companyName}</span>{" "}
          to request a new invitation.
        </p>
        <p className="text-[10px] text-muted-foreground">
          If you believe this is an error, reach out to the person who sent you the original invitation.
        </p>
      </div>
    </div>
  );
}
