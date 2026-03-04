import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { analyzeResumeMatch } from "@/lib/anthropic";
import { resumeMatchSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = resumeMatchSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { resume, jobDescription } = parsed.data;
    const result = await analyzeResumeMatch(resume, jobDescription);

    return NextResponse.json(result);
  } catch (error) {
    console.error("POST /api/ai/resume-match error:", error);
    return NextResponse.json(
      { error: "Failed to analyze resume match. Please try again." },
      { status: 500 }
    );
  }
}
