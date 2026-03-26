"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import ApplicationForm from "@/components/ApplicationForm";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
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
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="h-8 w-64 bg-surface-2 rounded-md animate-pulse" />
        <div className="h-96 bg-surface-1 rounded-lg border border-border animate-pulse" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold text-white mb-2">
          Application Not Found
        </h2>
        <p className="text-muted mb-4">
          This application may have been deleted.
        </p>
        <Button onClick={() => router.push("/applications")}>
          Back to Applications
        </Button>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Edit Application</h1>
            <p className="text-muted mt-1">
              Update details for {application.role} at {application.company}
            </p>
          </div>
          <Button variant="ghost" onClick={() => setIsEditing(false)}>
            Cancel
          </Button>
        </div>
        <ApplicationForm application={application} mode="edit" />
      </div>
    );
  }

  const salaryDisplay =
    application.salaryMin && application.salaryMax
      ? `${application.currency} ${application.salaryMin.toLocaleString()} - ${application.salaryMax.toLocaleString()}`
      : application.salaryMin
        ? `${application.currency} ${application.salaryMin.toLocaleString()}+`
        : "Not specified";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl font-bold text-white">
              {application.role}
            </h1>
            <Badge status={application.status} />
          </div>
          <p className="text-lg text-muted">{application.company}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
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
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
              />
            </svg>
            Edit
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
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
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
            Delete
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card variant="bordered">
          <h3 className="text-sm font-medium text-muted mb-3">Details</h3>
          <dl className="space-y-3">
            <div>
              <dt className="text-xs text-muted">Location</dt>
              <dd className="text-sm text-white">
                {application.location || "Not specified"}
                {application.remote && (
                  <span className="ml-2 text-teal-400 text-xs">(Remote)</span>
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Salary Range</dt>
              <dd className="text-sm text-white">{salaryDisplay}</dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Applied Date</dt>
              <dd className="text-sm text-white">
                {format(new Date(application.appliedAt), "MMM d, yyyy")}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-muted">Last Updated</dt>
              <dd className="text-sm text-white">
                {format(new Date(application.updatedAt), "MMM d, yyyy 'at' h:mm a")}
              </dd>
            </div>
          </dl>
        </Card>

        <Card variant="bordered">
          <h3 className="text-sm font-medium text-muted mb-3">Links</h3>
          {application.url ? (
            <a
              href={application.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent-400 hover:text-accent-300 transition-colors"
            >
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
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                />
              </svg>
              View Job Posting
            </a>
          ) : (
            <p className="text-sm text-muted">No URL provided</p>
          )}
        </Card>
      </div>

      {application.notes && (
        <Card variant="bordered">
          <h3 className="text-sm font-medium text-muted mb-3">Notes</h3>
          <p className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed">
            {application.notes}
          </p>
        </Card>
      )}

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Application"
        size="sm"
      >
        <p className="text-gray-300 mb-6">
          Are you sure you want to delete the application for{" "}
          <strong className="text-white">{application.role}</strong> at{" "}
          <strong className="text-white">{application.company}</strong>? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            isLoading={isDeleting}
          >
            Delete Application
          </Button>
        </div>
      </Modal>
    </div>
  );
}
