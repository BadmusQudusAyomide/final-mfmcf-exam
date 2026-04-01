"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaShieldAlt,
  FaTasks,
} from "react-icons/fa";

interface ExamPayload {
  candidate: {
    id: string;
    fullName: string;
    matricNumber: string;
    phoneNumber: string;
    department: string;
    level: string;
  };
  exam: {
    slug: string;
    title: string;
    durationMinutes: number;
    questions: Array<{
      id: string;
      prompt: string;
      order: number;
      options: string[];
    }>;
  };
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function ExamPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const candidateId = searchParams.get("candidateId");
  const [payload, setPayload] = useState<ExamPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [securityFlags, setSecurityFlags] = useState(0);
  const [activityMessage, setActivityMessage] = useState("");
  const submitReasonRef = useRef<"manual" | "auto" | null>(null);
  const latestPayloadRef = useRef<ExamPayload | null>(null);
  const latestCandidateIdRef = useRef<string | null>(null);
  const latestAnswersRef = useRef<Record<string, string>>({});
  const latestSecurityFlagsRef = useRef(0);

  useEffect(() => {
    latestPayloadRef.current = payload;
  }, [payload]);

  useEffect(() => {
    latestCandidateIdRef.current = candidateId;
  }, [candidateId]);

  useEffect(() => {
    latestAnswersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    latestSecurityFlagsRef.current = securityFlags;
  }, [securityFlags]);

