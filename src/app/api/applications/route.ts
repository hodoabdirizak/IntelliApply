import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { applicationSchema, applicationUpdateSchema } from "@/lib/validations";

async function getUser() {
  const session = await auth();
  return session?.user?.id ?? null;
}

function nullIfEmpty(val: string | number | undefined | null) {
  return val || null;
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (id) {
      const application = await prisma.application.findFirst({
        where: { id, userId },
      });
      if (!application) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }
      return NextResponse.json(application);
    }

    const status = searchParams.get("status");
    const where: Record<string, unknown> = { userId };
    if (status && status !== "ALL") where.status = status;

    const applications = await prisma.application.findMany({
      where,
      orderBy: { appliedAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (err) {
    console.error("[GET /api/applications]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = applicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { url, salaryMin, salaryMax, location, notes, ...rest } = parsed.data;
    const application = await prisma.application.create({
      data: {
        ...rest,
        url: nullIfEmpty(url),
        salaryMin: nullIfEmpty(salaryMin),
        salaryMax: nullIfEmpty(salaryMax),
        location: nullIfEmpty(location),
        notes: nullIfEmpty(notes),
        userId,
      },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (err) {
    console.error("[POST /api/applications]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const existing = await prisma.application.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = applicationUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { url, salaryMin, salaryMax, location, notes, ...rest } = parsed.data;
    const application = await prisma.application.update({
      where: { id },
      data: {
        ...rest,
        url: nullIfEmpty(url),
        salaryMin: nullIfEmpty(salaryMin),
        salaryMax: nullIfEmpty(salaryMax),
        location: nullIfEmpty(location),
        notes: nullIfEmpty(notes),
      },
    });

    return NextResponse.json(application);
  } catch (err) {
    console.error("[PUT /api/applications]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUser();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const existing = await prisma.application.findFirst({
      where: { id, userId },
    });
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await prisma.application.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[DELETE /api/applications]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
