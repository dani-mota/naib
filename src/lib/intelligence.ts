interface SubtestScore {
  construct: string;
  percentile: number;
}

interface IntelligencePanel {
  title: string;
  icon: string;
  narrative: string;
  keyPoints: string[];
}

function getLevel(percentile: number): "high" | "mid" | "low" {
  if (percentile >= 75) return "high";
  if (percentile >= 40) return "mid";
  return "low";
}

function getScore(results: SubtestScore[], construct: string): number {
  return results.find(r => r.construct === construct)?.percentile ?? 50;
}

export function generateWorkStyle(results: SubtestScore[]): IntelligencePanel {
  const ec = getScore(results, "EXECUTIVE_CONTROL");
  const prl = getScore(results, "PROCEDURAL_RELIABILITY");
  const cf = getScore(results, "COGNITIVE_FLEXIBILITY");

  const ecLevel = getLevel(ec);
  const prlLevel = getLevel(prl);

  const narratives: Record<string, string> = {
    "high-high": `This individual combines exceptional focus (${ec}th percentile Executive Control) with strong procedural adherence (${prl}th percentile). They thrive in structured environments where consistency and precision matter. Expect them to follow SOPs reliably while maintaining quality under production pressure.`,
    "high-mid": `Strong focus and attention control (${ec}th percentile) paired with moderate procedural consistency (${prl}th percentile). They perform well under structured conditions but may occasionally take shortcuts when confident. Best paired with clear expectations and periodic process audits.`,
    "high-low": `Highly focused (${ec}th percentile) but independent-minded about procedures (${prl}th percentile). This profile often signals a creative problem-solver who resists rigid structure. Consider roles where judgment matters more than checklist compliance.`,
    "mid-high": `Moderate attention control (${ec}th percentile) but strong procedural discipline (${prl}th percentile). They compensate for average focus with systematic work habits. Reliable in routine operations but may struggle when managing multiple complex tasks simultaneously.`,
    "mid-mid": `Average profile across focus and procedural dimensions. This is the most common pattern and typically adequate for standard production roles. Development should target the specific construct where improvement would yield the most operational value.`,
    "mid-low": `Moderate focus (${ec}th percentile) combined with low procedural reliability (${prl}th percentile). This candidate may need closer supervision initially and structured onboarding to build work habits. Monitor for quality consistency during the first 90 days.`,
    "low-high": `Lower attention control (${ec}th percentile) but compensates with strong procedural habits (${prl}th percentile). They rely on checklists and routines to maintain quality. Effective in repetitive roles but may struggle when unexpected problems break their routine.`,
    "low-mid": `Below-average focus (${ec}th percentile) and moderate procedural adherence (${prl}th percentile). Higher supervision recommended during initial ramp period. Consider whether the role demands sustained concentration or allows task-switching breaks.`,
    "low-low": `Both focus (${ec}th percentile) and procedural reliability (${prl}th percentile) are areas of concern. This profile carries elevated risk for quality escapes and requires structured supervision. Not recommended for roles requiring independent quality judgment.`,
  };

  const key = `${ecLevel}-${prlLevel}`;
  const keyPoints: string[] = [];
  if (ec >= 75) keyPoints.push("Strong sustained attention under pressure");
  if (ec < 40) keyPoints.push("May need environment with fewer distractions");
  if (prl >= 75) keyPoints.push("Naturally follows established procedures");
  if (prl < 40) keyPoints.push("Tends to improvise rather than follow SOPs");
  if (cf >= 75) keyPoints.push("Adapts quickly when plans change");
  if (cf < 40) keyPoints.push("Prefers predictable, routine work");

  return {
    title: "Work Style & Consistency",
    icon: "clipboard-check",
    narrative: narratives[key] || narratives["mid-mid"],
    keyPoints: keyPoints.length > 0 ? keyPoints : ["Average work style profile — no extreme patterns detected"],
  };
}

