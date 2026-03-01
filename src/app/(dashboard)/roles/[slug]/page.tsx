import { getRoleDetailData } from "@/lib/data";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";
import { RoleDetailClient } from "@/components/roles/role-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RoleDetailPage({ params }: PageProps) {
  const session = await getSession();
  const orgId = session?.user.orgId ?? undefined;
  const { slug } = await params;
  const data = await getRoleDetailData(slug, orgId);

  if (!data) notFound();

  return <RoleDetailClient {...data} />;
}
