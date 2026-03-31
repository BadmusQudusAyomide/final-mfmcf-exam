"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FaBan,
  FaClock,
  FaExclamationTriangle,
  FaGavel,
  FaHourglassEnd,
  FaInfoCircle,
  FaShieldAlt,
} from "react-icons/fa";
import { StudentPortalShell } from "@/components/student-portal-shell";

const instructions = [
  {
    icon: FaClock,
    text: (
      <>
        Time allowed is <strong>35 minutes</strong>
      </>
    ),
  },
  {
    icon: FaBan,
    text: (
      <>
        <strong>Cheating is not allowed</strong>
      </>
    ),
  },
  {
    icon: FaExclamationTriangle,
    text: (
      <>
        You <strong>can&apos;t leave the page</strong> or minimize the page until you finish
        (exam will auto-submit)
      </>
    ),
  },
  {
    icon: FaShieldAlt,
    text: (
      <>
        Abnormal activities on this page will be <strong>recorded</strong>
      </>
    ),
  },
  {
    icon: FaGavel,
    text: (
      <>
        There will be <strong>penalties</strong> for violations
      </>
    ),
  },
  {
    icon: FaHourglassEnd,
    text: (
      <>
        The page will <strong>automatically submit</strong> once your time is up
      </>
    ),
  },
];

function InstructionPageContent() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidateId");

  return (
    <StudentPortalShell
      title={"MFMCF UNIOSUN\nOSOGBO CAMPUS"}
      titleLabel="EXAM INSTRUCTIONS"
    >
      <main className="flex flex-1 items-center justify-center px-5 py-5">
        <div className="w-full max-w-[600px] overflow-hidden rounded-[10px] border-t-[5px] border-t-[#ba124f] bg-white p-[30px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] motion-safe:animate-[fadeInDown_0.8s_ease-out,pulse_3s_infinite_1s] relative max-md:p-5 max-[480px]:p-[15px]">
          <div className="mb-5 text-center text-[3rem] text-[#ba124f] max-md:text-[2.5rem]">
            <FaInfoCircle className="inline-block" />
          </div>
          <h3 className="mb-[25px] text-center text-2xl font-semibold text-[#ba124f] max-md:text-[1.3rem]">
            Important Instructions
          </h3>

          <div className="mb-[30px]">
            {instructions.map(({ icon: Icon, text }, index) => (
              <div
                key={index}
                className="mb-[15px] flex items-start rounded-lg bg-[#f8f9fa] p-3 transition duration-300 hover:translate-x-[5px] max-md:flex-col"
              >
                <Icon className="mt-[2px] mr-3 text-[1.2rem] text-[#ba124f] max-md:mb-2" />
                <span className="flex-1 text-[0.95rem]">{text}</span>
              </div>
            ))}
          </div>

          <div className="my-[25px] rounded-lg bg-[#f0f0f0] p-[15px] max-[480px]:p-[10px]">
            <label className="relative flex cursor-pointer items-center pl-[35px] text-base select-none">
              <input type="checkbox" className="peer absolute h-0 w-0 opacity-0" defaultChecked />
              <span className="absolute top-0 left-0 h-[25px] w-[25px] rounded-[5px] border-2 border-[#ba124f] bg-white peer-checked:bg-[#ba124f] after:absolute after:left-[9px] after:top-[5px] after:hidden after:h-[10px] after:w-[5px] after:rotate-45 after:border-r-[3px] after:border-b-[3px] after:border-white after:content-[''] peer-checked:after:block" />
              I have read and understood all the instructions
            </label>
          </div>

          <Link
            href={candidateId ? `/exam?candidateId=${candidateId}` : "/"}
            className="block w-full rounded-[30px] bg-[#ba124f] px-[30px] py-3 text-center text-base font-semibold text-white opacity-100 shadow-[0_4px_15px_rgba(186,18,79,0.3)] transition duration-300 hover:-translate-y-[3px] hover:bg-[#9a0e40] hover:shadow-[0_6px_20px_rgba(186,18,79,0.4)]"
          >
            {candidateId ? "Start Exam" : "Return to Portal"}
          </Link>
        </div>
      </main>
    </StudentPortalShell>
  );
}

export default function InstructionPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-10 text-center">Loading...</main>}>
      <InstructionPageContent />
    </Suspense>
  );
}
