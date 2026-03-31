import { NextResponse } from "next/server";
import { createQuestion, getAdminExamData } from "@/lib/exam-service";
import { questionSchema } from "@/lib/validation";

export async function GET() {
  try {
    const data = await getAdminExamData();
    return NextResponse.json({ questions: data.exam.questions });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to load questions." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = questionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid question payload." }, { status: 400 });
    }

    const questions = await createQuestion(parsed.data);
    return NextResponse.json({ questions }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create question." },
      { status: 500 },
    );
  }
}
