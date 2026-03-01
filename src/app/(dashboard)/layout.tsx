import { redirect } from "next/navigation";
import { TopNav } from "@/components/nav/top-nav";
import { AuthProvider } from "@/components/auth-provider";
import { BasePathProvider } from "@/components/base-path-provider";
import { getSession, getAuthStatus } from "@/lib/auth";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { status } = await getAuthStatus();

  if (status === "unauthenticated") redirect("/login");
  if (status === "pending" || status === "rejected") redirect("/pending");

  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <AuthProvider user={session.user}>
      <BasePathProvider basePath="">
        <div className="min-h-screen bg-background">
          <TopNav />
          <main className="max-w-[1600px] mx-auto">
            {children}
          </main>
        </div>
      </BasePathProvider>
    </AuthProvider>
  );
}
