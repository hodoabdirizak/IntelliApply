"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Applications", href: "/applications" },
    { label: "AI Tools", href: "/ai/resume-match" },
    { label: "Analytics", href: "/analytics" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 shadow-lg shadow-brand-600/25">
              <svg
                className="h-4.5 w-4.5 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                />
              </svg>
            </div>
            <span className="text-lg font-bold text-white">IntelliApply</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-brand-600/15 text-brand-300"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/applications/new"
            className="flex items-center gap-2 px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-lg transition-colors shadow-lg shadow-brand-600/25"
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
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="hidden sm:inline">New Application</span>
          </Link>
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-blue-500 flex items-center justify-center text-sm font-bold text-white">
            H
          </div>
        </div>
      </div>
    </header>
  );
}
