import { NextResponse } from "next/server";
import { getExamForCandidate } from "@/lib/exam-service";

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

    const examPayload = await getExamForCandidate(candidateId);
    return NextResponse.json(examPayload);
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "ALREADY_SUBMITTED") {
      return NextResponse.json(
        {
          error: "You have already attempted this quiz. You cannot take it again.",
          code: "ALREADY_SUBMITTED",
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Unable to load the exam right now." },
      { status: 500 },
    );
  }
}
