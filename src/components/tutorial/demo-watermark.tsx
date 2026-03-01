"use client";

export function DemoWatermark() {
  return (
    <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden select-none" aria-hidden="true">
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: "rotate(-30deg) scale(2)",
        }}
      >
        <span className="text-[120px] font-bold text-foreground/[0.03] tracking-[0.3em] whitespace-nowrap" style={{ fontFamily: "var(--font-dm-sans)" }}>
          DEMO
        </span>
      </div>
    </div>
  );
}
