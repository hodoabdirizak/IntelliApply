"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Input, { Textarea } from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Card from "@/components/ui/Card";
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
    <form onSubmit={handleSubmit}>
      <Card variant="bordered" className="space-y-6">
        {errors.form && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {errors.form}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            id="company"
            name="company"
            label="Company *"
            placeholder="e.g., Google"
            value={formData.company}
            onChange={handleChange}
            error={errors.company}
          />
          <Input
            id="role"
            name="role"
            label="Role *"
            placeholder="e.g., Senior Software Engineer"
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
            label="Job Posting URL"
            type="url"
            placeholder="https://..."
            value={formData.url}
            onChange={handleChange}
            error={errors.url}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Input
            id="salaryMin"
            name="salaryMin"
            label="Salary Min"
            type="number"
            placeholder="80000"
            value={formData.salaryMin}
            onChange={handleChange}
          />
          <Input
            id="salaryMax"
            name="salaryMax"
            label="Salary Max"
            type="number"
            placeholder="120000"
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            id="location"
            name="location"
            label="Location"
            placeholder="e.g., Toronto, ON"
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
                className="w-5 h-5 rounded border-border bg-surface-2 text-accent-600 focus:ring-accent-500 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-sm font-medium text-gray-200">
                Remote position
              </span>
            </label>
          </div>
        </div>

        <Textarea
          id="notes"
          name="notes"
          label="Notes"
          placeholder="Add any notes about this application, interview prep, contacts, etc..."
          value={formData.notes}
          onChange={handleChange}
          rows={4}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            {mode === "create" ? "Add Application" : "Save Changes"}
          </Button>
        </div>
      </Card>
    </form>
  );
}
