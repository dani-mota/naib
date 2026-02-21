export type AppUserRole = "TA_LEADER" | "HIRING_MANAGER" | "PLANT_OPS" | "RECRUITER" | "EXECUTIVE";

interface FieldAccess {
  compositeScores: boolean;
  subtestDetail: boolean;
  aiTranscripts: boolean;
  redFlags: boolean;
  intelligenceReport: boolean;
  predictions: boolean;
  interviewGuide: boolean;
  developmentPlan: boolean;
  notes: boolean;
  pdfExport: boolean;
  bulkActions: boolean;
  candidateStatus: boolean;
}

const ACCESS_MAP: Record<AppUserRole, FieldAccess> = {
  TA_LEADER: {
    compositeScores: true,
    subtestDetail: true,
    aiTranscripts: true,
    redFlags: true,
    intelligenceReport: true,
    predictions: true,
    interviewGuide: true,
    developmentPlan: true,
    notes: true,
    pdfExport: true,
    bulkActions: true,
    candidateStatus: true,
  },
  HIRING_MANAGER: {
    compositeScores: true,
    subtestDetail: true,
    aiTranscripts: false,
    redFlags: true,
    intelligenceReport: true,
    predictions: true,
    interviewGuide: true,
    developmentPlan: true,
    notes: true,
    pdfExport: true,
    bulkActions: false,
    candidateStatus: false,
  },
  PLANT_OPS: {
    compositeScores: true,
    subtestDetail: false,
    aiTranscripts: false,
    redFlags: true,
    intelligenceReport: false,
    predictions: true,
    interviewGuide: false,
    developmentPlan: false,
    notes: false,
    pdfExport: false,
    bulkActions: false,
    candidateStatus: false,
  },
  RECRUITER: {
    compositeScores: true,
    subtestDetail: false,
    aiTranscripts: false,
    redFlags: false,
    intelligenceReport: false,
    predictions: false,
    interviewGuide: false,
    developmentPlan: false,
    notes: true,
    pdfExport: false,
    bulkActions: true,
    candidateStatus: true,
  },
  EXECUTIVE: {
    compositeScores: true,
    subtestDetail: false,
    aiTranscripts: false,
    redFlags: false,
    intelligenceReport: false,
    predictions: false,
    interviewGuide: false,
    developmentPlan: false,
    notes: false,
    pdfExport: false,
    bulkActions: false,
    candidateStatus: false,
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
      email: "alex.chen@naib.io",
      name: "Alex Chen",
      role: "TA_LEADER" as AppUserRole,
      organizationId: "mock-org-1",
    },
  };
}
