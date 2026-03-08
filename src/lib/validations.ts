import { z } from "zod";

export const applicationSchema = z.object({
  company: z
    .string()
    .min(1, "Company name is required")
    .max(200, "Company name is too long"),
  role: z
    .string()
    .min(1, "Role is required")
    .max(200, "Role name is too long"),
  status: z.enum([
    "SAVED",
    "APPLIED",
    "SCREENING",
    "INTERVIEWING",
    "OFFER",
    "ACCEPTED",
    "REJECTED",
    "WITHDRAWN",
  ]),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  salaryMin: z.coerce.number().int().positive().optional().or(z.literal(0)),
  salaryMax: z.coerce.number().int().positive().optional().or(z.literal(0)),
  currency: z.string().default("CAD"),
  location: z.string().max(200).optional(),
  remote: z.boolean().default(false),
  notes: z.string().max(5000).optional(),
  appliedAt: z.coerce.date().optional(),
});

export const applicationUpdateSchema = applicationSchema.partial();

export const resumeMatchSchema = z.object({
  resume: z
    .string()
    .min(50, "Resume must be at least 50 characters")
    .max(15000, "Resume is too long"),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(15000, "Job description is too long"),
});

export const coverLetterSchema = z.object({
  resume: z
    .string()
    .min(50, "Resume must be at least 50 characters")
    .max(15000, "Resume is too long"),
  jobDescription: z
    .string()
    .min(50, "Job description must be at least 50 characters")
    .max(15000, "Job description is too long"),
  companyName: z.string().min(1, "Company name is required"),
  roleName: z.string().min(1, "Role name is required"),
  tone: z
    .enum(["professional", "conversational", "enthusiastic"])
    .default("professional"),
});

export type ApplicationInput = z.infer<typeof applicationSchema>;
export type ApplicationUpdateInput = z.infer<typeof applicationUpdateSchema>;
export type ResumeMatchInput = z.infer<typeof resumeMatchSchema>;
export type CoverLetterInput = z.infer<typeof coverLetterSchema>;
