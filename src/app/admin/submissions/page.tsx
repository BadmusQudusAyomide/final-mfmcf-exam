import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getAdminDashboardData } from "@/lib/exam-service";

export const dynamic = "force-dynamic";

function formatSubmittedAt(date: string) {
  return new Intl.DateTimeFormat("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default async function AdminSubmissionsPage() {
  const dashboard = await getAdminDashboardData();

  return (
    <AdminShell
      current="submissions"
      title="Submissions"
      description="This page is dedicated to submitted scripts, candidate records, and score review."
    >
      <section className="rounded-[24px] border border-white/65 bg-white/72 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-[#7e1137]">All Submissions</h3>
            <p className="text-sm text-[#655a61]">
              Review every submission on its own page and open any script for details.
            </p>
          </div>
          <div className="rounded-full bg-[#7e1137] px-4 py-2 text-sm font-medium text-white">
            {dashboard.submissions.length} submissions
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2">
            <thead>
              <tr className="text-left text-xs uppercase tracking-[0.12em] text-[#8b6e7c]">
                <th className="px-3 py-2">Candidate</th>
                <th className="px-3 py-2">Department</th>
                <th className="px-3 py-2">Level</th>
                <th className="px-3 py-2">Score</th>
                <th className="px-3 py-2">Submitted</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.submissions.map((submission) => (
                <tr key={submission.id} className="bg-white shadow-[0_6px_16px_rgba(91,16,43,0.05)]">
                  <td className="rounded-l-2xl px-3 py-4">
                    <p className="font-semibold text-[#333]">{submission.candidateName}</p>
                    <p className="text-sm text-[#666]">{submission.matricNumber}</p>
                    <p className="text-sm text-[#666]">{submission.phoneNumber}</p>
                  </td>
                  <td className="px-3 py-4 text-[#544c52]">{submission.department}</td>
                  <td className="px-3 py-4 text-[#544c52]">{submission.level}</td>
                  <td className="px-3 py-4 font-semibold text-[#7e1137]">
                    {submission.score}/{submission.totalQuestions}
                  </td>
                  <td className="px-3 py-4 text-[#666]">{formatSubmittedAt(submission.submittedAt)}</td>
                  <td className="rounded-r-2xl px-3 py-4">
                    <Link
                      href={`/admin/submissions/${submission.id}`}
                      className="inline-block rounded-xl bg-[#7e1137] px-4 py-2 text-sm font-semibold !text-white transition hover:bg-[#65102d]"
                    >
                      View Script
                    </Link>
                  </td>
                </tr>
              ))}
              {dashboard.submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-[#666]">
                    No submissions yet. Once students submit, they will appear here.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </AdminShell>
  );
}
