import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateCoverLetter } from "@/lib/anthropic";
import { coverLetterSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = coverLetterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { resume, jobDescription, companyName, roleName, tone } =
      parsed.data;

    const coverLetter = await generateCoverLetter(
      resume,
      jobDescription,
      companyName,
      roleName,
      tone
    );

    return NextResponse.json({ coverLetter });
  } catch (error) {
    console.error("POST /api/ai/cover-letter error:", error);
    return NextResponse.json(
      { error: "Failed to generate cover letter. Please try again." },
      { status: 500 }
    );
  }
}
