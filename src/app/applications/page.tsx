"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ApplicationCard from "@/components/ApplicationCard";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import type { Application, ApplicationStatus } from "@/types";

const filterOptions = [
  { value: "ALL", label: "All statuses" },
  { value: "SAVED", label: "Saved" },
  { value: "APPLIED", label: "Applied" },
  { value: "SCREENING", label: "Screening" },
  { value: "INTERVIEWING", label: "Interviewing" },
  { value: "OFFER", label: "Offer" },
  { value: "ACCEPTED", label: "Accepted" },
  { value: "REJECTED", label: "Rejected" },
  { value: "WITHDRAWN", label: "Withdrawn" },
];

const sortOptions = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "company", label: "Company A–Z" },
  { value: "status", label: "Status" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortBy, setSortBy] = useState("newest");
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchApplications() {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          setApplications(data);
        }
      } catch (error) {
        console.error("Failed to fetch applications:", error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchApplications();
  }, []);

  const filteredApplications = useMemo(() => {
    let filtered = [...applications];

    if (statusFilter !== "ALL") {
      filtered = filtered.filter(
        (a) => a.status === (statusFilter as ApplicationStatus)
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.company.toLowerCase().includes(q) ||
          a.role.toLowerCase().includes(q) ||
          a.location?.toLowerCase().includes(q)
      );
    }

    switch (sortBy) {
      case "newest":
        filtered.sort(
          (a, b) =>
            new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
        );
        break;
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime()
        );
        break;
      case "company":
        filtered.sort((a, b) => a.company.localeCompare(b.company));
        break;
      case "status": {
        const statusOrder: Record<ApplicationStatus, number> = {
          OFFER: 0,
          INTERVIEWING: 1,
          SCREENING: 2,
          APPLIED: 3,
          SAVED: 4,
          ACCEPTED: 5,
          REJECTED: 6,
          WITHDRAWN: 7,
        };
        filtered.sort(
          (a, b) =>
            statusOrder[a.status as ApplicationStatus] -
            statusOrder[b.status as ApplicationStatus]
        );
        break;
      }
    }

    return filtered;
  }, [applications, statusFilter, sortBy, search]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-6">
        <div className="h-9 w-48 bg-surface-2 rounded-lg animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl border border-line bg-surface animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-end justify-between gap-6 flex-wrap">
        <div>
          <p className="eyebrow mb-3">All applications</p>
          <h1 className="display-2 text-ink">Your pipeline</h1>
          <p className="text-[15px] text-ink-mute mt-2 tabular-nums">
            {applications.length} total · {filteredApplications.length} shown
          </p>
        </div>
        <Link
          href="/applications/new"
          className="inline-flex items-center gap-1.5 rounded-full bg-ink px-5 py-2.5 text-[13.5px] font-medium text-white transition-opacity hover:opacity-90"
        >
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New application
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by company, role, or location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-3">
          <Select
            options={filterOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          />
        </div>
      </div>

      {/* List */}
      {filteredApplications.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-line bg-surface px-6 py-24 text-center">
          <h3 className="text-[18px] font-semibold text-ink mb-2 tracking-tight">
            {search || statusFilter !== "ALL"
              ? "No matching applications"
              : "No applications yet"}
          </h3>
          <p className="text-[14px] text-ink-mute mb-6 max-w-sm mx-auto">
            {search || statusFilter !== "ALL"
              ? "Try adjusting your search or filters."
              : "Start tracking your job search by adding your first one."}
          </p>
          {!search && statusFilter === "ALL" && (
            <Link
              href="/applications/new"
              className="inline-flex items-center justify-center rounded-full bg-ink px-6 py-2.5 text-[13.5px] font-medium text-white transition-opacity hover:opacity-90"
            >
              Add your first application
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredApplications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}
    </div>
  );
}
