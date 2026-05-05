"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import DashboardStats from "@/components/DashboardStats";
import ApplicationCard from "@/components/ApplicationCard";
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
  const { data: session } = useSession();
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
    .slice()
    .sort(
      (a, b) =>
        new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime()
    )
    .slice(0, 5);

  const activeApplications = applications.filter((a) =>
    ["APPLIED", "SCREENING", "INTERVIEWING"].includes(a.status)
  );

  const firstName = session?.user?.name?.split(" ")[0];

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-6 py-12 space-y-8">
        <div className="h-9 w-72 bg-surface-2 rounded-lg animate-pulse" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-surface rounded-2xl border border-line animate-pulse"
            />
          ))}
        </div>
        <div className="h-72 bg-surface rounded-2xl border border-line animate-pulse" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-12 space-y-10">
      {/* Header */}
      <div>
        <p className="eyebrow mb-3">Dashboard</p>
        <h1 className="display-2 text-ink">
          {firstName ? `Hello, ${firstName}.` : "Welcome back."}
        </h1>
        <p className="text-[15.5px] text-ink-mute mt-3">
          Here's where your job search stands today.
        </p>
      </div>

      {/* Stats */}
      <DashboardStats stats={stats} />

      {/* Two-column: Recent + Active */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <Section
          title="Recent applications"
          action={
            <Link
              href="/applications"
              className="text-[13px] font-medium text-ink-soft hover:text-ink"
            >
              View all →
            </Link>
          }
        >
          {recentApplications.length === 0 ? (
            <EmptyState
              title="No applications yet"
              description="Add your first one to start tracking."
              cta={{ href: "/applications/new", label: "Add application" }}
            />
          ) : (
            <div className="space-y-3">
              {recentApplications.map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </Section>

        <Section
          title="Active pipeline"
          action={
            <span className="text-[13px] text-ink-mute tabular-nums">
              {activeApplications.length} active
            </span>
          }
        >
          {activeApplications.length === 0 ? (
            <EmptyState
              title="Nothing in flight"
              description="Applications you've sent will appear here."
            />
          ) : (
            <div className="space-y-3">
              {activeApplications.slice(0, 5).map((app) => (
                <ApplicationCard key={app.id} application={app} />
              ))}
            </div>
          )}
        </Section>
      </div>

      {/* Quick actions */}
      <Section title="Quick actions">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickAction
            href="/applications/new"
            title="Add application"
            description="Track a new role"
            iconPath="M12 4.5v15m7.5-7.5h-15"
          />
          <QuickAction
            href="/ai/resume-match"
            title="Resume match"
            description="Score your fit"
            iconPath="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
          />
          <QuickAction
            href="/ai/cover-letter"
            title="Cover letter"
            description="Draft with AI"
            iconPath="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z"
          />
        </div>
      </Section>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-[17px] font-semibold text-ink tracking-tight">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function QuickAction({
  href,
  title,
  description,
  iconPath,
}: {
  href: string;
  title: string;
  description: string;
  iconPath: string;
}) {
  return (
    <Link
      href={href}
      className="group flex items-center gap-4 rounded-2xl border border-line bg-surface p-5 transition-all hover:border-line-strong hover:bg-surface-2/40"
    >
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-surface-2 text-ink transition-colors group-hover:bg-ink group-hover:text-white">
        <svg
          className="h-[18px] w-[18px]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.7}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
        </svg>
      </div>
      <div className="min-w-0">
        <p className="text-[14.5px] font-semibold text-ink tracking-tight">
          {title}
        </p>
        <p className="text-[12.5px] text-ink-mute mt-0.5">{description}</p>
      </div>
    </Link>
  );
}

function EmptyState({
  title,
  description,
  cta,
}: {
  title: string;
  description: string;
  cta?: { href: string; label: string };
}) {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <p className="text-[15px] font-semibold text-ink mb-1">{title}</p>
      <p className="text-[13px] text-ink-mute mb-5">{description}</p>
      {cta && (
        <Link
          href={cta.href}
          className="inline-flex items-center gap-1.5 text-[13.5px] font-medium text-ink underline-offset-4 hover:underline"
        >
          {cta.label} →
        </Link>
      )}
    </div>
  );
}