export function generateLeadership(results: SubtestScore[]): IntelligencePanel {
  const mc = getScore(results, "METACOGNITIVE_CALIBRATION");
  const ej = getScore(results, "ETHICAL_JUDGMENT");
  const fr = getScore(results, "FLUID_REASONING");

  const keyPoints: string[] = [];
  let narrative: string;

  if (mc >= 75 && ej >= 75) {
    narrative = `Exceptional self-awareness (${mc}th percentile) combined with strong ethical judgment (${ej}th percentile) creates a foundation for trusted leadership. This individual knows what they don't know and makes principled decisions under pressure. They're likely to earn peer respect quickly and can be trusted to escalate problems rather than hide them.`;
    keyPoints.push("High potential for team lead or mentor role");
    keyPoints.push("Trusted to make independent quality decisions");
  } else if (mc >= 75 && ej < 40) {
    narrative = `High self-awareness (${mc}th percentile) but lower ethical judgment scores (${ej}th percentile) suggest someone who recognizes when they're unsure but may not always make the right call under pressure. They may benefit from structured decision frameworks and clear escalation paths.`;
    keyPoints.push("Provides honest self-assessments");
    keyPoints.push("May need clearer ethical guidelines for edge cases");
  } else if (mc < 40 && ej >= 75) {
    narrative = `Strong ethical instincts (${ej}th percentile) but limited self-awareness (${mc}th percentile). This person does the right thing but may overestimate their own capabilities. They need feedback mechanisms to calibrate their confidence with their actual skill level.`;
    keyPoints.push("Reliable for ethical decisions");
    keyPoints.push("May need help recognizing knowledge gaps");
  } else if (mc < 40 && ej < 40) {
    narrative = `Both metacognitive calibration (${mc}th percentile) and ethical judgment (${ej}th percentile) are below average. This combination elevates risk — the individual may not recognize their limitations AND may not make the right call when it matters. Close supervision and structured decision-making protocols are recommended.`;
    keyPoints.push("Elevated risk for unsupervised decision-making");
    keyPoints.push("Needs structured supervision and clear protocols");
  } else {
    narrative = `Moderate leadership indicators with metacognitive calibration at the ${mc}th percentile and ethical judgment at the ${ej}th percentile. This profile doesn't raise concerns but doesn't signal exceptional leadership potential either. With mentoring and experience, leadership capacity can develop.`;
    keyPoints.push("Adequate for current role responsibilities");
    if (fr >= 75) keyPoints.push("Strong reasoning ability supports growth into leadership");
  }

  if (fr >= 75 && mc >= 60) keyPoints.push("Problem-solving ability suggests long-term leadership trajectory");

  return {
    title: "Leadership & Decision-Making",
    icon: "compass",
    narrative,
    keyPoints: keyPoints.length > 0 ? keyPoints : ["Standard leadership profile"],
  };
}

export function generatePractical(results: SubtestScore[]): IntelligencePanel {
  const sd = getScore(results, "SYSTEMS_DIAGNOSTICS");
  const mr = getScore(results, "MECHANICAL_REASONING");
  const sv = getScore(results, "SPATIAL_VISUALIZATION");
  const qr = getScore(results, "QUANTITATIVE_REASONING");

  const keyPoints: string[] = [];
  const strengths: string[] = [];
  const gaps: string[] = [];

  if (sd >= 75) strengths.push("systems thinking");
  if (mr >= 75) strengths.push("mechanical intuition");
  if (sv >= 75) strengths.push("spatial reasoning");
  if (qr >= 75) strengths.push("quantitative skills");

  if (sd < 40) gaps.push("systems diagnostics");
  if (mr < 40) gaps.push("mechanical reasoning");
  if (sv < 40) gaps.push("spatial visualization");
  if (qr < 40) gaps.push("quantitative reasoning");

  let narrative: string;
  if (strengths.length >= 3) {
    narrative = `Broad technical strength across ${strengths.join(", ")}. This candidate has the cognitive toolkit for complex technical roles. They can visualize problems, work with numbers, and understand how systems interact — a rare combination that predicts rapid mastery of advanced manufacturing processes.`;
    keyPoints.push("Candidate for accelerated technical development");
    keyPoints.push(`Strongest area: ${strengths[0]}`);
  } else if (strengths.length >= 1 && gaps.length === 0) {
    narrative = `Solid technical foundation with particular strength in ${strengths.join(" and ")}. No significant gaps across technical aptitude constructs. This profile supports reliable performance in most manufacturing roles with appropriate training.`;
    keyPoints.push(`Leverage strength in ${strengths[0]}`);
    keyPoints.push("Well-rounded technical capabilities");
  } else if (gaps.length >= 2) {
    narrative = `Technical aptitude shows gaps in ${gaps.join(" and ")}. ${strengths.length > 0 ? `Strength in ${strengths.join(", ")} partially compensates, but ` : ""}these gaps may limit effectiveness in roles requiring broad technical reasoning. Consider whether the specific role demands these capabilities or can work around them.`;
    keyPoints.push(`Development needed: ${gaps.join(", ")}`);
    if (strengths.length > 0) keyPoints.push(`Can leverage: ${strengths.join(", ")}`);
  } else {
    narrative = `Average technical aptitude profile. Systems diagnostics at ${sd}th, mechanical reasoning at ${mr}th, spatial at ${sv}th, quantitative at ${qr}th percentile. This profile is typical and adequate for standard manufacturing roles. Target training at the lowest-scoring construct for maximum improvement.`;
    keyPoints.push("Standard technical profile — no extreme strengths or gaps");
  }

  return {
    title: "Practical & Technical Ability",
    icon: "wrench",
    narrative,
    keyPoints: keyPoints.length > 0 ? keyPoints : ["Average technical aptitude"],
  };
}

