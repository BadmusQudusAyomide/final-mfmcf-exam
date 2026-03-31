import { NextResponse } from "next/server";
import { getCandidateResult } from "@/lib/exam-service";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const candidateId = searchParams.get("candidateId");

    if (!candidateId) {
      return NextResponse.json(
        { error: "Candidate id is required." },
        { status: 400 },
      );
    }

    const result = await getCandidateResult(candidateId);
    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Unable to load the candidate result right now." },
      { status: 500 },
    );
  }
}
