import { getRoleDetailData, getDemoOrgId } from "@/lib/data";
import { notFound, redirect } from "next/navigation";
import { RoleDetailClient } from "@/components/roles/role-detail-client";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function TutorialRoleDetailPage({ params }: PageProps) {
  const demoOrgId = await getDemoOrgId();
  if (!demoOrgId) redirect("/login");

  const { slug } = await params;
  const data = await getRoleDetailData(slug, demoOrgId);

  if (!data) notFound();

  return <RoleDetailClient {...data} />;
}
