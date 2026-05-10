import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

const MODEL = "claude-sonnet-4-6";

export interface ResumeMatchResult {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  summary: string;
}

/**
 * Strip markdown code fences and surrounding prose, leaving just JSON.
 * Models sometimes wrap output in ```json ... ``` despite instructions.
 */
function extractJSON(text: string): string {
  const trimmed = text.trim();

  // Try fenced block first (```json ... ``` or ``` ... ```)
  const fence = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (fence) return fence[1].trim();

  // Otherwise grab the first {...} block (handles leading/trailing prose)
  const obj = trimmed.match(/\{[\s\S]*\}/);
  if (obj) return obj[0];

  return trimmed;
}

export async function analyzeResumeMatch(
  resume: string,
  jobDescription: string
): Promise<ResumeMatchResult> {
  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are an expert career advisor and ATS specialist. Analyze how well this resume matches the given job description.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Respond with ONLY a valid JSON object in this exact shape (no markdown, no code fences, no prose before or after):
{
  "score": <integer 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>"],
  "summary": "<2-3 sentence summary of the match>"
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  try {
    return JSON.parse(extractJSON(text)) as ResumeMatchResult;
  } catch (err) {
    console.error("[analyzeResumeMatch] parse failed. Raw response:", text);
    throw new Error("Failed to parse AI response");
  }
}

export async function generateCoverLetter(
  resume: string,
  jobDescription: string,
  companyName: string,
  roleName: string,
  tone: "professional" | "conversational" | "enthusiastic" = "professional"
): Promise<string> {
  const toneInstructions = {
    professional:
      "Use a formal, polished tone appropriate for corporate environments.",
    conversational:
      "Use a warm, approachable tone while remaining professional. Show personality.",
    enthusiastic:
      "Use an energetic, passionate tone that conveys genuine excitement for the role.",
  };

  const message = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are an expert cover letter writer. Generate a compelling, tailored cover letter.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

COMPANY: ${companyName}
ROLE: ${roleName}
TONE: ${toneInstructions[tone]}

Write a cover letter that:
1. Opens with a compelling hook (not "I am writing to apply for...")
2. Connects specific resume experiences to job requirements
3. Shows knowledge or curiosity about the company
4. Highlights 2-3 most relevant achievements with quantifiable results
5. Closes with a confident call to action
6. Is between 300-400 words

Output ONLY the cover letter text, no headers or metadata.`,
      },
    ],
  });

  return message.content[0].type === "text"
    ? message.content[0].text
    : "Failed to generate cover letter. Please try again.";
}

export default anthropic;
