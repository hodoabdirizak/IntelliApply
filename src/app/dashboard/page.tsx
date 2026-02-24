"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import DashboardStats from "@/components/DashboardStats";
import ApplicationCard from "@/components/ApplicationCard";
import Card, { CardHeader, CardTitle } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import type { Application, DashboardStats as StatsType } from "@/types";

function computeStats(applications: Application[]): StatsType {
  const total = applications.length;
  const applied = applications.filter((a) => a.status === "APPLIED").length;
  const screening = applications.filter((a) => a.status === "SCREENING").length;
  const interviewing = applications.filter(
    (a) => a.status === "INTERVIEWING"
  ).length;
  const offers = applications.filter((a) => a.status === "OFFER").length;
  const accepted = applications.filter((a) => a.status === "ACCEPTED").length;
  const rejected = applications.filter((a) => a.status === "REJECTED").length;
  const withdrawn = applications.filter((a) => a.status === "WITHDRAWN").length;

  const responded = screening + interviewing + offers + accepted + rejected;
  const responseRate = total > 0 ? Math.round((responded / total) * 100) : 0;
  const offerRate =
    responded > 0 ? Math.round(((offers + accepted) / responded) * 100) : 0;

  return {
    total,
    applied,
    screening,
    interviewing,
    offers,
    accepted,
    rejected,
    withdrawn,
    responseRate,
    offerRate,
  };
}

export default function DashboardPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const stats = computeStats(applications);
  const recentApplications = applications
    .sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    )
    .slice(0, 5);

  const activeApplications = applications.filter((a) =>
    ["APPLIED", "SCREENING", "INTERVIEWING"].includes(a.status)
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-gray-800/50 rounded-xl border border-gray-700/50 animate-pulse"
            />
          ))}
        </div>
        <div className="h-64 bg-gray-800/50 rounded-xl border border-gray-700/50 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">
            Overview of your job search progress
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

      <DashboardStats stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Recent Applications</CardTitle>
            <Link
              href="/applications"
              className="text-sm text-brand-400 hover:text-brand-300 transition-colors"
            >
              View all
            </Link>
          </CardHeader>
          {recentApplications.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex p-4 rounded-full bg-gray-800/50 mb-4">
                <svg
                  className="w-8 h-8 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">No applications yet</p>
              <Link
                href="/applications/new"
                className="text-brand-400 text-sm hover:text-brand-300 mt-1 inline-block"
              >
                Add your first application
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </Card>

        <Card variant="bordered">
          <CardHeader>
            <CardTitle>Active Pipeline</CardTitle>
            <span className="text-sm text-gray-400">
              {activeApplications.length} active
            </span>
          </CardHeader>
          {activeApplications.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-sm">
                No active applications in pipeline
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeApplications.slice(0, 5).map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card variant="bordered">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link
            href="/applications/new"
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-brand-500/30 hover:bg-gray-800/50 transition-all group"
          >
            <div className="p-2.5 rounded-lg bg-brand-600/15 text-brand-400 group-hover:bg-brand-600/25 transition-colors">
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-white">Add Application</p>
              <p className="text-xs text-gray-500">
                Track a new job application
              </p>
            </div>
          </Link>

          <Link
            href="/ai/resume-match"
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-brand-500/30 hover:bg-gray-800/50 transition-all group"
          >
            <div className="p-2.5 rounded-lg bg-brand-600/15 text-brand-400 group-hover:bg-brand-600/25 transition-colors">
              <svg
                className="w-5 h-5"
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
              <p className="text-sm font-medium text-white">Resume Match</p>
              <p className="text-xs text-gray-500">Analyze your resume fit</p>
            </div>
          </Link>

          <Link
            href="/ai/cover-letter"
            className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 hover:border-brand-500/30 hover:bg-gray-800/50 transition-all group"
          >
            <div className="p-2.5 rounded-lg bg-brand-600/15 text-brand-400 group-hover:bg-brand-600/25 transition-colors">
              <svg
                className="w-5 h-5"
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
              <p className="text-sm font-medium text-white">Cover Letter</p>
              <p className="text-xs text-gray-500">Generate with AI</p>
            </div>
          </Link>
        </div>
      </Card>
    </div>
  );
}