export function generateTeamDynamics(results: SubtestScore[]): IntelligencePanel {
  const ej = getScore(results, "ETHICAL_JUDGMENT");
  const prl = getScore(results, "PROCEDURAL_RELIABILITY");
  const cf = getScore(results, "COGNITIVE_FLEXIBILITY");
  const mc = getScore(results, "METACOGNITIVE_CALIBRATION");

  const keyPoints: string[] = [];
  let narrative: string;

  const teamScore = Math.round((ej + prl + cf + mc) / 4);

  if (teamScore >= 70) {
    narrative = `Strong team contributor profile. High ethical judgment (${ej}th) means they'll speak up about problems. ${cf >= 70 ? "Cognitive flexibility allows them to adapt to different teammates' approaches." : ""} ${mc >= 70 ? "Good self-awareness means they'll ask for help when needed rather than causing delays." : ""} This person is likely to earn trust quickly and contribute positively to team culture.`;
    keyPoints.push("Positive influence on team culture");
    keyPoints.push("Likely to build trust quickly with peers");
  } else if (teamScore >= 45) {
    narrative = `Average team dynamics profile. No significant concerns but no standout strengths either. They'll integrate into most teams without friction. ${ej < 50 ? "Monitor for tendency to go along with group rather than raising concerns." : ""} ${cf < 50 ? "May need time to adapt to new team configurations." : ""}`;
    keyPoints.push("Standard team integration expected");
    if (prl >= 60) keyPoints.push("Procedural reliability supports consistent team contribution");
  } else {
    narrative = `Below-average team integration indicators. ${ej < 40 ? `Ethical judgment at ${ej}th percentile raises concerns about willingness to flag problems to teammates.` : ""} ${mc < 40 ? `Low metacognitive calibration (${mc}th) may lead to overcommitting or under-communicating difficulties.` : ""} Structured team integration with clear role definitions recommended.`;
    keyPoints.push("May need structured team onboarding");
    keyPoints.push("Clear role boundaries will help integration");
  }

  return {
    title: "Team Dynamics & Culture Fit",
    icon: "users",
    narrative,
    keyPoints: keyPoints.length > 0 ? keyPoints : ["Standard team profile"],
  };
}

