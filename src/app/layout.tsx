import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "IntelliApply - AI-Powered Job Application Tracker",
  description:
    "Track your job applications, analyze resume-job fit with AI, and generate tailored cover letters. Built with Next.js 15, Claude API, and Prisma.",
  keywords: [
    "job tracker",
    "application tracker",
    "AI resume",
    "cover letter generator",
    "career tools",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 font-sans">
        <Navbar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 min-h-[calc(100vh-4rem)] p-6 lg:p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
