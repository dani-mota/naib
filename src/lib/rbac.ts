// RBAC roles aligned with Prisma UserRole enum and PRD Section 7.1
export type AppUserRole = "RECRUITER_COORDINATOR" | "RECRUITING_MANAGER" | "HIRING_MANAGER" | "TA_LEADER" | "ADMIN";

export interface FieldAccess {
  // Universal (all roles)
  candidateStatus: boolean;
  contactInfo: boolean;
  compositeScores: boolean;
  interviewGuide: boolean;
  developmentPlan: boolean;
  predictions: boolean;
  // Recruiting Manager+
  redFlags: boolean;
  intelligenceReport: boolean;
  // Hiring Manager+
  subtestDetail: boolean;
  questionLevel: boolean;
  aiTranscripts: boolean;
  peerComparison: boolean;
  // TA Leader / Admin only
  rawIrt: boolean;
  validityMetrics: boolean;
  auditTrail: boolean;
  // Operational permissions
  notes: boolean;
  pdfExport: boolean;
  bulkActions: boolean;
}

const ACCESS_MAP: Record<AppUserRole, FieldAccess> = {
  RECRUITER_COORDINATOR: {
    candidateStatus: true,
    contactInfo: true,
    compositeScores: true,
    interviewGuide: true,
    developmentPlan: true,
    predictions: true,
    redFlags: false,
    intelligenceReport: false,
    subtestDetail: false,
    questionLevel: false,
    aiTranscripts: false,
    peerComparison: false,
    rawIrt: false,
    validityMetrics: false,
    auditTrail: false,
    notes: true,
    pdfExport: false,
    bulkActions: true,
  },
  RECRUITING_MANAGER: {
    candidateStatus: true,
    contactInfo: true,
    compositeScores: true,
    interviewGuide: true,
    developmentPlan: true,
    predictions: true,
    redFlags: true,
    intelligenceReport: true,
    subtestDetail: false,
    questionLevel: false,
    aiTranscripts: false,
    peerComparison: false,
    rawIrt: false,
    validityMetrics: false,
    auditTrail: false,
    notes: true,
    pdfExport: true,
    bulkActions: true,
  },
  HIRING_MANAGER: {
    candidateStatus: true,
    contactInfo: true,
    compositeScores: true,
    interviewGuide: true,
    developmentPlan: true,
    predictions: true,
    redFlags: true,
    intelligenceReport: true,
    subtestDetail: true,
    questionLevel: true,
    aiTranscripts: true,
    peerComparison: true,
    rawIrt: false,
    validityMetrics: false,
    auditTrail: false,
    notes: true,
    pdfExport: true,
    bulkActions: false,
  },
  TA_LEADER: {
    candidateStatus: true,
    contactInfo: true,
    compositeScores: true,
    interviewGuide: true,
    developmentPlan: true,
    predictions: true,
    redFlags: true,
    intelligenceReport: true,
    subtestDetail: true,
    questionLevel: true,
    aiTranscripts: true,
    peerComparison: true,
    rawIrt: true,
    validityMetrics: true,
    auditTrail: true,
    notes: true,
    pdfExport: true,
    bulkActions: true,
  },
  ADMIN: {
    candidateStatus: true,
    contactInfo: true,
    compositeScores: true,
    interviewGuide: true,
    developmentPlan: true,
    predictions: true,
    redFlags: true,
    intelligenceReport: true,
    subtestDetail: true,
    questionLevel: true,
    aiTranscripts: true,
    peerComparison: true,
    rawIrt: true,
    validityMetrics: true,
    auditTrail: true,
    notes: true,
    pdfExport: true,
    bulkActions: true,
  },
};

export function canView(userRole: AppUserRole, field: keyof FieldAccess): boolean {
  return ACCESS_MAP[userRole]?.[field] ?? false;
}

export function getAccessibleFields(userRole: AppUserRole): FieldAccess {
  return ACCESS_MAP[userRole];
}

export function getMockSession() {
  return {
    user: {
      id: "mock-user-1",
      email: "alex.chen@arklight.io",
      name: "Alex Chen",
      role: "TA_LEADER" as AppUserRole,
      organizationId: "mock-org-1",
    },
  };
}
