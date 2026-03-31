"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Link from "next/link";
import { FaBars, FaTimes } from "react-icons/fa";
import { AdminLogoutButton } from "@/components/admin-logout-button";

interface AdminShellProps {
  title: string;
  description: string;
  current: "dashboard" | "exam" | "submissions";
  children: ReactNode;
  topAction?: ReactNode;
}

const navItems = [
  { href: "/admin", label: "Dashboard", key: "dashboard" },
  { href: "/admin/exam", label: "Exam Builder", key: "exam" },
  { href: "/admin/submissions", label: "Submissions", key: "submissions" },
] as const;

export function AdminShell({
  title,
  description,
  current,
  children,
  topAction,
}: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#f4f6fb]">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-[280px] shrink-0 border-r border-[#e8e7ef] bg-white lg:flex lg:flex-col">
          <div className="border-b border-[#efedf3] px-6 py-6">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a04667]">
              Admin Side
            </p>
            <h1 className="mt-3 text-2xl font-bold leading-tight text-[#7e1137]">
              MFMCF Exam Dashboard
            </h1>
            <p className="mt-3 text-sm leading-6 text-[#6b6470]">
              Standard admin workspace for exam operations.
            </p>
          </div>

          <nav className="flex-1 px-4 py-5">
            <div className="space-y-2">
              {navItems.map((item) => {
                const active = item.key === current;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[#7e1137] !text-white shadow-[0_10px_24px_rgba(91,16,43,0.18)]"
                        : "text-[#59525c] hover:bg-[#f8f2f6] hover:text-[#7e1137]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          <div className="border-t border-[#efedf3] px-4 py-5">
            <div className="space-y-3">
              <Link
                href="/"
                className="block rounded-xl bg-[#7e1137] px-4 py-3 text-center text-sm font-semibold !text-white transition hover:bg-[#65102d]"
              >
                Open Student Portal
              </Link>
              <AdminLogoutButton />
            </div>
          </div>
        </aside>

        {mobileOpen ? (
          <button
            type="button"
            className="fixed inset-0 z-40 bg-black/35 lg:hidden"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu overlay"
          />
        ) : null}

        <aside
          className={`fixed top-0 left-0 z-50 h-full w-[280px] border-r border-[#e8e7ef] bg-white transition-transform duration-200 lg:hidden ${
            mobileOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#efedf3] px-5 py-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#a04667]">
                Admin Side
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#7e1137]">Navigation</h2>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="rounded-full bg-[#7e1137] p-3 text-white transition hover:bg-[#65102d]"
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>

          <nav className="px-4 py-5">
            <div className="space-y-2">
              {navItems.map((item) => {
                const active = item.key === current;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[#7e1137] !text-white"
                        : "text-[#59525c] hover:bg-[#f8f2f6] hover:text-[#7e1137]"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block rounded-xl bg-[#7e1137] px-4 py-3 text-center text-sm font-semibold !text-white transition hover:bg-[#65102d]"
              >
                Open Student Portal
              </Link>
              <AdminLogoutButton />
            </div>
          </nav>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="border-b border-[#ebe7ef] bg-white px-4 py-4 shadow-[0_1px_0_rgba(0,0,0,0.03)] sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex min-w-0 items-start gap-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className="rounded-xl bg-[#7e1137] p-3 text-white transition hover:bg-[#65102d] lg:hidden"
                  aria-label="Open navigation menu"
                >
                  <FaBars />
                </button>
                <div className="min-w-0">
                  <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#a04667]">
                    Admin Workspace
                  </p>
                  <h2 className="mt-2 text-2xl font-bold text-[#711132] sm:text-3xl">{title}</h2>
                  <p className="mt-2 max-w-3xl text-sm leading-6 text-[#655a61] sm:text-base">
                    {description}
                  </p>
                </div>
              </div>

              {topAction ? <div className="hidden shrink-0 sm:block">{topAction}</div> : null}
            </div>

            {topAction ? <div className="mt-4 sm:hidden">{topAction}</div> : null}
          </header>

          <div className="p-4 sm:p-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
