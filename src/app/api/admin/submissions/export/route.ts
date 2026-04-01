import { NextResponse } from "next/server";
import { getAdminResultsExportData } from "@/lib/exam-service";

function escapeCsv(value: string | number) {
  const stringValue = String(value);

  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function buildCsv(rows: Array<Record<string, string | number>>) {
  if (rows.length === 0) {
    return "Candidate Name,Matric Number,Phone Number,Department,Level,Score,Total Questions,Percentage,Flags,Submitted At\n";
  }

  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(","),
    ...rows.map((row) => headers.map((header) => escapeCsv(row[header] ?? "")).join(",")),
  ];

  return `${lines.join("\n")}\n`;
}

export async function GET() {
  try {
    const data = await getAdminResultsExportData();
    const rows = data.submissions.map((submission) => ({
      "Candidate Name": submission.candidateName,
      "Matric Number": submission.matricNumber,
      "Phone Number": submission.phoneNumber,
      Department: submission.department,
      Level: submission.level,
      Score: submission.score,
      "Total Questions": submission.totalQuestions,
      Percentage: `${submission.percentage}%`,
      Flags: submission.securityFlags,
      "Submitted At": submission.submittedAt,
    }));

    const csv = buildCsv(rows);
    const filename = `${data.exam.slug}-results.csv`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to export all student results right now." },
      { status: 500 },
    );
  }
}
