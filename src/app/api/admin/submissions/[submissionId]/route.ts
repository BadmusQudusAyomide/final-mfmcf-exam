import { NextResponse } from "next/server";
import { getSubmissionDetail } from "@/lib/exam-service";

type Params = Promise<{ submissionId: string }>;

export async function GET(
  _request: Request,
  context: { params: Params },
) {
  try {
    const { submissionId } = await context.params;
    const detail = await getSubmissionDetail(submissionId);
    return NextResponse.json(detail);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to load submission detail." },
      { status: 500 },
    );
  }
}
