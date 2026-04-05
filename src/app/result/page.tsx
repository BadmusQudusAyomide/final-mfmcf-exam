"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  FaCheck,
  FaChurch,
  FaFilePdf,
  FaListOl,
  FaPrint,
  FaQuestion,
  FaTimes,
  FaUserGraduate,
} from "react-icons/fa";
import { useToast } from "@/components/toast-provider";

interface ResultPayload {
  candidate: {
    fullName: string;
    matricNumber: string;
    phoneNumber: string;
    department: string;
    level: string;
  };
  submission: {
    score: number;
    totalQuestions: number;
    submittedAt: string;
  };
  questions: Array<{
    id: string;
    prompt: string;
    explanation?: string | null;
    correctAnswer: string;
    userAnswer: string | null;
    isCorrect: boolean;
  }>;
}

function getScoreTone(percentage: number) {
  if (percentage >= 70) {
    return {
      ring: "#4caf50",
      glow: "shadow-[0_18px_36px_rgba(76,175,80,0.18)]",
      badge: "bg-[rgba(76,175,80,0.12)] text-[#2f8e4b]",
    };
  }

  if (percentage >= 40) {
    return {
      ring: "#ff9800",
      glow: "shadow-[0_18px_36px_rgba(255,152,0,0.18)]",
      badge: "bg-[rgba(255,152,0,0.12)] text-[#b26f22]",
    };
  }

  return {
    ring: "#f44336",
    glow: "shadow-[0_18px_36px_rgba(244,67,54,0.16)]",
    badge: "bg-[rgba(244,67,54,0.10)] text-[#d84343]",
  };
}

