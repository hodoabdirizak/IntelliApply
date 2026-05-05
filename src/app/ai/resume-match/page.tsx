"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import type { ResumeMatchResult } from "@/types";

export default function ResumeMatchPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ResumeMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (resume.length < 50 || jobDescription.length < 50) {
      setError("Both fields need at least 50 characters.");
      return;
    }

    setIsLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/ai/resume-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDescription }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Analysis failed");
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to analyze. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const scoreColor = (score: number) => {
    if (score >= 80) return "#10B981";
    if (score >= 60) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
      {/* Header */}
      <div>
        <p className="eyebrow mb-3">Resume match</p>
        <h1 className="display-2 text-ink">How well do you fit?</h1>
        <p className="text-[15px] text-ink-mute mt-3 max-w-xl">
          Paste your resume and a job description. We'll score the fit and
          show you what to lead with — and what's missing.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <Textarea
            label="Your resume"
            placeholder="Paste resume content…"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={14}
          />
          <p className="text-[11.5px] text-ink-mute mt-2 tabular-nums">
            {resume.length} characters
            {resume.length < 50 && resume.length > 0 ? " — minimum 50" : ""}
          </p>
        </div>

        <div>
          <Textarea
            label="Job description"
            placeholder="Paste the job description…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={14}
          />
          <p className="text-[11.5px] text-ink-mute mt-2 tabular-nums">
            {jobDescription.length} characters
            {jobDescription.length < 50 && jobDescription.length > 0
              ? " — minimum 50"
              : ""}
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-danger-50 border border-danger-500/30 px-4 py-3 text-[13.5px] text-danger-700 font-medium">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleAnalyze}
          isLoading={isLoading}
          disabled={resume.length < 50 || jobDescription.length < 50}
        >
          {isLoading ? "Analyzing…" : "Analyze fit"}
        </Button>
      </div>

      {/* Result */}
      {result && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Score */}
          <div className="rounded-3xl border border-line bg-surface px-8 py-12 text-center">
            <div className="inline-flex items-center justify-center mb-6">
              <div className="relative h-36 w-36">
                <svg className="h-36 w-36 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke="#E8E8E5"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="52"
                    fill="none"
                    stroke={scoreColor(result.score)}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.score / 100) * 326.7} 326.7`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-[44px] font-semibold tabular-nums tracking-[-0.04em]"
                    style={{ color: scoreColor(result.score) }}
                  >
                    {result.score}
                  </span>
                </div>
              </div>
            </div>
            <p className="eyebrow mb-2">Match score</p>
            <p className="text-[15px] text-ink-soft max-w-xl mx-auto leading-relaxed">
              {result.summary}
            </p>
          </div>

          {/* Strengths / Gaps / Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <ResultColumn
              title="Strengths"
              accent="#10B981"
              items={result.strengths}
              symbol="✓"
            />
            <ResultColumn
              title="Gaps"
              accent="#F59E0B"
              items={result.gaps}
              symbol="!"
            />
            <ResultColumn
              title="Suggestions"
              accent="#1D1D1F"
              items={result.suggestions}
              symbol="→"
            />
          </div>
        </div>
      )}
    </div>
  );
}

function ResultColumn({
  title,
  accent,
  items,
  symbol,
}: {
  title: string;
  accent: string;
  items: string[];
  symbol: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <div className="flex items-center gap-2 mb-5">
        <span
          className="grid h-5 w-5 place-items-center rounded-full text-[11px] font-bold text-white"
          style={{ backgroundColor: accent }}
        >
          {symbol}
        </span>
        <h3 className="text-[15px] font-semibold text-ink tracking-tight">
          {title}
        </h3>
      </div>
      <ul className="space-y-3">
        {items.map((s, i) => (
          <li
            key={i}
            className="text-[13.5px] text-ink-soft leading-[1.6]"
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
