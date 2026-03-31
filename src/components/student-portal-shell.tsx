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
    <div className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-5 py-5 sm:px-6">
      <header className="mb-8 text-center motion-safe:animate-[fadeInDown_1s_ease-out]">
        <div className="mb-2 flex items-center justify-center max-md:flex-col">
          <FaChurch className="mr-4 text-[2.5rem] text-[#ba124f] max-md:mr-0 max-md:mb-2" />
          <h1 className="text-left text-2xl leading-[1.2] font-bold whitespace-pre-line text-[#ba124f] max-md:text-center">
            {title}
          </h1>
        </div>
        <h2 className="relative inline-block text-[1.8rem] font-semibold text-[#ba124f] after:absolute after:-bottom-2 after:left-1/2 after:h-[3px] after:w-20 after:-translate-x-1/2 after:bg-[#e4cef1] after:content-[''] max-md:text-2xl max-[480px]:text-[1.3rem]">
          {titleLabel}
        </h2>
      </header>

      {children}

      <footer className="mt-8 text-center text-[0.9rem] text-[#666] motion-safe:animate-[fadeInUp_1s_ease-out]">
        <p className="mb-1">&copy; 2025 MFMCF UNIOSUN Osogbo Campus. All Rights Reserved.</p>
        <p className="font-medium text-[#ba124f]">Powered by MFMCF UNIOSUN ICT</p>
      </footer>
    </div>
  );
}
