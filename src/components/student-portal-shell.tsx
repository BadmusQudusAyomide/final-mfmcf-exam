import type { ReactNode } from "react";
import { FaChurch } from "react-icons/fa";

interface StudentPortalShellProps {
  title: string;
  titleLabel: string;
  children: ReactNode;
}

export function StudentPortalShell({
  title,
  titleLabel,
  children,
}: StudentPortalShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1220px] flex-col px-5 py-6 sm:px-6">
      <header className="relative mb-8 overflow-hidden rounded-[32px] border border-white/70 bg-[linear-gradient(135deg,rgba(126,17,55,0.97)_0%,rgba(165,23,82,0.94)_42%,rgba(186,18,79,0.9)_100%)] px-6 py-8 text-center shadow-[0_24px_54px_rgba(126,17,55,0.18)] motion-safe:animate-[softRise_0.8s_ease-out] sm:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_34%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.14),transparent_28%)]" />
        <div className="absolute -top-14 right-8 h-32 w-32 rounded-full bg-white/14 blur-3xl" />
        <div className="absolute left-8 bottom-0 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-semibold uppercase tracking-[0.34em] text-white/70">
            Mountain of Fire and Miracles Campus Fellowship
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 max-md:flex-col">
            <div className="rounded-full border border-white/20 bg-white/12 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl">
              <FaChurch className="text-[2.3rem] text-white" />
            </div>
            <h1 className="text-left text-2xl leading-[1.15] font-bold whitespace-pre-line text-white max-md:text-center">
              {title}
            </h1>
          </div>
          <div className="mt-5 flex justify-center">
            <h2 className="inline-flex items-center rounded-full border border-white/18 bg-white/12 px-5 py-2 text-[1rem] font-semibold tracking-[0.12em] text-white shadow-[0_10px_24px_rgba(0,0,0,0.12)] backdrop-blur-xl max-md:text-sm">
              {titleLabel}
            </h2>
          </div>
        </div>
      </header>

      {children}

      <footer className="mt-8 text-center text-[0.9rem] text-[#666] motion-safe:animate-[softRise_0.9s_ease-out]">
        <p className="mb-1">&copy; 2026 MFMCF UNIOSUN Osogbo Campus. All Rights Reserved.</p>
        <p className="font-medium text-[#ba124f]">Powered by MFMCF UNIOSUN ICT</p>
      </footer>
    </div>
  );
}
