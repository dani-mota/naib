import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sendEmail } from "@/lib/email/resend";
import { buildInvitationEmail } from "@/lib/email/templates/invitation";
import { parseCsv, validateCsvRows } from "@/lib/csv-templates";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { csvContent } = body;

  if (!csvContent) {
    return NextResponse.json({ error: "CSV content is required" }, { status: 400 });
  }

  // Get valid roles for the org
  const roles = await prisma.role.findMany({
    where: { orgId: session.user.orgId! },
    include: { org: true },
  });
  const roleMap = new Map(roles.map((r) => [r.slug, r]));
  const validSlugs = roles.map((r) => r.slug);

  // Parse and validate
  const { rows } = parseCsv(csvContent);
  const validated = validateCsvRows(rows, validSlugs);

  const errors = validated.filter((r) => r.errors.length > 0);
  if (errors.length > 0) {
    return NextResponse.json(
      { error: "Validation errors", rows: validated },
      { status: 400 }
    );
  }

  // Create candidates and invitations in transaction
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  const results = await prisma.$transaction(async (tx) => {
    const created = [];

    for (const row of validated) {
      const role = roleMap.get(row.role_slug)!;

      const candidate = await tx.candidate.create({
        data: {
          firstName: row.first_name,
          lastName: row.last_name,
          email: row.email,
          phone: row.phone || null,
          orgId: session.user.orgId!,
          primaryRoleId: role.id,
          status: "INVITED",
        },
      });

      const invitation = await tx.assessmentInvitation.create({
        data: {
          candidateId: candidate.id,
          roleId: role.id,
          invitedBy: session.user.id,
          expiresAt,
        },
      });

      created.push({ candidate, invitation, role });
    }

    return created;
  });

  // Send emails (non-blocking — don't fail the batch if some emails fail)
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://aci-rho.vercel.app";
  const emailResults = await Promise.allSettled(
    results.map(async ({ candidate, invitation, role }) => {
      const assessmentLink = `${baseUrl}/assess/${invitation.linkToken}`;
      const { subject, html } = buildInvitationEmail({
        candidateName: candidate.firstName,
        roleName: role.name,
        companyName: role.org.name,
        assessmentLink,
        expiresAt,
      });

      await sendEmail({ to: candidate.email, subject, html });
      await prisma.assessmentInvitation.update({
        where: { id: invitation.id },
        data: { emailSentAt: new Date() },
      });
    })
  );

  const sent = emailResults.filter((r) => r.status === "fulfilled").length;
  const failed = emailResults.filter((r) => r.status === "rejected").length;

  return NextResponse.json({
    total: results.length,
    emailsSent: sent,
    emailsFailed: failed,
    candidates: results.map((r) => r.candidate),
  });
}
