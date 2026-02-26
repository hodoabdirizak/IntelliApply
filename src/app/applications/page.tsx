"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import ApplicationCard from "@/components/ApplicationCard";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/Input";
import type { Application, ApplicationStatus } from "@/types";

const filterOptions = [
  { value: "ALL", label: "All Statuses" },
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
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "company", label: "Company A-Z" },
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
      case "status":
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

    return filtered;
  }, [applications, statusFilter, sortBy, search]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-24 bg-gray-800/50 rounded-xl border border-gray-700/50 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Applications</h1>
          <p className="text-gray-400 mt-1">
            {applications.length} total application
            {applications.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link href="/applications/new">
          <Button>
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            New Application
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search by company, role, or location..."
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

      {filteredApplications.length === 0 ? (
        <div className="text-center py-20">
          <div className="inline-flex p-4 rounded-full bg-gray-800/50 mb-4">
            <svg
              className="w-10 h-10 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-white mb-1">
            {search || statusFilter !== "ALL"
              ? "No matching applications"
              : "No applications yet"}
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            {search || statusFilter !== "ALL"
              ? "Try adjusting your filters"
              : "Start tracking your job search by adding your first application"}
          </p>
          {!search && statusFilter === "ALL" && (
            <Link href="/applications/new">
              <Button>Add Your First Application</Button>
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
