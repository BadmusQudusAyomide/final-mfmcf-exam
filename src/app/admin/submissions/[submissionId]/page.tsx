import { notFound } from "next/navigation";
import { AdminShell } from "@/components/admin-shell";
import { getSubmissionDetail } from "@/lib/exam-service";

export const dynamic = "force-dynamic";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

type Params = Promise<{ submissionId: string }>;

export default async function SubmissionDetailPage({
  params,
}: {
  params: Params;
}) {
  const { submissionId } = await params;
  let detail: Awaited<ReturnType<typeof getSubmissionDetail>>;

  try {
    detail = await getSubmissionDetail(submissionId);
  } catch {
    notFound();
  }

  return (
    <AdminShell
      current="submissions"
      title="Candidate Script and Score"
      description="Review the student's exact submitted answers and score from the backend record."
    >
      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <div className="space-y-6">
          <section className="rounded-[24px] border border-white/65 bg-white/72 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
            <h3 className="text-2xl font-semibold text-[#7e1137]">Candidate Details</h3>
            <div className="mt-5 space-y-3 text-sm text-[#444]">
              <p><span className="font-semibold">Name:</span> {detail.candidate.fullName}</p>
              <p><span className="font-semibold">Matric Number:</span> {detail.candidate.matricNumber}</p>
              <p><span className="font-semibold">Phone:</span> {detail.candidate.phoneNumber}</p>
              <p><span className="font-semibold">Department:</span> {detail.candidate.department}</p>
              <p><span className="font-semibold">Level:</span> {detail.candidate.level}</p>
              <p><span className="font-semibold">Submitted:</span> {formatDate(detail.submission.submittedAt)}</p>
            </div>
          </section>

          <section className="rounded-[24px] border border-white/65 bg-white/72 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
            <h3 className="text-2xl font-semibold text-[#7e1137]">Score Summary</h3>
            <div className="mt-5 rounded-2xl bg-[#7e1137] p-5 text-white">
              <p className="text-4xl font-bold text-white">
                {detail.submission.score}/{detail.submission.totalQuestions}
              </p>
              <p className="mt-2 text-sm text-white/80">{detail.exam.title}</p>
            </div>
          </section>
        </div>

        <section className="rounded-[24px] border border-white/65 bg-white/72 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
          <h3 className="text-2xl font-semibold text-[#7e1137]">Full Script</h3>
          <div className="mt-6 space-y-4">
            {detail.answers.map((answer, index) => (
              <article
                key={`${answer.questionId}-${index}`}
                className={`rounded-[22px] border-l-4 p-5 ${
                  answer.isCorrect
                    ? "border-l-[#4caf50] bg-[rgba(76,175,80,0.05)]"
                    : answer.selectedOption
                      ? "border-l-[#f44336] bg-[rgba(244,67,54,0.05)]"
                      : "border-l-[#ff9800] bg-[rgba(255,152,0,0.05)]"
                }`}
              >
                <p className="font-semibold text-[#333]">
                  {index + 1}. {answer.prompt}
                </p>
                <p className="mt-3 text-sm text-[#555]">
                  <span className="font-semibold">Student answer:</span>{" "}
                  {answer.selectedOption ?? "No answer provided"}
                </p>
                <p className="mt-2 text-sm text-[#555]">
                  <span className="font-semibold">Correct answer:</span> {answer.correctAnswer}
                </p>
                {answer.explanation ? (
                  <p className="mt-2 text-sm text-[#555]">
                    <span className="font-semibold">Explanation:</span> {answer.explanation}
                  </p>
                ) : null}
              </article>
            ))}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
