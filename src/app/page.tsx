"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) router.replace("/dashboard");
  }, [session, router]);

  if (status === "loading" || session) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-line border-t-ink" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 pb-32">
      {/* ── HERO ── */}
      <section className="pt-20 sm:pt-28 pb-20 sm:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-6">Job search, intelligent</p>
          <h1 className="display-1 text-ink mb-7">
            A calmer way to land<br />your next role.
          </h1>
          <p className="text-[18px] sm:text-[19px] leading-[1.55] text-ink-soft max-w-xl mx-auto mb-10">
            Track every application in one tidy place. Score your resume against
            any job in seconds. Generate cover letters that actually sound like
            you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Get started — it's free
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                />
              </svg>
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center rounded-full border border-line bg-surface px-7 py-3.5 text-[15px] font-medium text-ink-soft transition-colors hover:border-line-strong hover:text-ink"
            >
              See how it works
            </a>
          </div>
        </div>
      </section>

      {/* ── FEATURE GRID ── */}
      <section id="features" className="border-t border-line pt-20 sm:pt-24">
        <div className="mb-14 max-w-2xl">
          <p className="eyebrow mb-4">What's inside</p>
          <h2 className="display-2 text-ink">
            Three tools, one quiet workspace.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              kicker: "01",
              title: "Application tracker",
              description:
                "From saved to offer — keep every detail, status, and salary in one place. Search and filter the way you'd expect.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              ),
            },
            {
              kicker: "02",
              title: "Resume match",
              description:
                "Paste a job description and get a fit score with the strengths to lead with and the gaps worth closing.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              ),
            },
            {
              kicker: "03",
              title: "Cover letters",
              description:
                "A draft worth editing — not a Mad Libs template. Tone-aware, grounded in your resume and the role.",
              icon: (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
                />
              ),
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-line bg-surface p-7 transition-all duration-200 hover:border-line-strong hover:bg-surface-2/30"
            >
              <div className="flex items-start justify-between mb-7">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 text-ink">
                  <svg
                    className="h-[18px] w-[18px]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.6}
                  >
                    {f.icon}
                  </svg>
                </div>
                <span className="font-mono text-[11px] tracking-wider text-ink-faint">
                  {f.kicker}
                </span>
              </div>
              <h3 className="text-[17px] font-semibold text-ink tracking-tight mb-2">
                {f.title}
              </h3>
              <p className="text-[14px] leading-[1.65] text-ink-mute">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CLOSING CTA ── */}
      <section className="border-t border-line mt-20 sm:mt-24 pt-20 sm:pt-24 text-center">
        <h2 className="display-2 text-ink mb-5">
          Ready when you are.
        </h2>
        <p className="text-[16px] text-ink-mute mb-10 max-w-md mx-auto">
          Sign in with GitHub or Google. Your data stays yours.
        </p>
        <Link
          href="/signin"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-7 py-3.5 text-[15px] font-medium text-white transition-opacity hover:opacity-90"
        >
          Get started
        </Link>
      </section>
    </div>
  );
}
