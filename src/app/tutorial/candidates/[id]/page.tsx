import { getCandidateData, getDemoOrgId } from "@/lib/data";
import { notFound, redirect } from "next/navigation";
import { ProfileClient } from "@/components/profile/profile-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TutorialCandidateProfilePage({ params }: PageProps) {
  const demoOrgId = await getDemoOrgId();
  if (!demoOrgId) redirect("/login");

  const { id } = await params;
  const data = await getCandidateData(id, demoOrgId);

  if (!data) notFound();

  return <ProfileClient {...data} />;
}
