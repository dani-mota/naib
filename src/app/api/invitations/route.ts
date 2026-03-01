import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email/resend";
import { buildInvitationEmail } from "@/lib/email/templates/invitation";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { firstName, lastName, email, phone, roleId } = body;

  if (!firstName || !lastName || !email || !roleId) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const role = await prisma.role.findUnique({
    where: { id: roleId },
    include: { org: true },
  });

  if (!role || role.orgId !== session.user.orgId) {
    return NextResponse.json({ error: "Role not found" }, { status: 404 });
  }

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const result = await prisma.$transaction(async (tx) => {
    const candidate = await tx.candidate.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || null,
        orgId: session.user.orgId!,
        primaryRoleId: roleId,
        status: "INVITED",
      },
    });

    const invitation = await tx.assessmentInvitation.create({
      data: {
        candidateId: candidate.id,
        roleId,
        invitedBy: session.user.id,
        expiresAt,
      },
    });

    return { candidate, invitation };
  });

  // Send invitation email
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aci-rho.vercel.app";
  const assessmentLink = `${baseUrl}/assess/${result.invitation.linkToken}`;

  const { subject, html } = buildInvitationEmail({
    candidateName: firstName,
    roleName: role.name,
    companyName: role.org.name,
    assessmentLink,
    expiresAt,
  });

  try {
    await sendEmail({ to: email, subject, html });
    await prisma.assessmentInvitation.update({
      where: { id: result.invitation.id },
      data: { emailSentAt: new Date() },
    });
  } catch (err) {
    console.error("Failed to send invitation email:", err);
    // Don't fail the request — invitation is created, email can be resent
  }

  return NextResponse.json({
    candidate: result.candidate,
    invitation: result.invitation,
  });
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invitations = await prisma.assessmentInvitation.findMany({
    where: {
      candidate: { orgId: session.user.orgId! },
    },
    include: {
      candidate: true,
      role: true,
      inviter: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(invitations);
}
