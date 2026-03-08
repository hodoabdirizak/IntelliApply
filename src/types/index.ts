import type { Application, Resume, User } from "@prisma/client";

export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "SCREENING"
  | "INTERVIEWING"
  | "OFFER"
  | "ACCEPTED"
  | "REJECTED"
  | "WITHDRAWN";

export type ApplicationWithUser = Application & {
  user: Pick<User, "id" | "name" | "email">;
};

export interface DashboardStats {
  total: number;
  applied: number;
  screening: number;
  interviewing: number;
  offers: number;
  accepted: number;
  rejected: number;
  withdrawn: number;
  responseRate: number;
  offerRate: number;
}

export interface ResumeMatchResult {
  score: number;
  strengths: string[];
  gaps: string[];
  suggestions: string[];
  summary: string;
}

export interface AnalyticsData {
  statusBreakdown: { name: string; value: number; color: string }[];
  weeklyApplications: { week: string; count: number }[];
  topCompanies: { company: string; count: number }[];
  salaryRange: { min: number; max: number; avg: number };
}

export interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

// Extend next-auth session types
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export type { Application, Resume, User };