export function generateSelfAwareness(results: SubtestScore[]): IntelligencePanel {
  const mc = getScore(results, "METACOGNITIVE_CALIBRATION");
  const lv = getScore(results, "LEARNING_VELOCITY");

  const keyPoints: string[] = [];
  let narrative: string;

  if (mc >= 75) {
    narrative = `Exceptional metacognitive calibration (${mc}th percentile) — this candidate accurately assesses what they know and don't know. ${lv >= 70 ? `Combined with high learning velocity (${lv}th), they identify gaps quickly and fill them efficiently. This is the ideal trainee profile.` : `Even with moderate learning speed (${lv}th), their self-awareness means they seek help at the right moments, preventing costly mistakes during ramp-up.`}`;
    keyPoints.push("Accurately judges own capability boundaries");
    keyPoints.push("Will ask for help rather than guess");
  } else if (mc >= 50) {
    narrative = `Moderate self-awareness (${mc}th percentile). They generally know when they're in over their head but may occasionally overestimate confidence in familiar-seeming situations. ${lv >= 70 ? "High learning velocity helps compensate — they course-correct quickly when wrong." : "Standard onboarding checkpoints should catch any calibration gaps."}`;
    keyPoints.push("Generally reliable self-assessment");
    if (mc < 60) keyPoints.push("Occasional overconfidence in familiar domains");
  } else {
    narrative = `Low metacognitive calibration (${mc}th percentile) is a notable concern. This candidate may not recognize when they're making errors or operating beyond their competence. ${lv >= 70 ? "Their fast learning partially compensates, but the gap between confidence and capability could lead to quality issues." : "Combined with moderate learning speed, this profile requires structured verification checkpoints."} Consider additional oversight during critical operations.`;
    keyPoints.push("Risk of not recognizing own errors");
    keyPoints.push("Structured verification checkpoints recommended");
  }

  return {
    title: "Self-Awareness & Growth Potential",
    icon: "lightbulb",
    narrative,
    keyPoints: keyPoints.length > 0 ? keyPoints : ["Standard self-awareness profile"],
  };
}

export function generateOnboarding(results: SubtestScore[], roleName?: string): IntelligencePanel {
  const lv = getScore(results, "LEARNING_VELOCITY");
  const ec = getScore(results, "EXECUTIVE_CONTROL");
  const prl = getScore(results, "PROCEDURAL_RELIABILITY");
  const sd = getScore(results, "SYSTEMS_DIAGNOSTICS");

  const keyPoints: string[] = [];
  let narrative: string;

  const rampWeeks = lv >= 80 ? "2-3" : lv >= 60 ? "4-6" : lv >= 40 ? "6-10" : "10-14";

  if (lv >= 75) {
    narrative = `Fast learner (${lv}th percentile Learning Velocity). Estimated productive ramp: ${rampWeeks} weeks${roleName ? ` for ${roleName}` : ""}. ${ec >= 70 ? "Strong focus means they'll absorb training efficiently without constant redirection." : "Training should be structured with clear milestones — fast learners can lose focus without clear targets."} ${sd >= 70 ? "Systems thinking ability means they'll understand the 'why' behind procedures, not just the 'how.'" : ""}`;
    keyPoints.push(`Estimated ramp: ${rampWeeks} weeks`);
    keyPoints.push("Can handle accelerated training schedule");
    if (prl >= 60) keyPoints.push("Will adopt new procedures reliably");
  } else if (lv >= 45) {
    narrative = `Average learning velocity (${lv}th percentile). Estimated productive ramp: ${rampWeeks} weeks${roleName ? ` for ${roleName}` : ""}. Standard onboarding timeline applies. ${prl >= 70 ? "Strong procedural reliability means they'll master standard operations reliably once trained." : "Build in extra practice repetitions for critical procedures."}`;
    keyPoints.push(`Estimated ramp: ${rampWeeks} weeks`);
    keyPoints.push("Standard onboarding timeline");
  } else {
    narrative = `Below-average learning velocity (${lv}th percentile). Estimated productive ramp: ${rampWeeks} weeks${roleName ? ` for ${roleName}` : ""}. Extended onboarding with additional mentoring recommended. ${prl >= 60 ? "Positive: once they learn a procedure, they follow it consistently." : "Extra attention needed — slow learning combined with inconsistent procedure-following requires patient, structured training."} Consider pairing with an experienced mentor for the first ${rampWeeks} weeks.`;
    keyPoints.push(`Estimated ramp: ${rampWeeks} weeks (extended)`);
    keyPoints.push("Pair with experienced mentor");
    keyPoints.push("Build in extra repetition and check-ins");
  }

  return {
    title: "Onboarding & Ramp Prediction",
    icon: "rocket",
    narrative,
    keyPoints: keyPoints.length > 0 ? keyPoints : ["Standard onboarding expectations"],
  };
}

export function generateAllPanels(results: SubtestScore[], roleName?: string): IntelligencePanel[] {
  return [
    generateWorkStyle(results),
    generateLeadership(results),
    generatePractical(results),
    generateTeamDynamics(results),
    generateSelfAwareness(results),
    generateOnboarding(results, roleName),
  ];
}
