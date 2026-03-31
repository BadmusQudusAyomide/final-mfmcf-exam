"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FaCheck, FaChurch, FaFilePdf, FaListOl, FaPrint, FaQuestion, FaTimes, FaUserGraduate } from "react-icons/fa";

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

function ResultPageContent() {
  const searchParams = useSearchParams();
  const candidateId = searchParams.get("candidateId");
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

  if (!payload && !errorMessage) {
    return <main className="min-h-screen p-10 text-center">Loading result...</main>;
  }

  if (!payload) {
    return <main className="min-h-screen p-10 text-center">{errorMessage}</main>;
  }

  const incorrect = payload.questions.filter((question) => !question.isCorrect && question.userAnswer).length;
  const unanswered = payload.questions.filter((question) => !question.userAnswer).length;
  const percentage = Math.round((payload.submission.score / payload.submission.totalQuestions) * 100);

  async function handleDownloadPdf() {
    if (!resultContainerRef.current || !payload) {
      return;
    }

    setIsDownloading(true);

    try {
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
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to download PDF right now.");
    } finally {
      setIsDownloading(false);
    }
  }

  function handlePrintResults() {
    window.print();
  }

  return (
    <div ref={resultContainerRef} className="mx-auto flex min-h-screen w-full max-w-[1200px] flex-col px-5 py-5">
      <header className="mb-[30px] text-center motion-safe:animate-[fadeInDown_0.8s_ease-out]">
        <div className="mb-[10px] flex items-center justify-center max-md:flex-col">
          <FaChurch className="mr-[15px] text-[2.5rem] text-[#ba124f] max-md:mr-0 max-md:mb-[10px]" />
          <h1 className="text-left text-[1.5rem] leading-[1.2] font-bold text-[#ba124f] max-md:text-center max-[480px]:text-[1.3rem]">
            MFMCF UNIOSUN
            <br />
            OSOGBO CAMPUS
          </h1>
        </div>
        <h2 className="relative inline-block text-[1.8rem] font-semibold text-[#ba124f] after:absolute after:-bottom-2 after:left-1/2 after:h-[3px] after:w-20 after:-translate-x-1/2 after:bg-[#e4cef1] after:content-[''] max-md:text-[1.5rem] max-[480px]:text-[1.3rem]">
          EXAM RESULTS
        </h2>
      </header>

      <main className="flex flex-1 flex-col gap-[25px]">
        <section className="rounded-[10px] bg-white p-[25px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] max-md:p-[15px]">
          <h3 className="mb-5 flex items-center text-[1.3rem] text-[#ba124f]">
            <FaUserGraduate className="mr-[10px]" /> Student Information
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-[15px] max-[480px]:grid-cols-1">
            {[
              ["Full Name:", payload.candidate.fullName],
              ["Matric Number:", payload.candidate.matricNumber],
              ["Phone Number:", payload.candidate.phoneNumber],
              ["Department:", payload.candidate.department],
              ["Level:", payload.candidate.level],
              ["Date:", new Date(payload.submission.submittedAt).toLocaleDateString()],
              ["Time Saved:", new Date(payload.submission.submittedAt).toLocaleTimeString()],
            ].map(([label, value]) => (
              <div key={label} className="flex">
                <span className="mr-2 min-w-[120px] font-semibold text-[#555]">{label}</span>
                <span>{value}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-wrap items-center justify-between gap-5 rounded-[10px] bg-white p-[25px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] max-md:justify-center max-md:p-[15px] max-md:text-center">
          <div className="relative h-[120px] w-[120px]">
            <svg className="h-[120px] w-[120px]" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="transparent" stroke="#E4CEF1" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r="52"
                fill="transparent"
                stroke={percentage >= 70 ? "#4caf50" : percentage >= 40 ? "#ff9800" : "#f44336"}
                strokeWidth="8"
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                strokeDasharray={`${2 * Math.PI * 52}`}
                strokeDashoffset={`${2 * Math.PI * 52 * (1 - percentage / 100)}`}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center text-[1.8rem] font-bold text-[#ba124f]">
              {percentage}%
            </div>
          </div>

          <div className="min-w-[200px] flex-1">
            <h3 className="mb-[15px] text-[1.3rem] text-[#ba124f]">Exam Summary</h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-[15px] max-[480px]:grid-cols-1">
              <div className="flex items-center rounded-lg bg-[rgba(76,175,80,0.1)] p-[10px] font-medium text-[#4caf50]">
                <FaCheck className="mr-2 text-[1.1rem]" />
                <span>{payload.submission.score} Correct</span>
              </div>
              <div className="flex items-center rounded-lg bg-[rgba(244,67,54,0.1)] p-[10px] font-medium text-[#f44336]">
                <FaTimes className="mr-2 text-[1.1rem]" />
                <span>{incorrect} Incorrect</span>
              </div>
              <div className="flex items-center rounded-lg bg-[rgba(255,152,0,0.1)] p-[10px] font-medium text-[#ff9800]">
                <FaQuestion className="mr-2 text-[1.1rem]" />
                <span>{unanswered} Unanswered</span>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[10px] bg-white p-[25px] shadow-[0_5px_15px_rgba(0,0,0,0.05)] max-md:p-[15px]">
          <h3 className="mb-5 flex items-center text-[1.3rem] text-[#ba124f]">
            <FaListOl className="mr-[10px]" /> Detailed Results
          </h3>

          <div className="flex flex-col gap-[15px]">
            {payload.questions.map((question, index) => {
              const statusClasses = !question.userAnswer
                ? "border-l-[#ff9800] bg-[rgba(255,152,0,0.05)]"
                : question.isCorrect
                  ? "border-l-[#4caf50] bg-[rgba(76,175,80,0.05)]"
                  : "border-l-[#f44336] bg-[rgba(244,67,54,0.05)]";

              return (
                <article
                  key={question.id}
                  className={`rounded-lg border-l-4 p-[15px] transition duration-300 hover:translate-x-[5px] hover:shadow-[0_3px_10px_rgba(0,0,0,0.1)] max-[480px]:p-[10px] ${statusClasses}`}
                >
                  <div className="mb-2 font-semibold">
                    {index + 1}. {question.prompt}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-[10px] text-[0.9rem]">
                    <span className="font-semibold text-[#555]">Your answer:</span>
                    <span className={!question.userAnswer ? "text-[#ff9800]" : "text-[#f44336]"}>
                      {question.userAnswer ?? "No answer provided"}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-[10px] text-[0.9rem]">
                    <span className="font-semibold text-[#555]">Correct answer:</span>
                    <span className="text-[#4caf50]">{question.correctAnswer}</span>
                  </div>
                  {question.explanation ? (
                    <div className="mt-2 text-[0.9rem]">
                      <span className="font-semibold text-[#555]">Explanation:</span>{" "}
                      {question.explanation}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="no-print mt-5 flex justify-center gap-[15px] max-md:flex-col">
            <button
              type="button"
              onClick={() => void handleDownloadPdf()}
              disabled={isDownloading}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#ba124f] px-5 py-[10px] font-semibold text-white transition duration-300 hover:-translate-y-[2px] hover:bg-[#9a0f41] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <FaFilePdf /> {isDownloading ? "Preparing PDF..." : "Download Results"}
            </button>
            <button
              type="button"
              onClick={handlePrintResults}
              className="flex cursor-pointer items-center justify-center gap-2 rounded-[5px] bg-[#4caf50] px-5 py-[10px] font-semibold text-white transition duration-300 hover:-translate-y-[2px] hover:bg-[#3d8b40] hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
            >
              <FaPrint /> Print Results
            </button>
          </div>
        </section>
      </main>

      <footer className="mt-[30px] text-center text-[0.9rem] text-[#666]">
        <p className="mb-[5px]">&copy; 2025 MFMCF UNIOSUN Osogbo Campus. All Rights Reserved.</p>
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

async function loadHtml2Pdf(): Promise<Html2PdfFactory> {
  const existing = (window as Window & { html2pdf?: Html2PdfFactory }).html2pdf;
  if (existing) {
    return existing;
  }

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load html2pdf."));
    document.head.appendChild(script);
  });

  const loaded = (window as Window & { html2pdf?: Html2PdfFactory }).html2pdf;

  if (!loaded) {
    throw new Error("html2pdf is unavailable.");
  }

  return loaded;
}
