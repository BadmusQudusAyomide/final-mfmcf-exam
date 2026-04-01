import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { getAdminDashboardData } from "@/lib/exam-service";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const dashboard = await getAdminDashboardData();

  return (
    <AdminShell
      current="dashboard"
      title="MFMCF Exam Dashboard"
      description="Track registrations, monitor departments, review analytics, and open any student's full script without leaving the admin side."
      topAction={
        <div className="flex flex-wrap items-center gap-3">
          <Link
            href="/api/admin/submissions/export"
            className="rounded-2xl bg-[#9b5f1c] px-5 py-3 text-sm font-semibold !text-white shadow-[0_10px_24px_rgba(155,95,28,0.18)] transition hover:bg-[#7e4d17]"
          >
            Download All Results
          </Link>
          <Link
            href="/admin/exam"
            className="rounded-2xl bg-[#7e1137] px-5 py-3 text-sm font-semibold !text-white shadow-[0_10px_24px_rgba(91,16,43,0.18)] transition hover:bg-[#65102d]"
          >
            Open Exam Builder
          </Link>
        </div>
      }
    >
      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {dashboard.stats.map((stat) => (
          <article
            key={stat.label}
            className="rounded-[24px] border border-white/65 bg-white/70 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8b6e7c]">
              {stat.label}
            </p>
            <p className="mt-3 text-4xl font-bold text-[#7e1137]">{stat.value}</p>
            <p className="mt-3 text-sm leading-6 text-[#655a61]">{stat.note}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-[24px] border border-white/65 bg-white/72 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-[#7e1137]">Students</h3>
              <p className="text-sm text-[#655a61]">
                Every registered student, their current status, and any recorded score.
              </p>
            </div>
            <div className="rounded-full bg-[#7e1137] px-4 py-2 text-sm font-semibold text-white">
              {dashboard.students.length} students
            </div>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="text-left text-xs uppercase tracking-[0.12em] text-[#8b6e7c]">
                  <th className="px-3 py-2">Student</th>
                  <th className="px-3 py-2">Department</th>
                  <th className="px-3 py-2">Level</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2">Score</th>
                </tr>
              </thead>
              <tbody>
                {dashboard.students.map((student) => (
                  <tr key={student.id} className="rounded-2xl bg-white shadow-[0_6px_16px_rgba(91,16,43,0.05)]">
                    <td className="rounded-l-2xl px-3 py-3">
                      <p className="font-semibold text-[#2f2930]">{student.fullName}</p>
                      <p className="text-sm text-[#7b7077]">{student.matricNumber}</p>
                    </td>
                    <td className="px-3 py-3 text-[#544c52]">{student.department}</td>
                    <td className="px-3 py-3 text-[#544c52]">{student.level}</td>
                    <td className="px-3 py-3">
                      <span className="rounded-full bg-[#7e1137] px-3 py-1 text-xs font-semibold text-white">
                        {student.status}
                      </span>
                    </td>
                    <td className="rounded-r-2xl px-3 py-3 text-[#544c52]">
                      {student.score !== null && student.totalQuestions !== null
                        ? `${student.score}/${student.totalQuestions}`
                        : "Not submitted"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <section className="rounded-[24px] border border-white/65 bg-white/72 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
            <h3 className="text-2xl font-semibold text-[#7e1137]">Departments</h3>
            <div className="mt-5 space-y-3">
              {dashboard.departments.map((department) => (
                <div
                  key={department.name}
                  className="rounded-2xl border border-[#f1d8e0] bg-[#fffdfd] px-4 py-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-semibold text-[#372f35]">{department.name}</p>
                    <span className="rounded-full bg-[#7e1137] px-3 py-1 text-sm font-semibold text-white">
                      {department.submitted}/{department.registered} submitted
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[24px] border border-white/65 bg-white/72 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
            <h3 className="text-2xl font-semibold text-[#7e1137]">Analytics</h3>
            <div className="mt-5 grid gap-4">
              <div className="rounded-2xl bg-[#fff4f8] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8b6e7c]">
                  Score Bands
                </p>
                <div className="mt-4 space-y-3">
                  {dashboard.analytics.scoreBands.map((band) => (
                    <div key={band.label} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-[#544c52]">{band.label}</span>
                      <span className="rounded-full bg-[#7e1137] px-3 py-1 text-sm font-semibold text-white">
                        {band.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-[#f7f9ff] p-4">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#6a7995]">
                  Level Distribution
                </p>
                <div className="mt-4 space-y-3">
                  {dashboard.analytics.levelDistribution.map((level) => (
                    <div key={level.label} className="flex items-center justify-between gap-3">
                      <span className="text-sm text-[#4f5a6f]">{level.label}</span>
                      <span className="rounded-full bg-[#42506f] px-3 py-1 text-sm font-semibold text-white">
                        {level.count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-[24px] border border-white/65 bg-white/72 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
          <h3 className="text-2xl font-semibold text-[#7e1137]">Exam Overview</h3>
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl bg-[#fff4f8] p-4">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#8b6e7c]">
                Current Exam
              </p>
              <p className="mt-2 text-xl font-semibold text-[#2d2530]">{dashboard.exam.title}</p>
              <p className="mt-2 text-sm text-[#655a61]">Status: {dashboard.exam.status}</p>
            </div>
            <div className="rounded-2xl bg-[#f8f9fb] p-4">
              <p className="text-sm text-[#655a61]">
                Use the sidebar to move between the dashboard, exam builder, and the dedicated submissions page. You can also export all submitted results into one CSV sheet for reporting.
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] border border-white/65 bg-white/72 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-semibold text-[#7e1137]">Submission Summary</h3>
              <p className="text-sm text-[#655a61]">
                Jump into the full submissions workspace to review scripts.
              </p>
            </div>
            <Link
              href="/admin/submissions"
              className="rounded-xl bg-[#7e1137] px-4 py-2 text-sm font-semibold !text-white transition hover:bg-[#65102d]"
            >
              Open Submissions
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            {dashboard.submissions.slice(0, 5).map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between gap-3 rounded-2xl border border-[#eee] bg-white px-4 py-4"
              >
                <div>
                  <p className="font-semibold text-[#333]">{submission.candidateName}</p>
                  <p className="text-sm text-[#666]">{submission.department} · {submission.level}</p>
                </div>
                <p className="text-sm font-semibold text-[#7e1137]">
                  {submission.score}/{submission.totalQuestions}
                </p>
              </div>
            ))}
            {dashboard.submissions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d9c6ce] px-4 py-10 text-center text-[#776b72]">
                No submissions yet.
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </AdminShell>
  );
}
