import type { AssessmentItem } from "./items";

interface ScoredItem {
  itemId: string;
  construct: string;
  rawScore: number; // 0-1
  responseTimeMs?: number;
}

/**
 * Score a single item response.
 * MC: 1 if correct, 0 if wrong
 * Likert: map to 0-1 scale (higher = better for positive constructs)
 * Open: provisional 0.5 (later scored by AI or rubric)
 * Timed: same as MC but penalize slow responses
 */
export function scoreItem(
  item: AssessmentItem,
  response: string,
  responseTimeMs?: number
): ScoredItem {
  let rawScore = 0;

  switch (item.itemType) {
    case "MULTIPLE_CHOICE": {
      rawScore = response === item.correctAnswer ? 1 : 0;
      break;
    }
    case "TIMED_SEQUENCE": {
      if (response === "TIME_EXPIRED") {
        rawScore = 0;
      } else if (response === item.correctAnswer) {
        // Full credit, with time bonus
        const timeLimit = (item.timeLimit || 60) * 1000;
        const timeFactor = responseTimeMs
          ? Math.max(0.8, 1 - (responseTimeMs / timeLimit) * 0.2)
          : 1;
        rawScore = timeFactor;
      }
      break;
    }
    case "LIKERT": {
      const options = item.options || [];
      const index = options.indexOf(response);
      if (index >= 0) {
        // "Strongly Agree" = high score for positive constructs
        rawScore = options.length > 1 ? index / (options.length - 1) : 0.5;
      }
      break;
    }
    case "OPEN_RESPONSE":
    case "AI_PROBE": {
      // Provisional scoring: length and substance heuristic
      const wordCount = response.split(/\s+/).length;
      if (wordCount >= 50) rawScore = 0.7;
      else if (wordCount >= 30) rawScore = 0.5;
      else rawScore = 0.3;
      break;
    }
  }

  return {
    itemId: item.id,
    construct: item.construct,
    rawScore,
    responseTimeMs,
  };
}
