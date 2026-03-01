import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email/resend";
import { buildAccessApprovedEmail } from "@/lib/email/templates/access-approved";
import { buildAccessRejectedEmail } from "@/lib/email/templates/access-rejected";

/**
 * PATCH /api/access-requests/[id]
 * Admin-only: approve or reject an access request.
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { action } = body;

  const accessRequest = await prisma.accessRequest.findUnique({ where: { id } });
  if (!accessRequest) {
    return NextResponse.json({ error: "Request not found" }, { status: 404 });
  }

  if (accessRequest.status !== "PENDING") {
    return NextResponse.json({ error: "Request already processed" }, { status: 409 });
  }

  if (action === "approve") {
    const { orgId, newOrgName, role } = body;

    if (!role) {
      return NextResponse.json({ error: "Role is required" }, { status: 400 });
    }
    if (!orgId && !newOrgName) {
      return NextResponse.json({ error: "Organization is required" }, { status: 400 });
    }

    // Transaction: create org (if new) → create user → update request
    const result = await prisma.$transaction(async (tx) => {
      let assignedOrgId = orgId;

      if (!orgId && newOrgName) {
        const newOrg = await tx.organization.create({
          data: { name: newOrgName },
        });
        assignedOrgId = newOrg.id;
      }

      const user = await tx.user.create({
        data: {
          supabaseId: accessRequest.supabaseId,
          email: accessRequest.email,
          name: `${accessRequest.firstName} ${accessRequest.lastName}`,
          role: role as any,
          orgId: assignedOrgId,
        },
      });

      await tx.accessRequest.update({
        where: { id },
        data: {
          status: "APPROVED",
          reviewedBy: session.user.id,
          reviewedAt: new Date(),
        },
      });

      return { user, orgId: assignedOrgId };
    });

    // Send approval email
    try {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aci-rho.vercel.app";
      const { subject, html } = buildAccessApprovedEmail({
        userName: accessRequest.firstName,
        loginUrl: `${appUrl}/login`,
      });
      await sendEmail({ to: accessRequest.email, subject, html });
    } catch {
      // Email failure shouldn't block approval
    }

    return NextResponse.json({ success: true, userId: result.user.id });
  }

  if (action === "reject") {
    const { rejectionReason } = body;

    await prisma.accessRequest.update({
      where: { id },
      data: {
        status: "REJECTED",
        reviewedBy: session.user.id,
        reviewedAt: new Date(),
        rejectionReason: rejectionReason || null,
      },
    });

    // Send rejection email
    try {
      const { subject, html } = buildAccessRejectedEmail({
        userName: accessRequest.firstName,
        rejectionReason,
      });
      await sendEmail({ to: accessRequest.email, subject, html });
    } catch {
      // Email failure shouldn't block rejection
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
