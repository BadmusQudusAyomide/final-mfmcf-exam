"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowLeft, FaArrowRight, FaCheck, FaCheckCircle, FaClock, FaTasks } from "react-icons/fa";

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

function ExamPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const candidateId = searchParams.get("candidateId");
  const [payload, setPayload] = useState<ExamPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});

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

  async function handleSubmit() {
    if (!payload || !candidateId) {
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          candidateId,
          examSlug: payload.exam.slug,
          answers: payload.exam.questions.map((question) => ({
            questionId: question.id,
            selectedOption: answers[question.id],
          })),
        }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setErrorMessage(data.error ?? "Unable to submit exam.");
        return;
      }

      router.push(`/result?candidateId=${candidateId}`);
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to submit exam.");
    } finally {
      setSubmitting(false);
    }
  }

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
          <span>{payload.exam.durationMinutes}:00</span>
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
            onClick={() => void handleSubmit()}
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
