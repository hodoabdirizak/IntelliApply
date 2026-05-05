"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { clsx } from "clsx";
import { useState, useRef, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const navItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Applications", href: "/applications" },
    { label: "Resume Match", href: "/ai/resume-match" },
    { label: "Cover Letter", href: "/ai/cover-letter" },
    { label: "Analytics", href: "/analytics" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-line bg-bg/80 backdrop-blur-md">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Brand + nav */}
          <div className="flex items-center gap-10">
            <Link
              href={session ? "/dashboard" : "/"}
              className="flex items-center gap-2.5"
            >
              <span className="grid h-7 w-7 place-items-center rounded-[8px] bg-ink text-[11px] font-semibold text-white tracking-tight">
                ia
              </span>
              <span className="text-[15px] font-semibold text-ink tracking-tight">
                IntelliApply
              </span>
            </Link>

            {session && (
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={clsx(
                        "rounded-full px-3.5 py-1.5 text-[13.5px] font-medium transition-colors",
                        isActive
                          ? "bg-surface-2 text-ink"
                          : "text-ink-mute hover:text-ink hover:bg-surface-2/60"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>

          {/* Right cluster */}
          <div className="flex items-center gap-2.5">
            {session ? (
              <>
                <Link
                  href="/applications/new"
                  className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                >
                  <svg
                    className="h-3.5 w-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    />
                  </svg>
                  New application
                </Link>

                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="h-9 w-9 overflow-hidden rounded-full border border-line bg-surface transition-colors hover:border-line-strong"
                    aria-label="Account menu"
                  >
                    {session.user?.image ? (
                      <Image
                        src={session.user.image}
                        alt=""
                        width={36}
                        height={36}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-surface-2 text-xs font-semibold text-ink-soft">
                        {session.user?.name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-60 overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_8px_30px_rgb(0_0_0_/_0.08)]">
                      <div className="px-4 py-3 border-b border-line">
                        <p className="truncate text-[13.5px] font-medium text-ink">
                          {session.user?.name}
                        </p>
                        <p className="truncate text-xs text-ink-mute mt-0.5">
                          {session.user?.email}
                        </p>
                      </div>
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full px-4 py-2.5 text-left text-[13.5px] text-ink-soft transition-colors hover:bg-surface-2 hover:text-ink"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link
                href="/signin"
                className="rounded-full bg-ink px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
