"use client";

export function AnimatedGrid() {
  return (
    <div className="absolute inset-0 overflow-hidden opacity-20">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(rgba(197, 168, 76, 0.3) 1px, transparent 1px),
          linear-gradient(90deg, rgba(197, 168, 76, 0.3) 1px, transparent 1px)
        `,
        backgroundSize: "60px 60px",
        animation: "gridMove 20s linear infinite",
      }} />
      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
      `}</style>
      {/* Floating particles */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${4 + i * 2}px`,
            height: `${4 + i * 2}px`,
            background: "rgba(197, 168, 76, 0.4)",
            left: `${15 + i * 15}%`,
            top: `${20 + (i % 3) * 25}%`,
            animation: `float${i} ${8 + i * 2}s ease-in-out infinite`,
          }}
        />
      ))}
      <style jsx>{`
        @keyframes float0 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
        @keyframes float1 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-30px); } }
        @keyframes float2 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-15px); } }
        @keyframes float3 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-25px); } }
        @keyframes float4 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-18px); } }
        @keyframes float5 { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-22px); } }
      `}</style>
    </div>
  );
}