  useEffect(() => {
    async function loadExam() {
      if (!candidateId) {
        router.replace("/");
        return;
      }

      try {
        const response = await fetch(`/api/exam?candidateId=${candidateId}`);
        const data = (await response.json()) as ExamPayload & { error?: string };

        if (!response.ok) {
          setErrorMessage(data.error ?? "Unable to load exam.");
          return;
        }

        setPayload(data);
        setRemainingSeconds(data.exam.durationMinutes * 60);
      } catch (error) {
        console.error(error);
        setErrorMessage("Unable to load exam.");
      } finally {
        setLoading(false);
      }
    }

    void loadExam();
  }, [candidateId, router]);

  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers],
  );

  const handleSubmit = useCallback(async (reason: "manual" | "auto" = "manual") => {
    const currentPayload = latestPayloadRef.current;
    const currentCandidateId = latestCandidateIdRef.current;
    const currentAnswers = latestAnswersRef.current;
    const currentSecurityFlags = latestSecurityFlagsRef.current;

    if (!currentPayload || !currentCandidateId) {
      return;
    }

    if (submitReasonRef.current) {
      return;
    }

    submitReasonRef.current = reason;
    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateId: currentCandidateId,
          examSlug: currentPayload.exam.slug,
          securityFlags: currentSecurityFlags,
          answers: currentPayload.exam.questions.map((question) => ({
            questionId: question.id,
            selectedOption: currentAnswers[question.id],
          })),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setErrorMessage(data.error ?? "Unable to submit exam.");
        submitReasonRef.current = null;
        return;
      }

      router.push(`/result?candidateId=${currentCandidateId}`);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        reason === "auto"
          ? "The exam tried to auto-submit after a violation, but it could not be saved immediately."
          : "Unable to submit exam.",
      );
      submitReasonRef.current = null;
    } finally {
      setSubmitting(false);
    }
  }, [router]);

  useEffect(() => {
    if (!payload || submitting || submitReasonRef.current) {
      return;
    }

    const timer = window.setInterval(() => {
      setRemainingSeconds((current) => {
        if (current <= 1) {
          window.clearInterval(timer);
          setActivityMessage("Time is up. The exam is being submitted automatically.");
          void handleSubmit("auto");
          return 0;
        }

        return current - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [payload, submitting, handleSubmit]);

  useEffect(() => {
    if (!payload || submitReasonRef.current) {
      return;
    }

    function registerViolation(message: string, shouldAutoSubmit = false) {
      setSecurityFlags((current) => current + 1);
      setActivityMessage(message);

      if (shouldAutoSubmit) {
        void handleSubmit("auto");
      }
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden" && !submitReasonRef.current) {
        registerViolation(
          "You left or minimized the exam page. The exam is being submitted automatically.",
          true,
        );
      }
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (submitReasonRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
      registerViolation(
        "Leaving the exam page is not allowed. Your activity has been recorded.",
      );
    }

    function handleContextMenu(event: MouseEvent) {
      event.preventDefault();
      registerViolation("Right-click is disabled during the exam. This activity has been recorded.");
    }

    function handleClipboardEvent(event: ClipboardEvent) {
      event.preventDefault();
      registerViolation("Copy, cut, and paste are disabled during the exam. This activity has been recorded.");
    }

    function handleKeyDown(event: KeyboardEvent) {
      const loweredKey = event.key.toLowerCase();
      const blockedShortcut =
        event.key === "F12" ||
        ((event.ctrlKey || event.metaKey) && ["c", "x", "v", "u", "p", "s"].includes(loweredKey)) ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(loweredKey));

      if (blockedShortcut) {
        event.preventDefault();
        registerViolation("Restricted keyboard activity was detected and recorded.");
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleClipboardEvent);
    window.addEventListener("cut", handleClipboardEvent);
    window.addEventListener("paste", handleClipboardEvent);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleClipboardEvent);
      window.removeEventListener("cut", handleClipboardEvent);
      window.removeEventListener("paste", handleClipboardEvent);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [payload, handleSubmit]);

  if (loading) {
    return <main className="min-h-screen bg-[#f5f7fa] p-10 text-center">Loading exam...</main>;
  }

  if (!payload) {
    return <main className="min-h-screen bg-[#f5f7fa] p-10 text-center">{errorMessage || "Exam unavailable."}</main>;
  }

  return (
    <main className="min-h-screen bg-[#f5f7fa] text-[#333]">
      <header className="relative bg-[#ba124f] px-5 py-5 text-center text-white shadow-[0_4px_6px_rgba(0,0,0,0.1)]">
        <h1 className="m-0 text-[1.8rem] font-bold uppercase tracking-[1px] max-md:text-[1.4rem]">
          MFMCF Uniosun Osogbo Discipleship/Stewardship Class Exam
        </h1>
        <div className="mt-[15px] inline-flex items-center rounded-lg bg-white px-5 py-[10px] font-semibold text-[#ba124f] shadow-[0_4px_8px_rgba(0,0,0,0.15)]">
          <FaClock className="mr-[10px] text-[#ba124f]" />
          <span>{formatTime(remainingSeconds)}</span>
          <span className="ml-1">remaining</span>
        </div>
      </header>

      <div className="mx-auto my-[30px] flex w-[90%] max-w-[800px] flex-col rounded-[10px] bg-white p-[30px] shadow-[0_4px_15px_rgba(0,0,0,0.1)] max-md:w-[95%] max-md:p-5">
        <section className="mt-0 rounded-lg bg-white p-[15px] text-left shadow-[0_4px_10px_rgba(0,0,0,0.1)] max-md:p-[10px]">
          <h3 className="mb-[10px] border-b-2 border-[#eee] pb-[5px] text-[1.2rem] text-[#ba124f]">
            Candidate Information
          </h3>
          <div className="mb-2 flex">
            <div className="w-[120px] font-semibold text-[#555] max-md:w-[100px]">Name:</div>
            <div>{payload.candidate.fullName}</div>
          </div>
          <div className="mb-2 flex">
            <div className="w-[120px] font-semibold text-[#555] max-md:w-[100px]">Matric No:</div>
            <div>{payload.candidate.matricNumber}</div>
          </div>
          <div className="mb-2 flex">
            <div className="w-[120px] font-semibold text-[#555] max-md:w-[100px]">Department:</div>
            <div>{payload.candidate.department}</div>
          </div>
          <div className="mb-2 flex">
            <div className="w-[120px] font-semibold text-[#555] max-md:w-[100px]">Level:</div>
            <div>{payload.candidate.level}</div>
          </div>
        </section>

        <section className="mt-[15px] flex justify-between rounded-lg bg-[#f0f0f0] px-[15px] py-[10px] max-md:flex-col max-md:gap-3">
          <div className="flex items-center gap-2">
            <FaTasks />
            <span>
              Question 1-{payload.exam.questions.length} of {payload.exam.questions.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaCheckCircle />
            <span>{answeredCount} answered</span>
          </div>
        </section>

        <section className="mt-[15px] rounded-lg border border-[#f1d8de] bg-[#fff4f8] px-[15px] py-[12px] text-sm text-[#7e1137]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 font-semibold">
              <FaShieldAlt />
              <span>Exam protection is active</span>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-[#7e1137] px-3 py-1 text-xs font-semibold text-white">
              <FaExclamationTriangle />
              <span>{securityFlags} flagged activities</span>
            </div>
          </div>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-[#655a61]">
            <li>You must stay on this exam page until submission.</li>
            <li>Leaving or minimizing the page will trigger automatic submission.</li>
            <li>Abnormal activities like copy, paste, right-click, and restricted shortcuts are recorded.</li>
          </ul>
        </section>

        <div className="my-[15px] text-center font-medium text-[#666]">Page 1 of 1</div>

        <section className="mb-[25px] rounded-lg border-l-[5px] border-l-[#ba124f] bg-[#f9f9f9] p-[25px] max-md:p-[15px]">
          {payload.exam.questions.map((question, questionIndex) => (
            <article
              key={question.id}
              className="mb-5 rounded-lg bg-white p-[15px] text-left shadow-[0_2px_4px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-[2px] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
            >
              <div className="mb-[15px]">
                <p>
                  <strong>
                    {questionIndex + 1}. {question.prompt}
                  </strong>
                </p>
              </div>
              <div className="mt-[15px] flex flex-col gap-3">
                {question.options.map((option) => (
                  <label
                    key={option}
                    className="flex cursor-pointer items-center rounded-md bg-[#f5f5f5] px-[15px] py-[10px] transition duration-200 hover:bg-[#eaeaea]"
                  >
                    <input
                      type="radio"
                      name={question.id}
                      className="mr-3 scale-[1.2]"
                      checked={answers[question.id] === option}
                      onChange={() =>
                        setAnswers((current) => ({
                          ...current,
                          [question.id]: option,
                        }))
                      }
                    />
                    <span className="flex-1">{option}</span>
                  </label>
                ))}
              </div>
            </article>
          ))}
        </section>

        {errorMessage ? (
          <p className="mb-4 rounded-md bg-[rgba(244,67,54,0.08)] px-4 py-3 text-sm text-[#f44336]">
            {errorMessage}
          </p>
        ) : null}

        {activityMessage ? (
          <p className="mb-4 rounded-md bg-[rgba(186,18,79,0.08)] px-4 py-3 text-sm text-[#ba124f]">
            {activityMessage}
          </p>
        ) : null}

        <div className="mt-[25px] flex justify-between gap-[15px] max-md:flex-col">
          <button
            type="button"
            className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-[5px] bg-[#ccc] px-[25px] py-3 text-[0.95rem] font-semibold text-white"
            disabled
          >
            <FaArrowLeft /> Previous
          </button>
          <button
            type="button"
            className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-[5px] bg-[#ccc] px-[25px] py-3 text-[0.95rem] font-semibold text-white"
            disabled
          >
            Next <FaArrowRight />
          </button>
          <button
            type="button"
            onClick={() => void handleSubmit("manual")}
            disabled={submitting}
            className="flex flex-1 items-center justify-center gap-2 rounded-[5px] bg-[#27ae60] px-[25px] py-3 text-[0.95rem] font-semibold text-white transition duration-200 hover:bg-[#219653] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <FaCheck /> {submitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </div>

      <footer className="mt-auto bg-[#ba124f] px-[15px] py-[15px] text-center text-[0.85rem] text-white">
        <p className="my-[3px]">&copy; 2025 MFMCF Uniosun</p>
        <p className="my-[3px] font-semibold text-[#f0f0f0]">Powered by MFMCF Uniosun ICT</p>
      </footer>
    </main>
  );
}

export default function ExamPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-[#f5f7fa] p-10 text-center">Loading exam...</main>}>
      <ExamPageContent />
    </Suspense>
  );
}
