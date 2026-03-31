import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const repoRoot = process.cwd();
const questionsPath = path.join(repoRoot, "src", "data", "legacy-questions.json");

async function main() {
  if (!fs.existsSync(questionsPath)) {
    throw new Error("legacy-questions.json does not exist. Run npm run legacy:extract first.");
  }

  const questions = JSON.parse(fs.readFileSync(questionsPath, "utf8"));

  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("No questions found in legacy-questions.json.");
  }

  const exam =
    (await prisma.exam.findFirst({
      orderBy: {
        createdAt: "asc",
      },
      select: {
        id: true,
      },
    })) ??
    (await prisma.exam.create({
      data: {
        title: "Discipleship/Stewardship Class Exam",
        slug: "discipleship-stewardship-class-exam",
        instructions:
          "Follow the same church exam flow, but submissions and results are now stored on the backend.",
        durationMinutes: 35,
        status: "PUBLISHED",
        departments: [
          "Choir",
          "Academic/follow-up",
          "Ushering",
          "Technical",
          "Media",
          "Bible-study",
          "Prayer",
          "Welfare",
          "Sanitation",
          "Drama",
          "Evangelism",
        ],
        levels: ["100", "200", "300", "400", "500"],
      },
      select: {
        id: true,
      },
    }));

  await prisma.$transaction([
    prisma.questionOption.deleteMany({
      where: {
        question: {
          examId: exam.id,
        },
      },
    }),
    prisma.examQuestion.deleteMany({
      where: {
        examId: exam.id,
      },
    }),
  ]);

  await prisma.examQuestion.createMany({
    data: questions.map((question) => ({
      id: question.id,
      examId: exam.id,
      prompt: question.prompt,
      explanation: question.explanation || null,
      order: question.order,
    })),
  });

  await prisma.questionOption.createMany({
    data: questions.flatMap((question) =>
      question.options.map((option) => ({
        questionId: question.id,
        label: option.label,
        isCorrect: option.isCorrect,
        order: option.order,
      })),
    ),
  });

  console.log(`Synced ${questions.length} legacy questions into the active exam.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
