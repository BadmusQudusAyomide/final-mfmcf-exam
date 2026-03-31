import { NextResponse } from "next/server";
import { getAdminDashboardData } from "@/lib/exam-service";

export async function GET() {
  try {
    const data = await getAdminDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load admin dashboard data right now." },
      { status: 500 },
    );
  }
}
