"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import type { Application } from "@/types";

const statusOptions = [
  { value: "SAVED", label: "Saved" },
  { value: "APPLIED", label: "Applied" },
  { value: "SCREENING", label: "Screening" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFER", label: "Offer" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

const currencyOptions = [
  { value: "CAD", label: "CAD" },
  { value: "USD", label: "USD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
];

interface ApplicationFormProps {
  application?: Application;
  mode: "create" | "edit";
}

export default function ApplicationForm({
  application,
  mode,
}: ApplicationFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    company: application?.company ?? "",
    role: application?.role ?? "",
    status: application?.status ?? "APPLIED",
    url: application?.url ?? "",
    salaryMin: application?.salaryMin?.toString() ?? "",
    salaryMax: application?.salaryMax?.toString() ?? "",
    currency: application?.currency ?? "CAD",
    location: application?.location ?? "",
    remote: application?.remote ?? false,
    notes: application?.notes ?? "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    const newErrors: Record<string, string> = {};
    if (!formData.company.trim()) newErrors.company = "Company is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        ...formData,
        salaryMin: formData.salaryMin ? parseInt(formData.salaryMin) : null,
        salaryMax: formData.salaryMax ? parseInt(formData.salaryMax) : null,
        url: formData.url || null,
        location: formData.location || null,
        notes: formData.notes || null,
      };

      const url =
        mode === "create"
          ? "/api/applications"
          : `/api/applications?id=${application!.id}`;

      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Something went wrong");
      }

      router.push("/applications");
      router.refresh();
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Failed to save application",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.form && (
        <div className="rounded-2xl bg-danger-50 border border-danger-500/30 px-4 py-3 text-[13.5px] text-danger-700 font-medium">
          {errors.form}
        </div>
      )}

      <FormSection
        title="Role"
        description="Where you applied and what for."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            id="company"
            name="company"
            label="Company"
            placeholder="e.g. Linear"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
          />
          <Input
            id="role"
            name="role"
            label="Role"
            placeholder="e.g. Senior Software Engineer"
            value={formData.role}
            onChange={handleChange}
            error={errors.role}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Select
            id="status"
            name="status"
            label="Status"
            options={statusOptions}
            value={formData.status}
            onChange={handleChange}
          />
          <Input
            id="url"
            name="url"
            label="Job posting URL"
            type="url"
            placeholder="https://"
            value={formData.url}
            onChange={handleChange}
            error={errors.url}
          />
        </div>
      </FormSection>

      <FormSection
        title="Compensation"
        description="Optional — leave blank if unknown."
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            id="salaryMin"
            name="salaryMin"
            label="Min"
            type="number"
            placeholder="80,000"
            value={formData.salaryMin}
            onChange={handleChange}
          />
          <Input
            id="salaryMax"
            name="salaryMax"
            label="Max"
            type="number"
            placeholder="120,000"
            value={formData.salaryMax}
            onChange={handleChange}
          />
          <Select
            id="currency"
            name="currency"
            label="Currency"
            options={currencyOptions}
            value={formData.currency}
            onChange={handleChange}
          />
        </div>
      </FormSection>

      <FormSection
        title="Location"
        description="Where the job is, or whether it's remote."
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            id="location"
            name="location"
            label="Location"
            placeholder="e.g. Toronto, ON"
            value={formData.location}
            onChange={handleChange}
          />
          <div className="flex items-end">
            <label className="flex items-center gap-3 cursor-pointer py-2.5">
              <input
                type="checkbox"
                name="remote"
                checked={formData.remote}
                onChange={handleChange}
                className="h-[18px] w-[18px] rounded-md border-line bg-surface text-ink focus:ring-ink/20 cursor-pointer accent-ink"
              />
              <span className="text-[14px] font-medium text-ink-soft">
                Remote position
              </span>
            </label>
          </div>
        </div>
      </FormSection>

      <FormSection
        title="Notes"
        description="Anything you'd like to remember — interviewers, prep, follow-ups."
      >
        <Textarea
          id="notes"
          name="notes"
          placeholder="Add notes here…"
          value={formData.notes}
          onChange={handleChange}
          rows={5}
        />
      </FormSection>

      <div className="flex items-center justify-end gap-3 pt-2 border-t border-line pt-6">
        <Button type="button" variant="ghost" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {mode === "create" ? "Add application" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 md:gap-10 pb-8 border-b border-line last:border-0 last:pb-0">
      <div>
        <h3 className="text-[15.5px] font-semibold text-ink tracking-tight">
          {title}
        </h3>
        {description && (
          <p className="text-[13px] text-ink-mute mt-1.5 leading-relaxed">
            {description}
          </p>
        )}
      </div>
      <div className="space-y-5">{children}</div>
    </section>
  );
}
