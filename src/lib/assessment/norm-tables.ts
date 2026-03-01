/**
 * Percentile lookup tables per construct.
 * For the validation study, we use a simple linear mapping.
 * These will be replaced with IRT-based tables after norming.
 *
 * rawScore is 0-1 (proportion correct / average Likert score)
 * Returns percentile 1-99
 */

// Default mapping: simple sigmoid-like curve centered at 0.5
function defaultMapping(rawScore: number): number {
  // Map 0-1 raw score to 1-99 percentile using a logistic curve
  const k = 6; // steepness
  const midpoint = 0.5;
  const logistic = 1 / (1 + Math.exp(-k * (rawScore - midpoint)));
  return Math.max(1, Math.min(99, Math.round(logistic * 98 + 1)));
}

// Per-construct adjustments (difficulty calibration)
const DIFFICULTY_OFFSETS: Record<string, number> = {
  FLUID_REASONING: -0.05,        // harder items
  EXECUTIVE_CONTROL: 0,
  COGNITIVE_FLEXIBILITY: 0.05,   // open-response items scored generously
  METACOGNITIVE_CALIBRATION: 0,
  LEARNING_VELOCITY: 0,
  SYSTEMS_DIAGNOSTICS: -0.05,
  PATTERN_RECOGNITION: 0,
  QUANTITATIVE_REASONING: -0.05,
  SPATIAL_VISUALIZATION: 0,
  MECHANICAL_REASONING: 0,
  PROCEDURAL_RELIABILITY: 0.1,   // Likert items tend toward positive
  ETHICAL_JUDGMENT: 0.05,
};

export function rawScoreToPercentile(construct: string, rawScore: number): number {
  const offset = DIFFICULTY_OFFSETS[construct] || 0;
  const adjusted = Math.max(0, Math.min(1, rawScore - offset));
  return defaultMapping(adjusted);
}
