"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Input";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import type { ResumeMatchResult } from "@/types";

export default function ResumeMatchPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<ResumeMatchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async () => {
    if (resume.length < 50 || jobDescription.length < 50) {
      setError(
        "Both resume and job description must be at least 50 characters."
      );
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
    if (score >= 80) return { text: "text-emerald-400", ring: "stroke-emerald-400" };
    if (score >= 60) return { text: "text-amber-400", ring: "stroke-amber-400" };
    return { text: "text-red-400", ring: "stroke-red-400" };
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 rounded-lg bg-brand-600/15 text-brand-400">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">AI Resume Match</h1>
            <p className="text-gray-400">
              Analyze how well your resume matches a job description
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Textarea
            label="Your Resume"
            placeholder="Paste your resume content here..."
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={12}
          />
          <p className="text-xs text-gray-500">
            {resume.length} characters
            {resume.length < 50 && resume.length > 0
              ? " (minimum 50)"
              : ""}
          </p>
        </div>

        <div className="space-y-4">
          <Textarea
            label="Job Description"
            placeholder="Paste the job description here..."
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={12}
          />
          <p className="text-xs text-gray-500">
            {jobDescription.length} characters
            {jobDescription.length < 50 && jobDescription.length > 0
              ? " (minimum 50)"
              : ""}
          </p>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
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
          {isLoading ? "Analyzing with AI..." : "Analyze Match"}
        </Button>
      </div>

      {result && (
        <div className="space-y-6 animate-in fade-in duration-500">
          <Card variant="elevated" className="text-center">
            <div className="inline-flex items-center justify-center mb-4">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="#1f2937"
                    strokeWidth="8"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    className={scoreColor(result.score).ring}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${(result.score / 100) * 314} 314`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className={`text-4xl font-bold ${scoreColor(result.score).text}`}
                  >
                    {result.score}
                  </span>
                </div>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              Match Score
            </h2>
            <p className="text-gray-400 max-w-lg mx-auto">{result.summary}</p>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="bordered">
              <CardHeader>
                <CardTitle>
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-emerald-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Strengths
                  </span>
                </CardTitle>
              </CardHeader>
              <ul className="space-y-2">
                {result.strengths.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <span className="text-emerald-400 mt-0.5 shrink-0">+</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-amber-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z"
                      />
                    </svg>
                    Gaps
                  </span>
                </CardTitle>
              </CardHeader>
              <ul className="space-y-2">
                {result.gaps.map((g, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <span className="text-amber-400 mt-0.5 shrink-0">-</span>
                    {g}
                  </li>
                ))}
              </ul>
            </Card>

            <Card variant="bordered">
              <CardHeader>
                <CardTitle>
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5 text-brand-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18"
                      />
                    </svg>
                    Suggestions
                  </span>
                </CardTitle>
              </CardHeader>
              <ul className="space-y-2">
                {result.suggestions.map((s, i) => (
                  <li
                    key={i}
                    className="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <span className="text-brand-400 mt-0.5 shrink-0">*</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
