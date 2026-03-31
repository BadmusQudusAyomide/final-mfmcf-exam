import { NextResponse } from "next/server";
import { getAdminExamData, updateExamSettings } from "@/lib/exam-service";
import { examSettingsSchema } from "@/lib/validation";

export async function GET() {
  try {
    const data = await getAdminExamData();
    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to load exam settings." }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const parsed = examSettingsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid exam settings." }, { status: 400 });
    }

    const exam = await updateExamSettings({
      ...parsed.data,
      departments: parsed.data.departments.filter(Boolean),
      levels: parsed.data.levels.filter(Boolean),
    });
    return NextResponse.json({ exam });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Unable to update exam settings." }, { status: 500 });
  }
}
