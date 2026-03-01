export type ItemType = "MULTIPLE_CHOICE" | "LIKERT" | "OPEN_RESPONSE" | "AI_PROBE" | "TIMED_SEQUENCE";

export interface AssessmentItem {
  id: string;
  construct: string;
  blockIndex: number;
  itemType: ItemType;
  prompt: string;
  options?: string[];
  correctAnswer?: string;
  timeLimit?: number; // seconds
  difficulty: number; // 1-5
}

/**
 * Item bank for the MVP assessment.
 * Items are defined in code (not database) for rapid iteration during validation study.
 * Each block has 4-6 items covering the assigned constructs.
 */
export const ITEM_BANK: AssessmentItem[] = [
  // ── Block 0: Reasoning & Executive Control ──
  {
    id: "fr-001", construct: "FLUID_REASONING", blockIndex: 0, itemType: "MULTIPLE_CHOICE", difficulty: 3,
    prompt: "If all Zephyrs are Quills, and some Quills are Prisms, which statement must be true?",
    options: ["All Zephyrs are Prisms", "Some Zephyrs may be Prisms", "No Zephyrs are Prisms", "All Prisms are Zephyrs"],
    correctAnswer: "Some Zephyrs may be Prisms",
  },
  {
    id: "fr-002", construct: "FLUID_REASONING", blockIndex: 0, itemType: "MULTIPLE_CHOICE", difficulty: 4,
    prompt: "A factory produces 120 units in 8 hours with 5 machines. If 2 machines break down, how many hours are needed to produce 120 units?",
    options: ["13.3 hours", "12 hours", "20 hours", "10 hours"],
    correctAnswer: "13.3 hours",
  },
  {
    id: "ec-001", construct: "EXECUTIVE_CONTROL", blockIndex: 0, itemType: "TIMED_SEQUENCE", difficulty: 3, timeLimit: 60,
    prompt: "Memorize this sequence, then recall it in reverse order: 7 — 3 — 9 — 1 — 5 — 8",
    options: ["8-5-1-9-3-7", "7-3-9-1-5-8", "8-5-9-1-3-7", "7-8-5-1-9-3"],
    correctAnswer: "8-5-1-9-3-7",
  },
  {
    id: "ec-002", construct: "EXECUTIVE_CONTROL", blockIndex: 0, itemType: "MULTIPLE_CHOICE", difficulty: 3,
    prompt: "You are running three concurrent tasks: Task A (urgent, 20 min), Task B (important, 45 min), Task C (routine, 10 min). A colleague interrupts asking for help on Task D (15 min). What is the optimal approach?",
    options: ["Complete Task A, help colleague, then B and C", "Help colleague immediately since they asked first", "Finish all your tasks first, then help", "Delegate Task C and help colleague now"],
    correctAnswer: "Complete Task A, help colleague, then B and C",
  },
  {
    id: "cf-001", construct: "COGNITIVE_FLEXIBILITY", blockIndex: 0, itemType: "OPEN_RESPONSE", difficulty: 4,
    prompt: "A manufacturing process that has worked for 5 years suddenly produces 15% defective output. Your initial investigation ruled out material quality and machine calibration. What alternative factors would you investigate, and why?",
  },

  // ── Block 1: Technical Aptitude ──
  {
    id: "qr-001", construct: "QUANTITATIVE_REASONING", blockIndex: 1, itemType: "MULTIPLE_CHOICE", difficulty: 3,
    prompt: "A part requires a tolerance of ±0.005 inches. If the nominal dimension is 2.500 inches, what is the acceptable range?",
    options: ["2.495 to 2.505", "2.490 to 2.510", "2.500 to 2.505", "2.495 to 2.500"],
    correctAnswer: "2.495 to 2.505",
  },
  {
    id: "qr-002", construct: "QUANTITATIVE_REASONING", blockIndex: 1, itemType: "MULTIPLE_CHOICE", difficulty: 4,
    prompt: "A CNC mill operates at 3,500 RPM with a 4-flute end mill, feed rate 0.003 inches per tooth. What is the table feed rate in inches per minute?",
    options: ["42 IPM", "10.5 IPM", "14 IPM", "52.5 IPM"],
    correctAnswer: "42 IPM",
  },
  {
    id: "sv-001", construct: "SPATIAL_VISUALIZATION", blockIndex: 1, itemType: "TIMED_SEQUENCE", difficulty: 3, timeLimit: 45,
    prompt: "A cube is painted red on all faces, then cut into 27 equal smaller cubes. How many smaller cubes have exactly two painted faces?",
    options: ["8", "12", "6", "4"],
    correctAnswer: "12",
  },
  {
    id: "sv-002", construct: "SPATIAL_VISUALIZATION", blockIndex: 1, itemType: "MULTIPLE_CHOICE", difficulty: 3,
    prompt: "When a flat cross-shaped pattern is folded into a cube, which face is opposite the face marked X?",
    options: ["The face two positions away in the cross", "The adjacent face", "The bottom face", "It depends on fold direction"],
    correctAnswer: "The face two positions away in the cross",
  },
  {
    id: "mr-001", construct: "MECHANICAL_REASONING", blockIndex: 1, itemType: "MULTIPLE_CHOICE", difficulty: 3,
    prompt: "In a gear train, Gear A (20 teeth) drives Gear B (60 teeth). If Gear A rotates at 900 RPM clockwise, what is Gear B's speed and direction?",
    options: ["300 RPM counter-clockwise", "300 RPM clockwise", "2700 RPM counter-clockwise", "2700 RPM clockwise"],
    correctAnswer: "300 RPM counter-clockwise",
  },

  // ── Block 2: Processing & Diagnostics ──
  {
    id: "sd-001", construct: "SYSTEMS_DIAGNOSTICS", blockIndex: 2, itemType: "MULTIPLE_CHOICE", difficulty: 4,
    prompt: "A production line shows: Station 1 (OK) → Station 2 (OK) → Station 3 (intermittent fails) → Station 4 (OK) → Station 5 (consistent fails). Where should you look first?",
    options: ["Station 3 — intermittent failures indicate developing problems", "Station 5 — it has consistent failures", "Between Stations 2 and 3 — the transition point", "Station 1 — start from the beginning"],
    correctAnswer: "Station 3 — intermittent failures indicate developing problems",
  },
  {
    id: "sd-002", construct: "SYSTEMS_DIAGNOSTICS", blockIndex: 2, itemType: "OPEN_RESPONSE", difficulty: 4,
    prompt: "A hydraulic press cycles 200 times per shift. Lately, pressure drops 5 PSI every 50 cycles but recovers after a 10-minute idle. What is your diagnosis and proposed corrective action?",
  },
  {
    id: "pr-001", construct: "PATTERN_RECOGNITION", blockIndex: 2, itemType: "TIMED_SEQUENCE", difficulty: 3, timeLimit: 30,
    prompt: "Find the next number in the sequence: 2, 6, 14, 30, 62, __",
    options: ["126", "124", "94", "130"],
    correctAnswer: "126",
  },
  {
    id: "pr-002", construct: "PATTERN_RECOGNITION", blockIndex: 2, itemType: "MULTIPLE_CHOICE", difficulty: 3,
    prompt: "Defect data from 5 shifts: Mon (3), Tue (1), Wed (5), Thu (2), Fri (8). Which pattern is most likely?",
    options: ["Increasing fatigue through the week", "Random variation within normal limits", "Equipment degradation with partial recovery", "Operator skill variation between shifts"],
    correctAnswer: "Increasing fatigue through the week",
  },

  // ── Block 3: Judgment & Integrity ──
  {
    id: "prr-001", construct: "PROCEDURAL_RELIABILITY", blockIndex: 3, itemType: "LIKERT", difficulty: 2,
    prompt: "When I notice a minor deviation from standard procedure that doesn't seem to affect quality, I report it anyway.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: "prr-002", construct: "PROCEDURAL_RELIABILITY", blockIndex: 3, itemType: "MULTIPLE_CHOICE", difficulty: 3,
    prompt: "You discover that a batch of parts passed inspection but you noticed a minor surface scratch on 3 of 50 pieces. The scratches are cosmetic and within spec. What do you do?",
    options: ["Document the observation and inform the lead", "Re-inspect the entire batch to the higher standard", "Let it pass since it meets spec", "Separate the 3 pieces and continue"],
    correctAnswer: "Document the observation and inform the lead",
  },
  {
    id: "ej-001", construct: "ETHICAL_JUDGMENT", blockIndex: 3, itemType: "MULTIPLE_CHOICE", difficulty: 4,
    prompt: "A senior colleague asks you to sign off on a quality report for parts you didn't personally inspect. They say 'everyone does it when we're behind schedule.' What do you do?",
    options: ["Refuse and explain you can only sign for work you verified", "Sign it since a senior colleague vouches for quality", "Ask to quickly verify a sample before signing", "Report the request to management immediately"],
    correctAnswer: "Refuse and explain you can only sign for work you verified",
  },
  {
    id: "ej-002", construct: "ETHICAL_JUDGMENT", blockIndex: 3, itemType: "OPEN_RESPONSE", difficulty: 4,
    prompt: "You discover that your company's production process, while legal, creates more waste than necessary due to outdated equipment. A $50K upgrade would reduce waste by 60% but management says the budget is frozen. What steps would you take?",
  },

  // ── Block 4: Learning & Adaptation ──
  {
    id: "lv-001", construct: "LEARNING_VELOCITY", blockIndex: 4, itemType: "MULTIPLE_CHOICE", difficulty: 3,
    prompt: "You are introduced to a new CNC control system you've never used. The manual is 200 pages. What is your first step?",
    options: ["Run through the tutorial program to get hands-on experience", "Read the manual cover to cover before touching the machine", "Ask a colleague to show you the basics, then explore", "Watch online videos about the system"],
    correctAnswer: "Run through the tutorial program to get hands-on experience",
  },
  {
    id: "lv-002", construct: "LEARNING_VELOCITY", blockIndex: 4, itemType: "OPEN_RESPONSE", difficulty: 4,
    prompt: "Describe a time you had to learn a completely new skill or process quickly. What strategies did you use, and how did you know when you were proficient?",
  },
  {
    id: "mc-001", construct: "METACOGNITIVE_CALIBRATION", blockIndex: 4, itemType: "LIKERT", difficulty: 2,
    prompt: "Before answering a difficult question, I usually have a good sense of whether I'll get it right.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: "mc-002", construct: "METACOGNITIVE_CALIBRATION", blockIndex: 4, itemType: "MULTIPLE_CHOICE", difficulty: 3,
    prompt: "You've been asked to estimate how long a repair will take. Based on experience with similar repairs, what approach yields the most accurate estimate?",
    options: ["Break the job into sub-tasks and estimate each separately", "Use the time from the last similar repair", "Double your gut estimate to build in buffer", "Ask three colleagues and average their estimates"],
    correctAnswer: "Break the job into sub-tasks and estimate each separately",
  },

  // ── Block 5: Calibration & Integration ──
  {
    id: "int-001", construct: "METACOGNITIVE_CALIBRATION", blockIndex: 5, itemType: "LIKERT", difficulty: 2,
    prompt: "After completing a task, I actively reflect on what went well and what I would do differently.",
    options: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  },
  {
    id: "int-002", construct: "FLUID_REASONING", blockIndex: 5, itemType: "MULTIPLE_CHOICE", difficulty: 4,
    prompt: "A factory must decide between Machine A ($100K, 500 units/day, 2% defect rate) and Machine B ($150K, 600 units/day, 0.5% defect rate). Each defect costs $20 to fix. Over 250 working days, which machine is more cost-effective?",
    options: ["Machine B saves $47,500 over Machine A", "Machine A saves $50,000 over Machine B", "They cost the same over the period", "Machine B saves $25,000 over Machine A"],
    correctAnswer: "Machine B saves $47,500 over Machine A",
  },
  {
    id: "int-003", construct: "ETHICAL_JUDGMENT", blockIndex: 5, itemType: "OPEN_RESPONSE", difficulty: 4,
    prompt: "You are the shift lead. One team member consistently produces excellent work but frequently arrives 10-15 minutes late. Another team member is always on time but makes occasional errors. How do you handle both situations to maintain team morale and standards?",
  },
  {
    id: "int-004", construct: "FLUID_REASONING", blockIndex: 5, itemType: "TIMED_SEQUENCE", difficulty: 5, timeLimit: 90,
    prompt: "Three machines (X, Y, Z) produce widgets. X makes 40% of output with 3% defect rate. Y makes 35% with 5% defect rate. Z makes 25% with 2% defect rate. If a randomly selected widget is defective, what is the probability it came from Machine Y?",
    options: ["52.4%", "35%", "50%", "47.6%"],
    correctAnswer: "52.4%",
  },
];
