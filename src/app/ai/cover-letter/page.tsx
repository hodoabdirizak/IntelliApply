"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";

const toneOptions = [
  { value: "professional", label: "Professional" },
  { value: "conversational", label: "Conversational" },
  { value: "enthusiastic", label: "Enthusiastic" },
];

export default function CoverLetterPage() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [roleName, setRoleName] = useState("");
  const [tone, setTone] = useState("professional");
  const [coverLetter, setCoverLetter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (resume.length < 50 || jobDescription.length < 50) {
      setError("Resume and job description must be at least 50 characters.");
      return;
    }
    if (!companyName.trim() || !roleName.trim()) {
      setError("Company name and role name are required.");
      return;
    }

    setIsLoading(true);
    setError("");
    setCoverLetter("");

    try {
      const res = await fetch("/api/ai/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume,
          jobDescription,
          companyName,
          roleName,
          tone,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Generation failed");
      }

      const data = await res.json();
      setCoverLetter(data.coverLetter);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to generate. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">
              AI Cover Letter Generator
            </h1>
            <p className="text-gray-400">
              Generate tailored cover letters powered by Claude AI
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Input
          label="Company Name *"
          placeholder="e.g., Google"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
        />
        <Input
          label="Role Name *"
          placeholder="e.g., Senior Software Engineer"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
        />
      </div>

      <Select
        label="Tone"
        options={toneOptions}
        value={tone}
        onChange={(e) => setTone(e.target.value)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Textarea
          label="Your Resume"
          placeholder="Paste your resume content here..."
          value={resume}
          onChange={(e) => setResume(e.target.value)}
          rows={10}
        />
        <Textarea
          label="Job Description"
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={10}
        />
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-center">
        <Button
          size="lg"
          onClick={handleGenerate}
          isLoading={isLoading}
          disabled={
            resume.length < 50 ||
            jobDescription.length < 50 ||
            !companyName.trim() ||
            !roleName.trim()
          }
        >
          {isLoading ? "Generating with AI..." : "Generate Cover Letter"}
        </Button>
      </div>

      {coverLetter && (
        <Card
          variant="elevated"
          className="animate-in fade-in duration-500 relative"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">
              Generated Cover Letter
            </h2>
            <Button
              variant="secondary"
              size="sm"
              onClick={handleCopy}
            >
              {copied ? (
                <>
                  <svg
                    className="w-4 h-4 text-emerald-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
                    />
                  </svg>
                  Copy
                </>
              )}
            </Button>
          </div>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed text-sm">
              {coverLetter}
            </p>
          </div>
          <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
              />
            </svg>
            Generated by Claude AI. Always review and personalize before sending.
          </div>
        </Card>
      )}
    </div>
  );
}
