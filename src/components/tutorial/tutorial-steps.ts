export interface TutorialStep {
  target: string; // data-tutorial attribute value
  title: string;
  description: string;
  page: string; // route under /tutorial
  position?: "top" | "bottom" | "left" | "right";
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    target: "dashboard-quick-stats",
    title: "Performance Snapshot",
    description:
      "These cards show your assessment pipeline at a glance — total candidates assessed, strong-fit rate, average composite score, and assessments pending review.",
    page: "/tutorial/dashboard",
    position: "bottom",
  },
  {
    target: "attention-items",
    title: "Items Needing Attention",
    description:
      "Candidates requiring action surface here automatically — those awaiting a hiring decision, flagged for review, or recently completed.",
    page: "/tutorial/dashboard",
    position: "bottom",
  },
  {
    target: "candidate-table",
    title: "Candidate Pipeline",
    description:
      "Your full candidate list with search, status filters, and sortable columns. Click any row to view their detailed assessment profile.",
    page: "/tutorial/dashboard",
    position: "top",
  },
  {
    target: "profile-header",
    title: "Candidate Profile",
    description:
      "Each candidate has a comprehensive profile showing their identity, role fit, assessment status, and key decision indicators.",
    page: "/tutorial/candidates",
    position: "bottom",
  },
  {
    target: "profile-spider-chart",
    title: "Cognitive & Behavioral Map",
    description:
      "The radar chart visualizes scores across all 12 constructs — cognitive core, technical aptitude, and behavioral integrity — against role benchmarks.",
    page: "/tutorial/candidates",
    position: "left",
  },
  {
    target: "profile-pdf-export",
    title: "Export Reports",
    description:
      "Generate three PDF report types: the full Assessment Report, a one-page Hiring Manager Summary, or a structured Interview Kit with probing questions.",
    page: "/tutorial/candidates",
    position: "right",
  },
  {
    target: "compare-chart",
    title: "Side-by-Side Comparison",
    description:
      "Compare up to 4 candidates on the same role. The overlay chart reveals relative strengths and gaps across every measured construct.",
    page: "/tutorial/compare",
    position: "bottom",
  },
  {
    target: "heatmap-table",
    title: "Roles Heatmap",
    description:
      "The color-coded matrix shows every candidate's fit across all roles at once. Spot patterns, identify versatile candidates, and find the best role matches.",
    page: "/tutorial/roles",
    position: "top",
  },
  {
    target: "heatmap-cell",
    title: "Reading the Heatmap",
    description:
      "Each cell's color indicates fit strength — from green (strong) through yellow (average) to red (concern). Click any cell for construct-level detail.",
    page: "/tutorial/roles",
    position: "top",
  },
  {
    target: "tutorial-complete",
    title: "You're Ready!",
    description:
      "That's the full ACI platform. When you're ready, switch to your live dashboard and invite your first candidate.",
    page: "/tutorial/roles",
    position: "bottom",
  },
];
