"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import Select from "@/components/ui/Select";

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
      setError("Resume and job description need at least 50 characters each.");
      return;
    }
    if (!companyName.trim() || !roleName.trim()) {
      setError("Company and role are required.");
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
        err instanceof Error
          ? err.message
          : "Failed to generate. Please try again."
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
    <div className="mx-auto max-w-5xl px-6 py-12 space-y-10">
      {/* Header */}
      <div>
        <p className="eyebrow mb-3">Cover letter</p>
        <h1 className="display-2 text-ink">Draft something worth editing.</h1>
        <p className="text-[15px] text-ink-mute mt-3 max-w-xl">
          Paste your resume and the job, pick a tone. We'll write a draft
          that's specific — not a Mad Libs template.
        </p>
      </div>

      {/* Inputs */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Company"
            placeholder="e.g. Linear"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <Input
            label="Role"
            placeholder="e.g. Senior Software Engineer"
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
            label="Your resume"
            placeholder="Paste resume content…"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
            rows={11}
          />
          <Textarea
            label="Job description"
            placeholder="Paste the job description…"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            rows={11}
          />
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
          onClick={handleGenerate}
          isLoading={isLoading}
          disabled={
            resume.length < 50 ||
            jobDescription.length < 50 ||
            !companyName.trim() ||
            !roleName.trim()
          }
        >
          {isLoading ? "Drafting…" : "Generate cover letter"}
        </Button>
      </div>

      {/* Output */}
      {coverLetter && (
        <div className="rounded-3xl border border-line bg-surface p-8 animate-in fade-in duration-300">
          <div className="flex items-center justify-between mb-6 pb-5 border-b border-line">
            <div>
              <p className="eyebrow mb-1.5">Draft</p>
              <h2 className="text-[19px] font-semibold text-ink tracking-tight">
                For {roleName} at {companyName}
              </h2>
            </div>
            <Button variant="secondary" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                  Copied
                </>
              ) : (
                <>
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.8}
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

          <p className="text-[14.5px] text-ink-soft whitespace-pre-wrap leading-[1.75] font-serif" style={{ fontFamily: "'Inter', -apple-system, sans-serif" }}>
            {coverLetter}
          </p>

          <p className="mt-8 pt-5 border-t border-line text-[12px] text-ink-mute italic">
            Generated with Claude. Read it through and make it sound like you
            before sending.
          </p>
        </div>
      )}
    </div>
  );
}
