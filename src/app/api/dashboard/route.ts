import { NextResponse } from "next/server";
import { dashboardStats, examSummary, recentSubmissions } from "@/lib/sample-data";

export async function GET() {
  return NextResponse.json({
    examSummary,
    dashboardStats,
    recentSubmissions,
  });
}