function ResultPageContent() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidateId");
  const { showToast } = useToast();
  const [payload, setPayload] = useState<ResultPayload | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const resultContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    async function loadResult() {
      if (!candidateId) {
        setErrorMessage("No candidate result was requested.");
        return;
      }

      try {
        const response = await fetch(`/api/result?candidateId=${candidateId}`);
        const data = (await response.json()) as ResultPayload & { error?: string };

        if (!response.ok) {
          setErrorMessage(data.error ?? "Unable to load result.");
          return;
        }

        setPayload(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Unable to load result.");
      }
    }

    void loadResult();
  }, [candidateId]);

  useEffect(() => {
    if (!candidateId || !payload) {
      return;
    }

    const noticeKey = `mfmcf_submission_notice_${candidateId}`;
    const storedNotice = window.localStorage.getItem(noticeKey);

    if (storedNotice) {
      try {
        const notice = JSON.parse(storedNotice) as {
          title: string;
          description?: string;
          variant: "success" | "warning" | "error" | "info";
        };

        showToast(notice);
      } catch (error) {
        console.error(error);
      } finally {
        window.localStorage.removeItem(noticeKey);
      }

      return;
    }

    showToast({
      variant: "success",
      title: "Result ready",
      description: "Your submitted result has been loaded successfully.",
    });
  }, [candidateId, payload, showToast]);

  if (!payload && !errorMessage) {
    return <main className="min-h-screen p-10 text-center">Loading result...</main>;
  }

  if (!payload) {
    return <main className="min-h-screen p-10 text-center">{errorMessage}</main>;
  }

  const incorrect = payload.questions.filter(
    (question) => !question.isCorrect && question.userAnswer,
  ).length;
  const unanswered = payload.questions.filter((question) => !question.userAnswer).length;
  const percentage = Math.round(
    (payload.submission.score / payload.submission.totalQuestions) * 100,
  );
  const scoreTone = getScoreTone(percentage);

  async function handleDownloadPdf() {
    if (!resultContainerRef.current || !payload) {
      showToast({
        variant: "error",
        title: "Cannot generate PDF",
        description: "Result data is not available. Please refresh the page.",
      });
      return;
    }

    setIsDownloading(true);

    try {
      showToast({
        variant: "info",
        title: "Preparing PDF",
        description: "Loading PDF library and generating your document...",
      });

      const html2pdf = await loadHtml2Pdf();
      
      await html2pdf()
        .set({
          margin: 10,
          filename: `${payload.candidate.fullName.replace(/\s+/g, "_")}_exam_results.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            scrollX: 0,
            scrollY: 0,
            windowWidth: document.documentElement.scrollWidth,
            windowHeight: document.documentElement.scrollHeight,
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        })
        .from(resultContainerRef.current)
        .save();

      showToast({
        variant: "success",
        title: "PDF Downloaded",
        description: "Your exam results have been downloaded successfully.",
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      showToast({
        variant: "error",
        title: "PDF Generation Failed",
        description: "Unable to generate PDF right now. Please check your internet connection and try again.",
      });
    } finally {
      setIsDownloading(false);
    }
  }

  function handlePrintResults() {
    try {
      showToast({
        variant: "info",
        title: "Preparing Print",
        description: "Opening print dialog for your results...",
      });

      // Small delay to ensure the toast is visible
      setTimeout(() => {
        window.print();
        
        // Show success message after print dialog (with delay)
        setTimeout(() => {
          showToast({
            variant: "success",
            title: "Print Dialog Opened",
            description: "Use your browser's print dialog to print your results.",
          });
        }, 500);
      }, 500);
    } catch (error) {
      console.error("Print error:", error);
      showToast({
        variant: "error",
        title: "Print Failed",
        description: "Unable to open print dialog. Please try again.",
      });
    }
  }

  return (
    <div
      ref={resultContainerRef}
      className="mx-auto flex min-h-screen w-full max-w-[1220px] flex-col px-5 py-6 motion-safe:animate-[softFade_0.45s_ease-out]"
    >
      <header className="relative mb-8 overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(135deg,#7e1137_0%,#a51752_38%,#ba124f_72%,#cf4f7d_100%)] px-6 py-8 text-white shadow-[0_24px_56px_rgba(126,17,55,0.18)] motion-safe:animate-[softRise_0.8s_ease-out] sm:px-8">
        <div className="print-hide absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.15),transparent_28%)]" />
        <div className="print-hide absolute -top-12 right-8 h-28 w-28 rounded-full bg-white/16 blur-3xl" />
        <div className="print-hide absolute left-8 bottom-0 h-24 w-24 rounded-full bg-white/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-white/70">
              Exam Results
            </p>
            <div className="mt-4 flex items-center gap-4 max-md:flex-col max-md:items-start">
              <div className="rounded-full border border-white/20 bg-white/12 p-4 shadow-[0_12px_28px_rgba(0,0,0,0.12)] backdrop-blur-xl">
                <FaChurch className="text-[2.25rem] text-white" />
              </div>
              <div>
                <h1 className="text-[1.9rem] leading-[1.1] font-bold max-md:text-[1.45rem]">
                  MFMCF UNIOSUN
                  <br />
                  OSOGBO CAMPUS
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/84">
                  Your answers have been saved on the backend. Review your summary below, then
                  download or print your result if needed.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-[26px] border border-white/18 bg-white/12 px-5 py-5 shadow-[0_14px_30px_rgba(0,0,0,0.12)] backdrop-blur-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/68">
              Final Score
            </p>
            <p className="mt-2 text-4xl font-bold">{percentage}%</p>
            <p className="mt-2 text-sm text-white/78">
              {payload.submission.score} out of {payload.submission.totalQuestions} correct
            </p>
          </div>
        </div>
      </header>

      <main className="flex flex-1 flex-col gap-6">
        <section className="rounded-[30px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(254,250,252,0.92))] p-6 shadow-[0_20px_48px_rgba(91,16,43,0.08)] max-md:p-4">
          <h3 className="mb-5 flex items-center text-[1.35rem] text-[#ba124f]">
            <FaUserGraduate className="mr-[10px]" /> Student Information
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-4 max-[480px]:grid-cols-1">
            {[
              ["Full Name", payload.candidate.fullName],
              ["Matric Number", payload.candidate.matricNumber],
              ["Phone Number", payload.candidate.phoneNumber],
              ["Department", payload.candidate.department],
              ["Level", payload.candidate.level],
              ["Date", new Date(payload.submission.submittedAt).toLocaleDateString()],
              ["Time Saved", new Date(payload.submission.submittedAt).toLocaleTimeString()],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[22px] border border-[#f0e4e8] bg-[linear-gradient(180deg,#fffefe_0%,#fbf7f9_100%)] px-4 py-4"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7f8c]">
                  {label}
                </p>
                <p className="mt-2 font-semibold text-[#332c31]">{value}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[30px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(254,250,252,0.92))] p-6 shadow-[0_20px_48px_rgba(91,16,43,0.08)] max-md:p-4">
          <div className="flex flex-wrap items-center justify-between gap-6 max-md:justify-center max-md:text-center">
            <div className={`relative h-[136px] w-[136px] rounded-full bg-white ${scoreTone.glow}`}>
              <svg className="h-[136px] w-[136px]" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="transparent"
                  stroke="#E4CEF1"
                  strokeWidth="8"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="52"
                  fill="transparent"
                  stroke={scoreTone.ring}
                  strokeWidth="8"
                  strokeLinecap="round"
                  transform="rotate(-90 60 60)"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - percentage / 100)}`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[2rem] font-bold text-[#ba124f]">{percentage}%</p>
                  <span
                    className={`mt-1 inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${scoreTone.badge}`}
                  >
                    Overall Score
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[240px] flex-1">
              <h3 className="mb-4 text-[1.35rem] text-[#ba124f]">Exam Summary</h3>
              <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-4 max-[480px]:grid-cols-1">
                <div className="rounded-[22px] bg-[rgba(76,175,80,0.10)] p-4 font-medium text-[#2f8e4b] shadow-[0_10px_22px_rgba(76,175,80,0.08)]">
                  <div className="flex items-center">
                    <FaCheck className="mr-2 text-[1.1rem]" />
                    <span>{payload.submission.score} Correct</span>
                  </div>
                  <p className="mt-2 text-sm text-current/80">Questions answered correctly</p>
                </div>
                <div className="rounded-[22px] bg-[rgba(244,67,54,0.10)] p-4 font-medium text-[#d84343] shadow-[0_10px_22px_rgba(244,67,54,0.08)]">
                  <div className="flex items-center">
                    <FaTimes className="mr-2 text-[1.1rem]" />
                    <span>{incorrect} Incorrect</span>
                  </div>
                  <p className="mt-2 text-sm text-current/80">Submitted but marked wrong</p>
                </div>
                <div className="rounded-[22px] bg-[rgba(255,152,0,0.10)] p-4 font-medium text-[#b26f22] shadow-[0_10px_22px_rgba(255,152,0,0.08)]">
                  <div className="flex items-center">
                    <FaQuestion className="mr-2 text-[1.1rem]" />
                    <span>{unanswered} Unanswered</span>
                  </div>
                  <p className="mt-2 text-sm text-current/80">Questions left without a choice</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[30px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(254,250,252,0.92))] p-6 shadow-[0_20px_48px_rgba(91,16,43,0.08)] max-md:p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="flex items-center text-[1.35rem] text-[#ba124f]">
                <FaListOl className="mr-[10px]" /> Detailed Results
              </h3>
              <p className="mt-2 text-sm leading-7 text-[#675f66]">
                Review each question, your submitted answer, and the correct response from the
                exam record.
              </p>
            </div>

            <div className="no-print flex flex-wrap gap-3 max-md:flex-col">
              <button
                type="button"
                onClick={() => void handleDownloadPdf()}
                disabled={isDownloading}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#7e1137_0%,#ba124f_100%)] px-5 py-3 font-semibold text-white shadow-[0_12px_28px_rgba(186,18,79,0.18)] transition duration-300 hover:-translate-y-[2px] hover:brightness-[1.03] disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FaFilePdf /> {isDownloading ? "Preparing PDF..." : "Download Results"}
              </button>
              <button
                type="button"
                onClick={handlePrintResults}
                className="flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#1f8f4d_0%,#27ae60_100%)] px-5 py-3 font-semibold text-white shadow-[0_12px_28px_rgba(39,174,96,0.18)] transition duration-300 hover:-translate-y-[2px] hover:brightness-[1.03]"
              >
                <FaPrint /> Print Results
              </button>
            </div>
          </div>

          <div className="mt-6 flex flex-col gap-4">
            {payload.questions.map((question, index) => {
              const statusClasses = !question.userAnswer
                ? "border-[#f2dfc4] bg-[linear-gradient(180deg,#fffaf4_0%,#fff6ea_100%)]"
                : question.isCorrect
                  ? "border-[#d8ecd8] bg-[linear-gradient(180deg,#f7fff8_0%,#eef9f0_100%)]"
                  : "border-[#f3d9df] bg-[linear-gradient(180deg,#fff8f9_0%,#fff1f4_100%)]";
              const statusLabel = !question.userAnswer
                ? { text: "Unanswered", classes: "bg-[rgba(255,152,0,0.12)] text-[#b26f22]" }
                : question.isCorrect
                  ? { text: "Correct", classes: "bg-[rgba(76,175,80,0.12)] text-[#2f8e4b]" }
                  : { text: "Incorrect", classes: "bg-[rgba(244,67,54,0.10)] text-[#d84343]" };

              return (
                <article
                  key={question.id}
                  className={`rounded-[26px] border p-5 shadow-[0_10px_22px_rgba(91,16,43,0.04)] transition duration-300 hover:-translate-y-[2px] hover:shadow-[0_16px_28px_rgba(91,16,43,0.08)] max-[480px]:p-4 ${statusClasses}`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/85 font-semibold text-[#ba124f] shadow-[0_8px_18px_rgba(186,18,79,0.08)]">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span
                          className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] ${statusLabel.classes}`}
                        >
                          {statusLabel.text}
                        </span>
                      </div>
                      <div className="mt-3 font-semibold leading-7 text-[#2f2930]">
                        {question.prompt}
                      </div>
                      <div className="mt-4 grid gap-3">
                        <div className="rounded-2xl bg-white/80 px-4 py-3">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7f8c]">
                            Your Answer
                          </span>
                          <p className="mt-2 text-sm leading-6 text-[#4a4248]">
                            {question.userAnswer ?? "No answer provided"}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white/80 px-4 py-3">
                          <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7f8c]">
                            Correct Answer
                          </span>
                          <p className="mt-2 text-sm leading-6 text-[#2f8e4b]">
                            {question.correctAnswer}
                          </p>
                        </div>
                        {question.explanation ? (
                          <div className="rounded-2xl bg-white/80 px-4 py-3">
                            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9b7f8c]">
                              Explanation
                            </span>
                            <p className="mt-2 text-sm leading-7 text-[#4a4248]">
                              {question.explanation}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      </main>

      <footer className="mt-8 text-center text-[0.9rem] text-[#666] motion-safe:animate-[softRise_0.9s_ease-out]">
        <p className="mb-[5px]">&copy; 2026 MFMCF UNIOSUN Osogbo Campus. All Rights Reserved.</p>
        <p className="font-medium text-[#ba124f]">Powered by MFMCF UNIOSUN ICT</p>
      </footer>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-10 text-center">Loading result...</main>}>
      <ResultPageContent />
    </Suspense>
  );
}

type Html2PdfFactory = () => {
  set: (options: object) => {
    from: (element: HTMLElement) => {
      save: () => Promise<void>;
    };
  };
};

let html2pdfPromise: Promise<Html2PdfFactory> | null = null;

async function loadHtml2Pdf(): Promise<Html2PdfFactory> {
  if (!html2pdfPromise) {
    html2pdfPromise = import("html2pdf.js").then((mod) => {
      const factory = (mod.default ?? mod) as unknown as Html2PdfFactory;

      if (typeof factory !== "function") {
        throw new Error("html2pdf module did not export a function.");
      }

      return factory;
    });
  }

  return html2pdfPromise;
}
