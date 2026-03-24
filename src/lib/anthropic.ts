import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function analyzeResumeMatch(
  resume: string,
  jobDescription: string
): Promise<{
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  summary: string;
}> {
  const message = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `You are an expert career advisor and ATS specialist. Analyze how well this resume matches the given job description.

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "score": <number 0-100>,
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "gaps": ["<gap 1>", "<gap 2>"],
  "suggestions": ["<actionable suggestion 1>", "<actionable suggestion 2>", "<actionable suggestion 3>"],
  "summary": "<2-3 sentence summary of the match analysis>"
}`,
      },
    ],
  });

  const text =
    message.content[0].type === "text" ? message.content[0].text : "";

  try {
    return JSON.parse(text);
  } catch {
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
    model: "claude-sonnet-4-20250514",
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
3. Shows knowledge/enthusiasm for the company
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
