import { TopNav } from "@/components/nav/top-nav";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopNav />
      <main className="max-w-[1600px] mx-auto">
        {children}
      </main>
    </div>
  );
}
