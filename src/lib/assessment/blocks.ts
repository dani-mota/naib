export interface BlockDefinition {
  index: number;
  name: string;
  description: string;
  constructs: string[];
  estimatedMinutes: number;
}

export const ASSESSMENT_BLOCKS: BlockDefinition[] = [
  {
    index: 0,
    name: "Reasoning & Executive Control",
    description: "Pattern recognition, logical reasoning, and working memory tasks.",
    constructs: ["FLUID_REASONING", "EXECUTIVE_CONTROL", "COGNITIVE_FLEXIBILITY"],
    estimatedMinutes: 8,
  },
  {
    index: 1,
    name: "Technical Aptitude",
    description: "Quantitative reasoning, spatial visualization, and mechanical principles.",
    constructs: ["QUANTITATIVE_REASONING", "SPATIAL_VISUALIZATION", "MECHANICAL_REASONING"],
    estimatedMinutes: 8,
  },
  {
    index: 2,
    name: "Processing & Diagnostics",
    description: "Systems thinking, pattern detection, and diagnostic reasoning.",
    constructs: ["SYSTEMS_DIAGNOSTICS", "PATTERN_RECOGNITION"],
    estimatedMinutes: 7,
  },
  {
    index: 3,
    name: "Judgment & Integrity",
    description: "Ethical judgment, procedural reliability, and workplace scenarios.",
    constructs: ["PROCEDURAL_RELIABILITY", "ETHICAL_JUDGMENT"],
    estimatedMinutes: 7,
  },
  {
    index: 4,
    name: "Learning & Adaptation",
    description: "Learning velocity, metacognitive calibration, and novel problem solving.",
    constructs: ["LEARNING_VELOCITY", "METACOGNITIVE_CALIBRATION"],
    estimatedMinutes: 8,
  },
  {
    index: 5,
    name: "Calibration & Integration",
    description: "Cross-domain integration tasks and self-assessment calibration.",
    constructs: ["METACOGNITIVE_CALIBRATION", "FLUID_REASONING", "ETHICAL_JUDGMENT"],
    estimatedMinutes: 7,
  },
];
