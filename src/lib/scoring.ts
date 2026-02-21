interface SubtestScore {
  construct: string;
  layer: string;
  percentile: number;
}

interface Weight {
  constructId: string;
  weight: number;
}

interface CutlineData {
  technicalAptitude: number;
  behavioralIntegrity: number;
  learningVelocity: number;
}

interface RedFlagData {
  severity: string;
}

export function calculateComposite(
  subtestResults: SubtestScore[],
  weights: Weight[]
): number {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const weight of weights) {
    const result = subtestResults.find(r => r.construct === weight.constructId);
    if (result) {
      weightedSum += result.percentile * weight.weight;
      totalWeight += weight.weight;
    }
  }

  return totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;
}

export function avgPercentile(
  subtestResults: SubtestScore[],
  layer: string
): number {
  const layerResults = subtestResults.filter(r => r.layer === layer);
  if (layerResults.length === 0) return 0;
  const sum = layerResults.reduce((acc, r) => acc + r.percentile, 0);
  return Math.round(sum / layerResults.length);
}

export function evaluateCutline(
  subtestResults: SubtestScore[],
  cutline: CutlineData
): { passed: boolean; distance: number } {
  const techAvg = avgPercentile(subtestResults, "TECHNICAL_APTITUDE");
  const behAvg = avgPercentile(subtestResults, "BEHAVIORAL_INTEGRITY");
  const lv = subtestResults.find(r => r.construct === "LEARNING_VELOCITY")?.percentile ?? 0;

  const passed =
    techAvg >= cutline.technicalAptitude &&
    behAvg >= cutline.behavioralIntegrity &&
    lv >= cutline.learningVelocity;

  const distance = Math.min(
    techAvg - cutline.technicalAptitude,
    behAvg - cutline.behavioralIntegrity,
    lv - cutline.learningVelocity
  );

  return { passed, distance };
}

export function determineStatus(
  passed: boolean,
  distance: number,
  redFlags: RedFlagData[]
): string {
  const hasCriticalFlag = redFlags.some(f => f.severity === "CRITICAL");
  const hasWarningFlag = redFlags.some(f => f.severity === "WARNING");

  if (hasCriticalFlag) return "DO_NOT_ADVANCE";
  if (!passed) return distance >= -5 ? "REVIEW_REQUIRED" : "DO_NOT_ADVANCE";
  if (hasWarningFlag) return "REVIEW_REQUIRED";
  return "RECOMMENDED";
}
