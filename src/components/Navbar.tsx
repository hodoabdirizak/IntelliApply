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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-surface-0/90 backdrop-blur-sm">
      <div className="flex h-14 items-center justify-between px-6">
        <div className="flex items-center gap-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-accent-500 flex items-center justify-center">
              <span className="text-xs font-bold text-white">ia</span>
            </div>
            <span className="text-sm font-semibold text-gray-100 tracking-tight">
              IntelliApply
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    "px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors",
                    isActive
                      ? "bg-surface-2 text-gray-100"
                      : "text-muted hover:text-gray-300 hover:bg-surface-1"
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-600 hover:bg-accent-500 text-white text-[13px] font-medium rounded-md transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="hidden sm:inline">New</span>
          </Link>
          <div className="h-7 w-7 rounded-full bg-surface-3 border border-border flex items-center justify-center text-xs font-medium text-muted">
            H
          </div>
        </div>
      </div>
    </header>
  );
}
