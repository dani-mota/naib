import { AnimatedGrid } from "@/components/auth/animated-grid";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-aci-navy flex items-center justify-center p-4 relative">
      <AnimatedGrid />
      {children}
    </div>
  );
}
