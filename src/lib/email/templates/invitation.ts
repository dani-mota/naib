interface InvitationEmailParams {
  candidateName: string;
  roleName: string;
  companyName: string;
  assessmentLink: string;
  expiresAt: Date;
}

export function buildInvitationEmail({
  candidateName,
  roleName,
  companyName,
  assessmentLink,
  expiresAt,
}: InvitationEmailParams): { subject: string; html: string } {
  const expiryDate = expiresAt.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const subject = `${companyName} — Complete Your Assessment for ${roleName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f4f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border: 1px solid #e4e4e7;">
          <!-- Header -->
          <tr>
            <td style="background-color: #0a1628; padding: 24px 32px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <span style="color: #ffffff; font-size: 20px; font-weight: 700; letter-spacing: -0.5px;">ACI</span>
                    <span style="color: #71717a; font-size: 10px; text-transform: uppercase; letter-spacing: 2px; margin-left: 8px;">Assessment Platform</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <h1 style="margin: 0 0 8px; font-size: 18px; color: #0a1628; font-weight: 700;">
                Hello ${candidateName},
              </h1>
              <p style="margin: 0 0 24px; font-size: 14px; color: #52525b; line-height: 1.6;">
                You have been invited by <strong>${companyName}</strong> to complete a cognitive and technical assessment for the <strong>${roleName}</strong> position.
              </p>

              <!-- Assessment Info -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border: 1px solid #e4e4e7; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1.5px; padding-bottom: 4px;">Role</td>
                        <td style="font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1.5px; padding-bottom: 4px;">Duration</td>
                        <td style="font-size: 10px; color: #71717a; text-transform: uppercase; letter-spacing: 1.5px; padding-bottom: 4px;">Expires</td>
                      </tr>
                      <tr>
                        <td style="font-size: 13px; color: #0a1628; font-weight: 600;">${roleName}</td>
                        <td style="font-size: 13px; color: #0a1628; font-weight: 600;">~45 min</td>
                        <td style="font-size: 13px; color: #0a1628; font-weight: 600;">${expiryDate}</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 8px; font-size: 12px; color: #52525b; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                What to expect:
              </p>
              <ul style="margin: 0 0 24px; padding-left: 16px; font-size: 13px; color: #52525b; line-height: 1.8;">
                <li>6 assessment blocks covering cognitive, technical, and behavioral dimensions</li>
                <li>A mix of multiple-choice, timed, and open-ended questions</li>
                <li>AI-adaptive follow-up probes based on your responses</li>
                <li>No preparation needed — the assessment measures natural aptitude</li>
              </ul>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="padding: 8px 0 24px;">
                    <a href="${assessmentLink}" style="display: inline-block; background-color: #c9a227; color: #0a1628; font-size: 14px; font-weight: 700; text-decoration: none; padding: 12px 32px; text-transform: uppercase; letter-spacing: 1px;">
                      Begin Assessment
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin: 0; font-size: 11px; color: #a1a1aa; line-height: 1.6;">
                This link expires on ${expiryDate}. If you have questions, please contact the recruiting team at ${companyName}.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #e4e4e7; padding: 16px 32px;">
              <p style="margin: 0; font-size: 10px; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1px;">
                Arklight Cognitive Index &bull; Powered by ACI
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, html };
}
