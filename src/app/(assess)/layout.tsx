export default function AssessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="h-12 bg-card border-b border-border flex items-center px-6">
        <span className="text-lg font-bold tracking-tight text-foreground" style={{ fontFamily: "var(--font-dm-sans)" }}>
          ACI
        </span>
        <div className="h-4 w-px bg-border mx-2.5" />
        <span className="text-[10px] tracking-[0.2em] text-muted-foreground uppercase">
          Assessment
        </span>
      </header>
      <main>{children}</main>
    </div>
  );
}
