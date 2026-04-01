"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FaArrowLeft,
  FaArrowRight,
  FaCheck,
  FaCheckCircle,
  FaClock,
  FaExclamationTriangle,
  FaInfoCircle,
  FaShieldAlt,
  FaTasks,
} from "react-icons/fa";
import { useToast } from "@/components/toast-provider";

const QUESTIONS_PER_PAGE = 10;
const WARNING_THRESHOLDS = [900, 300, 60] as const;

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
  session: {
    id: string;
    status: string;
    expiresAt: string;
    completedAt: string | null;
  };
}

interface PersistedProgress {
  answers: Record<string, string>;
  currentPage: number;
  securityFlags: number;
  expiresAt: string;
}

function formatTime(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getProgressKey(candidateId: string) {
  return `mfmcf_exam_progress_${candidateId}`;
}

function getSubmissionNoticeKey(candidateId: string) {
  return `mfmcf_submission_notice_${candidateId}`;
}

function getCompletionPercentage(answeredCount: number, totalQuestions: number) {
  if (totalQuestions <= 0) {
    return 0;
  }

  return Math.round((answeredCount / totalQuestions) * 100);
}

function ExamPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const candidateId = searchParams.get("candidateId");
  const { showToast } = useToast();
  const [payload, setPayload] = useState<ExamPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [blockedMessage, setBlockedMessage] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [currentPage, setCurrentPage] = useState(0);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [securityFlags, setSecurityFlags] = useState(0);
  const [activityMessage, setActivityMessage] = useState("");
  const submitReasonRef = useRef<"manual" | "auto" | null>(null);
  const latestPayloadRef = useRef<ExamPayload | null>(null);
  const latestCandidateIdRef = useRef<string | null>(null);
  const latestAnswersRef = useRef<Record<string, string>>({});
  const latestSecurityFlagsRef = useRef(0);
  const latestCurrentPageRef = useRef(0);
  const expiresAtRef = useRef<string | null>(null);
  const countdownWarningsRef = useRef<Set<number>>(new Set());

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
    latestCurrentPageRef.current = currentPage;
  }, [currentPage]);

  const persistProgress = useCallback(() => {
    const currentCandidateId = latestCandidateIdRef.current;
    const expiresAt = expiresAtRef.current;

    if (!currentCandidateId || !expiresAt || submitReasonRef.current) {
      return;
    }

    const progress: PersistedProgress = {
      answers: latestAnswersRef.current,
      currentPage: latestCurrentPageRef.current,
      securityFlags: latestSecurityFlagsRef.current,
      expiresAt,
    };

    window.localStorage.setItem(getProgressKey(currentCandidateId), JSON.stringify(progress));
  }, []);

  const clearProgress = useCallback(() => {
    const currentCandidateId = latestCandidateIdRef.current;
    if (!currentCandidateId) {
      return;
    }

    window.localStorage.removeItem(getProgressKey(currentCandidateId));
  }, []);

  const saveSubmissionNotice = useCallback(
    (
      reason: "manual" | "auto",
      options?: {
        title?: string;
        description?: string;
        variant?: "success" | "warning" | "error" | "info";
      },
    ) => {
      const currentCandidateId = latestCandidateIdRef.current;
      if (!currentCandidateId) {
        return;
      }

      window.localStorage.setItem(
        getSubmissionNoticeKey(currentCandidateId),
        JSON.stringify({
          variant: options?.variant ?? (reason === "auto" ? "warning" : "success"),
          title: options?.title ?? (reason === "auto" ? "Quiz auto-submitted" : "Quiz submitted"),
          description:
            options?.description ??
            (reason === "auto"
              ? "Your answers were submitted automatically because the exam rules were triggered."
              : "Your answers have been saved successfully."),
        }),
      );
    },
    [],
  );

  const handleSubmit = useCallback(
    async (
      reason: "manual" | "auto" = "manual",
      options?: {
        title?: string;
        description?: string;
        variant?: "success" | "warning" | "error" | "info";
        securityFlagDelta?: number;
      },
    ) => {
      const currentPayload = latestPayloadRef.current;
      const currentCandidateId = latestCandidateIdRef.current;
      const currentAnswers = latestAnswersRef.current;
      const currentSecurityFlags = latestSecurityFlagsRef.current;

      if (!currentPayload || !currentCandidateId || submitReasonRef.current) {
        return;
      }

      submitReasonRef.current = reason;
      setSubmitting(true);
      setErrorMessage("");

      if (reason === "manual") {
        showToast({
          variant: "info",
          title: "Submitting quiz",
          description: "Please wait while your answers are being saved.",
        });
      }

      try {
        const response = await fetch("/api/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            candidateId: currentCandidateId,
            examSlug: currentPayload.exam.slug,
            securityFlags: currentSecurityFlags + (options?.securityFlagDelta ?? 0),
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

        clearProgress();
        showToast({
          variant: options?.variant ?? (reason === "auto" ? "warning" : "success"),
          title: options?.title ?? (reason === "auto" ? "Quiz auto-submitted" : "Quiz submitted"),
          description:
            options?.description ??
            (reason === "auto"
              ? "Your answers were submitted automatically because of a rule violation or timeout."
              : "Your answers have been saved successfully."),
        });
        saveSubmissionNotice(reason, options);
        router.replace(`/result?candidateId=${currentCandidateId}`);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          reason === "auto"
            ? "The quiz tried to auto-submit but could not be saved immediately."
            : "Unable to submit quiz.",
        );
        submitReasonRef.current = null;
      } finally {
        setSubmitting(false);
      }
    },
    [clearProgress, router, saveSubmissionNotice, showToast],
  );

  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) {
        window.location.reload();
      }
    }

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    async function loadExam() {
      if (!candidateId) {
        router.replace("/");
        return;
      }

      setLoading(true);
      setBlockedMessage("");
      setErrorMessage("");

      try {
        const response = await fetch(`/api/exam?candidateId=${candidateId}`, {
          cache: "no-store",
        });
        const data = (await response.json()) as
          | (ExamPayload & { error?: string; code?: string })
          | { error?: string; code?: string };

        if (!response.ok) {
          if (response.status === 409 && "code" in data && data.code === "ALREADY_SUBMITTED") {
            setBlockedMessage(data.error ?? "You have already attempted this quiz.");
            showToast({
              variant: "warning",
              title: "Quiz already attempted",
              description: "This candidate session has already been used.",
            });
            return;
          }

          setErrorMessage(data.error ?? "Unable to load exam.");
          return;
        }

        const examData = data as ExamPayload;
        setPayload(examData);
        expiresAtRef.current = examData.session.expiresAt;
        countdownWarningsRef.current = new Set();

        const storedProgress = window.localStorage.getItem(getProgressKey(candidateId));
        if (storedProgress) {
          try {
            const parsed = JSON.parse(storedProgress) as PersistedProgress;
            setAnswers(parsed.answers ?? {});
            setCurrentPage(
              Math.min(
                Math.max(parsed.currentPage ?? 0, 0),
                Math.max(Math.ceil(examData.exam.questions.length / QUESTIONS_PER_PAGE) - 1, 0),
              ),
            );
            setSecurityFlags(parsed.securityFlags ?? 0);
            expiresAtRef.current = parsed.expiresAt || examData.session.expiresAt;
            showToast({
              variant: "info",
              title: "Progress restored",
              description: "Your saved answers were restored for this session.",
            });
          } catch (error) {
            console.error(error);
            window.localStorage.removeItem(getProgressKey(candidateId));
            setAnswers({});
            setCurrentPage(0);
            setSecurityFlags(0);
          }
        } else {
          setAnswers({});
          setCurrentPage(0);
          setSecurityFlags(0);
          showToast({
            variant: "success",
            title: "Quiz loaded",
            description: "Answer each page and use Next to move through the quiz.",
          });
        }

        const secondsLeft = Math.floor(
          (new Date(expiresAtRef.current).getTime() - Date.now()) / 1000,
        );
        setRemainingSeconds(Math.max(0, secondsLeft));
      } catch (error) {
        console.error(error);
        setErrorMessage("Unable to load exam.");
      } finally {
        setLoading(false);
      }
    }

    void loadExam();
  }, [candidateId, router, showToast]);

  useEffect(() => {
    if (!candidateId || !payload) {
      return;
    }

    persistProgress();
  }, [answers, candidateId, currentPage, payload, persistProgress, securityFlags]);

  useEffect(() => {
    if (!payload || !expiresAtRef.current || submitReasonRef.current) {
      return;
    }

    const timer = window.setInterval(() => {
      const secondsLeft = Math.floor(
        (new Date(expiresAtRef.current!).getTime() - Date.now()) / 1000,
      );

      if (secondsLeft <= 0) {
        window.clearInterval(timer);
        setRemainingSeconds(0);
        setActivityMessage("Time is up. Your quiz is being submitted automatically.");
        void handleSubmit("auto", {
          title: "Time is up",
          description: "Your quiz time ended, so your answers were submitted automatically.",
          variant: "warning",
        });
        return;
      }

      for (const threshold of WARNING_THRESHOLDS) {
        if (secondsLeft <= threshold && !countdownWarningsRef.current.has(threshold)) {
          countdownWarningsRef.current.add(threshold);
          const minutesLeft = Math.ceil(threshold / 60);
          showToast({
            variant: threshold <= 60 ? "warning" : "info",
            title: threshold <= 60 ? "Final minute" : "Time reminder",
            description:
              threshold <= 60
                ? "You have less than one minute left. Please review quickly."
                : `${minutesLeft} minute${minutesLeft > 1 ? "s" : ""} left. Your answers remain saved as you move through the quiz.`,
          });
        }
      }

      setRemainingSeconds(secondsLeft);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [handleSubmit, payload, showToast]);

  useEffect(() => {
    if (!payload || submitReasonRef.current) {
      return;
    }

    function raiseViolation(
      message: string,
      variant: "warning" | "error" = "warning",
      shouldAutoSubmit = false,
    ) {
      setSecurityFlags((current) => current + 1);
      setActivityMessage(message);
      showToast({
        variant,
        title: shouldAutoSubmit ? "Violation detected" : "Restricted action blocked",
        description: message,
      });

      if (shouldAutoSubmit) {
        void handleSubmit("auto", {
          title: "Quiz auto-submitted",
          description: message,
          variant,
          securityFlagDelta: 1,
        });
      }
    }

    function sendKeepaliveSubmission() {
      const currentPayload = latestPayloadRef.current;
      const currentCandidateId = latestCandidateIdRef.current;

      if (!currentPayload || !currentCandidateId || submitReasonRef.current) {
        return;
      }

      submitReasonRef.current = "auto";
      saveSubmissionNotice("auto", {
        title: "Quiz auto-submitted",
        description:
          "You left the quiz page, so your current answers were submitted automatically.",
        variant: "warning",
      });

      const body = JSON.stringify({
        candidateId: currentCandidateId,
        examSlug: currentPayload.exam.slug,
        securityFlags: latestSecurityFlagsRef.current + 1,
        answers: currentPayload.exam.questions.map((question) => ({
          questionId: question.id,
          selectedOption: latestAnswersRef.current[question.id],
        })),
      });

      const blob = new Blob([body], { type: "application/json" });
      navigator.sendBeacon("/api/submit", blob);
      clearProgress();
    }

    function handleVisibilityChange() {
      if (document.visibilityState === "hidden" && !submitReasonRef.current) {
        setSecurityFlags((current) => current + 1);
        setActivityMessage(
          "You left or minimized the quiz page. Your answers are being submitted automatically.",
        );
        persistProgress();
        void handleSubmit("auto", {
          title: "Quiz auto-submitted",
          description:
            "You left or minimized the quiz page, so your current answers were submitted automatically.",
          variant: "warning",
          securityFlagDelta: 1,
        });

        window.setTimeout(() => {
          if (!submitReasonRef.current) {
            sendKeepaliveSubmission();
          }
        }, 250);
      }
    }

    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (submitReasonRef.current) {
        return;
      }

      event.preventDefault();
      event.returnValue = "";
      persistProgress();
      sendKeepaliveSubmission();
    }

    function handleContextMenu(event: MouseEvent) {
      event.preventDefault();
      raiseViolation("Right-click is disabled during the quiz. This activity was recorded.");
    }

    function handleClipboard(event: ClipboardEvent) {
      event.preventDefault();
      raiseViolation("Copy, cut, and paste are disabled during the quiz. This activity was recorded.");
    }

    function handleKeyDown(event: KeyboardEvent) {
      const loweredKey = event.key.toLowerCase();
      const blockedShortcut =
        event.key === "F12" ||
        ((event.ctrlKey || event.metaKey) &&
          ["c", "x", "v", "u", "p", "s"].includes(loweredKey)) ||
        (event.ctrlKey && event.shiftKey && ["i", "j", "c"].includes(loweredKey));

      if (blockedShortcut) {
        event.preventDefault();
        raiseViolation("Restricted keyboard activity was blocked and recorded.");
      }
    }

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleClipboard);
    window.addEventListener("cut", handleClipboard);
    window.addEventListener("paste", handleClipboard);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleClipboard);
      window.removeEventListener("cut", handleClipboard);
      window.removeEventListener("paste", handleClipboard);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [clearProgress, handleSubmit, payload, persistProgress, saveSubmissionNotice, showToast]);

  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers],
  );
  const completionPercentage = payload
    ? getCompletionPercentage(answeredCount, payload.exam.questions.length)
    : 0;

  const pageCount = payload ? Math.ceil(payload.exam.questions.length / QUESTIONS_PER_PAGE) : 0;
  const pageQuestions = payload
    ? payload.exam.questions.slice(
        currentPage * QUESTIONS_PER_PAGE,
        currentPage * QUESTIONS_PER_PAGE + QUESTIONS_PER_PAGE,
      )
    : [];

  const pageStart = currentPage * QUESTIONS_PER_PAGE + 1;
  const pageEnd = payload ? Math.min(pageStart + QUESTIONS_PER_PAGE - 1, payload.exam.questions.length) : 0;

  if (loading) {
    return <main className="min-h-screen bg-[#f5f7fa] p-10 text-center">Loading exam...</main>;
  }

  if (blockedMessage) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,#fff5f8_0%,#f6f8fb_45%,#eef2f8_100%)] px-5 py-10 text-[#333]">
        <section className="w-full max-w-xl rounded-[28px] border border-[#f0d9e0] bg-white/90 p-8 text-center shadow-[0_24px_60px_rgba(126,17,55,0.12)] backdrop-blur">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#fff3f6] text-2xl text-[#ba124f]">
            <FaExclamationTriangle />
          </div>
          <h1 className="mt-5 text-3xl font-bold text-[#7e1137]">Quiz Already Attempted</h1>
          <p className="mt-4 text-sm leading-7 text-[#655a61]">{blockedMessage}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <Link
              href={candidateId ? `/result?candidateId=${candidateId}` : "/"}
              className="rounded-2xl bg-[#7e1137] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#65102d]"
            >
              View Result
            </Link>
            <Link
              href="/"
              className="rounded-2xl border border-[#e3d5da] bg-white px-5 py-3 text-sm font-semibold text-[#7e1137] transition hover:bg-[#faf4f7]"
            >
              Return Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  if (!payload) {
    return (
      <main className="min-h-screen bg-[#f5f7fa] p-10 text-center">
        {errorMessage || "Exam unavailable."}
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,#fff7fa_0%,#f7f9fc_42%,#edf2f8_100%)] text-[#333]">
      <header className="relative overflow-hidden border-b border-[#d88aa8]/25 bg-[linear-gradient(135deg,#7e1137_0%,#a51752_38%,#ba124f_72%,#cf4f7d_100%)] px-5 py-8 text-white shadow-[0_18px_44px_rgba(126,17,55,0.22)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15),transparent_28%)]" />
        <div className="absolute inset-x-0 bottom-0 h-px bg-white/25" />
        <div className="relative mx-auto max-w-[1180px]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/70">
                MFMCF UNIOSUN Osogbo Campus
              </p>
              <h1 className="mt-3 text-[2rem] font-bold uppercase tracking-[0.06em] max-md:text-[1.5rem]">
                Discipleship/Stewardship Class Quiz
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-white/84">
                Stay on this page until submission. The timer keeps counting in the background, your progress is preserved as you move across pages, and restricted activity is monitored.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[420px]">
              <div className="rounded-[24px] border border-white/18 bg-white/14 px-5 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/18 p-3 text-white">
                    <FaClock />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
                      Time Left
                    </p>
                    <p className="mt-1 text-2xl font-bold tabular-nums">{formatTime(remainingSeconds)}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[24px] border border-white/18 bg-white/14 px-5 py-4 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-white/18 p-3 text-white">
                    <FaShieldAlt />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white/65">
                      Security Flags
                    </p>
                    <p className="mt-1 text-2xl font-bold">{securityFlags}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 md:grid-cols-3">
            <div className="rounded-[22px] border border-white/16 bg-white/10 px-4 py-4 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">
                Completion
              </p>
              <div className="mt-3 overflow-hidden rounded-full bg-white/15">
                <div
                  className="relative h-3 rounded-full bg-[linear-gradient(90deg,#ffdce8_0%,#ffffff_100%)]"
                  style={{ width: `${completionPercentage}%` }}
                >
                  <span className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.55),transparent)] motion-safe:animate-[shimmer_2.2s_linear_infinite]" />
                </div>
              </div>
              <p className="mt-3 text-sm font-medium text-white/88">
                {answeredCount} of {payload.exam.questions.length} answered
              </p>
            </div>
            <div className="rounded-[22px] border border-white/16 bg-white/10 px-4 py-4 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">
                Current Page
              </p>
              <p className="mt-3 text-2xl font-bold">
                {currentPage + 1}
                <span className="ml-2 text-sm font-medium text-white/68">of {pageCount}</span>
              </p>
              <p className="mt-1 text-sm text-white/78">
                Questions {pageStart}-{pageEnd}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/16 bg-white/10 px-4 py-4 backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/65">
                Session Rules
              </p>
              <p className="mt-3 text-sm leading-6 text-white/82">
                Leaving the page, minimizing the window, or using blocked shortcuts can trigger an automatic submission.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-[92%] max-w-[1180px] gap-6 py-8 xl:grid-cols-[320px_1fr]">
        <aside className="space-y-5 xl:sticky xl:top-6 xl:self-start">
          <section className="rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(255,248,251,0.9))] p-5 shadow-[0_18px_42px_rgba(91,16,43,0.08)] backdrop-blur">
            <h3 className="border-b border-[#eee] pb-3 text-lg font-semibold text-[#ba124f]">
              Candidate Information
            </h3>
            <div className="mt-4 grid gap-3 text-sm text-[#564d54]">
              <div className="rounded-2xl bg-white/80 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7f8c]">Name</p>
                <p className="mt-1 font-semibold text-[#2f2930]">{payload.candidate.fullName}</p>
              </div>
              <div className="rounded-2xl bg-white/80 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7f8c]">Matric No</p>
                <p className="mt-1 font-semibold text-[#2f2930]">{payload.candidate.matricNumber}</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/80 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7f8c]">Department</p>
                  <p className="mt-1 font-semibold text-[#2f2930]">{payload.candidate.department}</p>
                </div>
                <div className="rounded-2xl bg-white/80 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7f8c]">Level</p>
                  <p className="mt-1 font-semibold text-[#2f2930]">{payload.candidate.level}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[28px] border border-[#f0dde4] bg-[linear-gradient(180deg,#fff9fb_0%,#fff4f8_100%)] p-5 shadow-[0_16px_34px_rgba(91,16,43,0.06)]">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-[#a14e6a]">
              <FaInfoCircle />
              Active Rules
            </div>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-[#655a61]">
              <li className="rounded-2xl bg-white/75 px-4 py-3">
                You cannot leave or minimize the quiz page without triggering an auto-submit.
              </li>
              <li className="rounded-2xl bg-white/75 px-4 py-3">
                Copy, paste, right-click, and restricted shortcuts are blocked and recorded.
              </li>
              <li className="rounded-2xl bg-white/75 px-4 py-3">
                The timer keeps counting until the session expires, even if you try to leave.
              </li>
            </ul>
          </section>

          <section className="rounded-[28px] border border-white/65 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(250,246,248,0.9))] p-5 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-[#ba124f]">
                <FaTasks />
                <span className="font-semibold">Pages</span>
              </div>
              <span className="text-sm font-semibold text-[#655a61]">
                {answeredCount}/{payload.exam.questions.length} answered
              </span>
            </div>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {Array.from({ length: pageCount }).map((_, index) => {
                const start = index * QUESTIONS_PER_PAGE;
                const end = Math.min(start + QUESTIONS_PER_PAGE, payload.exam.questions.length);
                const pageAnswered = payload.exam.questions
                  .slice(start, end)
                  .filter((question) => Boolean(answers[question.id])).length;
                const active = index === currentPage;

                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentPage(index)}
                    className={`rounded-2xl px-3 py-3 text-sm font-semibold transition ${
                      active
                        ? "bg-[linear-gradient(135deg,#7e1137_0%,#ba124f_100%)] text-white shadow-[0_14px_28px_rgba(126,17,55,0.18)]"
                        : "bg-[#f6f0f3] text-[#7e1137] hover:bg-[#f1e2e9]"
                    }`}
                  >
                    {index + 1}
                    <span className="mt-1 block text-[11px] font-medium opacity-80">
                      {pageAnswered}/{end - start}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        </aside>

        <section className="rounded-[34px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(253,250,251,0.92))] p-6 shadow-[0_24px_54px_rgba(91,16,43,0.10)] backdrop-blur max-md:p-4">
          <div className="flex flex-col gap-4 rounded-[26px] border border-[#efe4e8] bg-[linear-gradient(180deg,#fbf7f9_0%,#f7f2f5_100%)] px-5 py-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2 text-[#7e1137]">
              <FaTasks />
              <span className="font-semibold">
                Questions {pageStart}-{pageEnd} of {payload.exam.questions.length}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[#655a61]">
              <FaCheckCircle />
              <span className="text-sm font-medium">
                Page {currentPage + 1} of {pageCount}
              </span>
            </div>
          </div>

          {errorMessage ? (
            <p className="mt-5 rounded-[22px] border border-[rgba(216,67,67,0.14)] bg-[rgba(244,67,54,0.08)] px-4 py-3 text-sm text-[#d84343]">
              {errorMessage}
            </p>
          ) : null}

          {activityMessage ? (
            <p className="mt-5 rounded-[22px] border border-[rgba(186,18,79,0.12)] bg-[rgba(186,18,79,0.08)] px-4 py-3 text-sm text-[#ba124f]">
              {activityMessage}
            </p>
          ) : null}

          <div className="mt-6 space-y-6">
            {pageQuestions.map((question, pageIndex) => (
              <article
                key={question.id}
                className="group rounded-[28px] border border-[#f0e6ea] bg-[linear-gradient(180deg,#fffefe_0%,#fff8fb_100%)] p-5 shadow-[0_10px_22px_rgba(91,16,43,0.04)] transition hover:-translate-y-[2px] hover:shadow-[0_18px_34px_rgba(91,16,43,0.08)]"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#fff2f6_0%,#ffe4ec_100%)] font-semibold text-[#ba124f] shadow-[0_8px_18px_rgba(186,18,79,0.10)]">
                    {pageStart + pageIndex}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-[#fff1f6] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a24c6c]">
                        Question {pageStart + pageIndex}
                      </span>
                      {answers[question.id] ? (
                        <span className="rounded-full bg-[#edf9f0] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#2f8e4b]">
                          Answered
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#fff5e9] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b26f22]">
                          Pending
                        </span>
                      )}
                    </div>
                    <p className="mt-4 text-[1rem] leading-7 font-semibold text-[#2f2930]">
                      {question.prompt}
                    </p>
                    <div className="mt-5 grid gap-3">
                      {question.options.map((option) => (
                        <label
                          key={option}
                          className={`flex cursor-pointer items-center rounded-2xl border px-4 py-3 transition ${
                            answers[question.id] === option
                              ? "border-[#ba124f] bg-[linear-gradient(180deg,#fff4f8_0%,#ffeef4_100%)] shadow-[0_10px_20px_rgba(186,18,79,0.10)]"
                              : "border-[#ebe4e7] bg-[#fbf9fa] hover:border-[#d8c4cc] hover:bg-[#f6f1f4] group-hover:border-[#e5d5db]"
                          }`}
                        >
                          <input
                            type="radio"
                            name={question.id}
                            className="mr-3 scale-[1.2] accent-[#ba124f]"
                            checked={answers[question.id] === option}
                            onChange={() =>
                              setAnswers((current) => ({
                                ...current,
                                [question.id]: option,
                              }))
                            }
                          />
                          <span className="flex-1 text-sm leading-6 text-[#4a4248]">{option}</span>
                          {answers[question.id] === option ? (
                            <span className="ml-3 rounded-full bg-[#ba124f] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-white">
                              Selected
                            </span>
                          ) : null}
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-4 border-t border-[#eee6ea] pt-6 md:flex-row md:items-center md:justify-between">
            <button
              type="button"
              onClick={() => {
                setCurrentPage((current) => Math.max(current - 1, 0));
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#e4d7dc] bg-[#f4ecef] px-5 py-3 text-sm font-semibold text-[#7e1137] transition hover:bg-[#ecdee4] disabled:cursor-not-allowed disabled:opacity-60"
              disabled={currentPage === 0}
            >
              <FaArrowLeft /> Previous 10
            </button>

            <div className="flex flex-col gap-3 md:flex-row">
              {currentPage < pageCount - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage((current) => Math.min(current + 1, pageCount - 1));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                    showToast({
                      variant: "info",
                      title: "Progress saved",
                      description: "Your selected answers remain saved as you move to the next page.",
                    });
                  }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#7e1137_0%,#ba124f_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(126,17,55,0.18)] transition hover:brightness-[1.03]"
                >
                  Next 10 <FaArrowRight />
                </button>
              ) : null}

              <button
                type="button"
                onClick={() => void handleSubmit("manual")}
                disabled={submitting}
                className="flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1f8f4d_0%,#27ae60_100%)] px-5 py-3 text-sm font-semibold text-white shadow-[0_12px_26px_rgba(39,174,96,0.20)] transition hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaCheck /> {submitting ? "Submitting..." : currentPage === pageCount - 1 ? "Submit Quiz" : "Submit Now"}
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-xs uppercase tracking-[0.18em] text-[#9a8590]">
            Progress is saved locally as you navigate this quiz.
          </p>
        </section>
      </div>

      <footer className="mt-auto bg-[#ba124f] px-[15px] py-[16px] text-center text-[0.85rem] text-white">
        <p className="my-[3px]">&copy; 2026 MFMCF Uniosun</p>
        <p className="my-[3px] font-semibold text-[#f7e9f0]">Powered by MFMCF Uniosun ICT</p>
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
