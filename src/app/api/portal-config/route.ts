import { NextResponse } from "next/server";
import { getPortalConfig } from "@/lib/exam-service";

export async function GET() {
  try {
    const data = await getPortalConfig();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to load portal config." }, { status: 500 });
  }
}
