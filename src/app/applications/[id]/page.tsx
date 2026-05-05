"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ApplicationForm from "@/components/ApplicationForm";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import type { Application } from "@/types";
import { format } from "date-fns";

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    async function fetchApplication() {
      try {
        const res = await fetch(`/api/applications?id=${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setApplication(data);
        }
      } catch (error) {
        console.error("Failed to fetch application:", error);
      } finally {
        setIsLoading(false);
      }
    }
    if (params.id) fetchApplication();
  }, [params.id]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/applications?id=${params.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/applications");
        router.refresh();
      }
    } catch (error) {
      console.error("Failed to delete application:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-6">
        <div className="h-8 w-64 bg-surface-2 rounded-lg animate-pulse" />
        <div className="h-96 rounded-2xl border border-line bg-surface animate-pulse" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-32 text-center">
        <h2 className="text-[22px] font-semibold text-ink mb-2 tracking-tight">
          Application not found
        </h2>
        <p className="text-[14px] text-ink-mute mb-8">
          This application may have been deleted.
        </p>
        <Button onClick={() => router.push("/applications")}>
          Back to applications
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        <div className="flex items-end justify-between gap-6 flex-wrap">
          <div>
            <button
              onClick={() => setIsEditing(false)}
              className="inline-flex items-center gap-1.5 text-[13px] text-ink-mute hover:text-ink mb-6 transition-colors"
            >
              ← Back to details
            </button>
            <p className="eyebrow mb-3">Editing</p>
            <h1 className="display-2 text-ink">{application.role}</h1>
            <p className="text-[15px] text-ink-mute mt-2">
              at {application.company}
            </p>
          </div>
        </div>
        <ApplicationForm application={application} mode="edit" />
      </div>
    );
  }

  const salaryDisplay =
    application.salaryMin && application.salaryMax
      ? `${application.currency} ${application.salaryMin.toLocaleString()} – ${application.salaryMax.toLocaleString()}`
      : application.salaryMin
        ? `${application.currency} ${application.salaryMin.toLocaleString()}+`
        : "Not specified";

  return (
    <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
      {/* Back link */}
      <Link
        href="/applications"
        className="inline-flex items-center gap-1.5 text-[13px] text-ink-mute hover:text-ink transition-colors"
      >
        ← Back to applications
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <Badge status={application.status} />
            {application.remote && (
              <span className="text-[11.5px] font-medium text-ink-soft bg-surface-2 px-2 py-0.5 rounded-full">
                Remote
              </span>
            )}
          </div>
          <h1 className="display-2 text-ink">{application.role}</h1>
          <p className="text-[17px] text-ink-mute mt-2">{application.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button variant="ghost" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="eyebrow mb-5">Details</h3>
          <dl className="space-y-4">
            <DetailRow
              label="Location"
              value={application.location || "Not specified"}
            />
            <DetailRow label="Salary range" value={salaryDisplay} />
            <DetailRow
              label="Applied"
              value={format(new Date(application.appliedAt), "MMM d, yyyy")}
            />
            <DetailRow
              label="Last updated"
              value={format(new Date(application.updatedAt), "MMM d, yyyy 'at' h:mm a")}
            />
          </dl>
        </div>

        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="eyebrow mb-5">Links</h3>
          {application.url ? (
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[14px] font-medium text-ink underline-offset-4 hover:underline"
            >
              View job posting
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
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
            </a>
          ) : (
            <p className="text-[14px] text-ink-mute">No URL provided</p>
          )}
        </div>
      </div>

      {/* Notes */}
      {application.notes && (
        <div className="rounded-2xl border border-line bg-surface p-6">
          <h3 className="eyebrow mb-4">Notes</h3>
          <p className="text-[14.5px] text-ink-soft whitespace-pre-wrap leading-relaxed">
            {application.notes}
          </p>
        </div>
      )}

      {/* Delete confirm */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete this application?"
        size="sm"
      >
        <p className="text-[14.5px] text-ink-soft mb-7 leading-relaxed">
          You're about to delete <strong className="text-ink">{application.role}</strong> at{" "}
          <strong className="text-ink">{application.company}</strong>. This can't be undone.
        </p>
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Keep it
          </Button>
          <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-[12.5px] text-ink-mute">{label}</dt>
      <dd className="text-[13.5px] text-ink font-medium text-right">{value}</dd>
    </div>
  );
}
