import { NextResponse } from "next/server";
import { deleteQuestion, updateQuestion } from "@/lib/exam-service";
import { questionSchema } from "@/lib/validation";

type Params = Promise<{ questionId: string }>;

export async function PUT(
  request: Request,
  context: { params: Params },
) {
  try {
    const { questionId } = await context.params;
    const body = await request.json();
    const parsed = questionSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid question payload." }, { status: 400 });
    }

    const question = await updateQuestion(questionId, parsed.data);
    return NextResponse.json({ question });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update question." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: { params: Params },
) {
  try {
    const { questionId } = await context.params;
    const questions = await deleteQuestion(questionId);
    return NextResponse.json({ questions });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete question." },
      { status: 500 },
    );
  }
}
