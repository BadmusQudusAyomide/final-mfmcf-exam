"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { useToast } from "@/components/toast-provider";

const instructions = [
  {
    icon: FaClock,
    text: (
      <>
        Time allowed is <strong>50 minutes</strong>
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
  const router = useRouter();
  const candidateId = searchParams.get("candidateId");
  const [starting, setStarting] = useState(false);
  const { showToast } = useToast();

  function handleStartExam() {
    if (!candidateId || starting) {
      return;
    }

    setStarting(true);
    showToast({
      variant: "info",
      title: "Starting exam",
      description: "Stay on the page once the exam opens. Violations are recorded.",
    });
    router.push(`/exam?candidateId=${candidateId}`);
  }

  return (
    <StudentPortalShell
      title={"MFMCF UNIOSUN\nOSOGBO CAMPUS"}
      titleLabel="EXAM INSTRUCTIONS"
    >
      <main className="flex flex-1 items-center justify-center px-1 py-2 motion-safe:animate-[softFade_0.5s_ease-out]">
        <div className="relative w-full max-w-[860px] overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(254,250,252,0.92))] p-7 shadow-[0_24px_56px_rgba(91,16,43,0.12)] backdrop-blur max-md:p-5 max-[480px]:p-4 motion-safe:animate-[softRise_0.75s_ease-out]">
          <div className="absolute inset-x-0 top-0 h-1.5 bg-[linear-gradient(90deg,#7e1137_0%,#ba124f_55%,#d76e98_100%)]" />
          <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-[#f8dce7] blur-3xl" />
          <div className="absolute left-0 bottom-0 h-24 w-24 rounded-full bg-[#f6e8ef] blur-3xl" />

          <div className="relative">
            <div className="mx-auto mb-5 flex h-[84px] w-[84px] items-center justify-center rounded-full border border-[#f0dbe3] bg-[linear-gradient(135deg,#fff2f6_0%,#ffe5ee_100%)] text-[2.2rem] text-[#ba124f] shadow-[0_14px_28px_rgba(186,18,79,0.12)] max-md:h-[72px] max-md:w-[72px] max-md:text-[2rem]">
              <FaInfoCircle className="inline-block" />
            </div>
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#a25a77]">
                Read Carefully Before You Begin
              </p>
              <h3 className="mt-3 text-center text-[1.95rem] font-semibold text-[#7e1137] max-md:text-[1.45rem]">
                Important Instructions
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-[#675f66]">
                This quiz follows a monitored church exam flow. Once you begin, stay on the page and answer carefully. Your timer continues counting until submission.
              </p>
            </div>
          </div>

          <div className="relative mt-8 mb-7 grid gap-4 md:grid-cols-2">
            {instructions.map(({ icon: Icon, text }, index) => (
              <div
                key={index}
                className="flex items-start rounded-[24px] border border-[#f0e4e8] bg-[linear-gradient(180deg,#fffefe_0%,#fbf7f9_100%)] p-4 shadow-[0_10px_22px_rgba(91,16,43,0.05)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_16px_28px_rgba(91,16,43,0.08)] max-md:flex-col"
              >
                <div className="mr-3 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fff1f6_0%,#ffe4ec_100%)] text-[1rem] text-[#ba124f] shadow-[0_8px_18px_rgba(186,18,79,0.10)] max-md:mb-3">
                  <Icon />
                </div>
                <span className="flex-1 text-[0.95rem] leading-7 text-[#494248]">{text}</span>
              </div>
            ))}
          </div>

          <div className="my-6 rounded-[24px] border border-[#efe4e8] bg-[linear-gradient(180deg,#faf5f7_0%,#f5eef2_100%)] p-4 max-[480px]:p-3">
            <label className="relative flex cursor-pointer items-center pl-[38px] text-base leading-7 text-[#433c42] select-none">
              <input type="checkbox" className="peer absolute h-0 w-0 opacity-0" defaultChecked />
              <span className="absolute top-0.5 left-0 h-[26px] w-[26px] rounded-[8px] border-2 border-[#ba124f] bg-white peer-checked:bg-[#ba124f] after:absolute after:left-[9px] after:top-[5px] after:hidden after:h-[10px] after:w-[5px] after:rotate-45 after:border-r-[3px] after:border-b-[3px] after:border-white after:content-[''] peer-checked:after:block" />
              I have read and understood all the instructions
            </label>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm leading-7 text-[#726771]">
              When you click start, the timer begins and the quiz page becomes actively monitored.
            </p>
            <button
              type="button"
              onClick={handleStartExam}
              disabled={!candidateId || starting}
              className="inline-flex min-w-[220px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#7e1137_0%,#ba124f_100%)] px-7 py-3 text-center text-base font-semibold text-white shadow-[0_12px_28px_rgba(186,18,79,0.24)] transition duration-300 hover:-translate-y-[2px] hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {candidateId ? (starting ? "Opening Exam..." : "Start Exam") : "Return to Portal"}
            </button>
          </div>
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
