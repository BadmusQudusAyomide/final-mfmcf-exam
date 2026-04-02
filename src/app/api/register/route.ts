import { NextResponse } from "next/server";
import { registerCandidate } from "@/lib/exam-service";
import { registrationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = registrationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Please fill all required registration fields.",
          issues: parsed.error.flatten(),
        },
        { status: 400 },
      );
    }

    const registration = await registerCandidate(parsed.data);
    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error(error);

    if (error instanceof Error && error.message === "MATRIC_NUMBER_ALREADY_USED") {
      const duplicateError = error as Error & { candidateId?: string };

      return NextResponse.json(
        {
          error:
            "This matric number has already been used for this exam. You have already submitted or started the quiz.",
          code: "MATRIC_NUMBER_ALREADY_USED",
          candidateId: duplicateError.candidateId ?? null,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      { error: "Unable to save registration right now." },
      { status: 500 },
    );
  }
}
