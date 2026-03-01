import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { construct, prompt, candidateResponse } = body;

  if (!construct || !candidateResponse) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // For MVP, generate a contextual follow-up without Anthropic API
  // This will be replaced with actual Claude API calls when ANTHROPIC_API_KEY is configured
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (apiKey) {
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 150,
          messages: [
            {
              role: "user",
              content: `You are an assessment proctor. A candidate is being assessed on ${construct}.
The original question was: "${prompt}"
The candidate responded: "${candidateResponse}"

Generate ONE short, probing follow-up question (1-2 sentences) that digs deeper into their reasoning or tests the boundary of their understanding. Be professional and neutral. Only output the question, nothing else.`,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const followUp = data.content?.[0]?.text || generateFallbackFollowUp(construct);
        return NextResponse.json({ followUp });
      }
    } catch (err) {
      console.error("Anthropic API error:", err);
    }
  }

  // Fallback: generate a static follow-up
  return NextResponse.json({ followUp: generateFallbackFollowUp(construct) });
}

function generateFallbackFollowUp(construct: string): string {
  const followUps: Record<string, string[]> = {
    FLUID_REASONING: [
      "Can you walk me through the specific logic steps you used to arrive at that conclusion?",
      "How would your approach change if one of the key assumptions was different?",
    ],
    ETHICAL_JUDGMENT: [
      "What potential consequences did you consider when forming your response?",
      "How would you handle it if your supervisor disagreed with your decision?",
    ],
    SYSTEMS_DIAGNOSTICS: [
      "What data would you need to confirm your diagnosis before taking action?",
      "How would you prioritize if multiple root causes were identified simultaneously?",
    ],
    LEARNING_VELOCITY: [
      "What indicators do you use to assess whether you've truly mastered a new concept?",
      "How do you adapt your learning approach when initial methods aren't working?",
    ],
    DEFAULT: [
      "Can you elaborate on the reasoning behind your response?",
      "What alternative approaches did you consider before settling on this answer?",
    ],
  };

  const pool = followUps[construct] || followUps.DEFAULT;
  return pool[Math.floor(Math.random() * pool.length)];
}
