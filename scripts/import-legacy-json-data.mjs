import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const repoRoot = process.cwd();
const legacyDbPath = path.join(repoRoot, "data", "app-db.json");

async function main() {
  if (!fs.existsSync(legacyDbPath)) {
    console.log("No legacy app-db.json file found. Skipping data import.");
    return;
  }

  const legacyDb = JSON.parse(fs.readFileSync(legacyDbPath, "utf8"));
  const exam = await prisma.exam.findFirst({
    orderBy: {
      createdAt: "asc",
    },
  });

  if (!exam) {
    throw new Error("No exam exists in Postgres yet. Run the exam sync first.");
  }

  const candidates = Array.isArray(legacyDb.candidates) ? legacyDb.candidates : [];
  const sessions = Array.isArray(legacyDb.sessions) ? legacyDb.sessions : [];
  const submissions = Array.isArray(legacyDb.submissions) ? legacyDb.submissions : [];

  await prisma.$transaction(async (tx) => {
    for (const candidate of candidates) {
      await tx.candidate.upsert({
        where: { id: candidate.id },
        update: {
          fullName: candidate.fullName,
          matricNumber: candidate.matricNumber,
          phoneNumber: candidate.phoneNumber,
          department: candidate.department,
          level: candidate.level,
          createdAt: new Date(candidate.createdAt),
        },
        create: {
          id: candidate.id,
          fullName: candidate.fullName,
          matricNumber: candidate.matricNumber,
          phoneNumber: candidate.phoneNumber,
          department: candidate.department,
          level: candidate.level,
          createdAt: new Date(candidate.createdAt),
        },
      });
    }

    for (const session of sessions) {
      await tx.examSession.upsert({
        where: {
          examId_candidateId: {
            examId: exam.id,
            candidateId: session.candidateId,
          },
        },
        update: {
          startedAt: new Date(session.startedAt),
          expiresAt: new Date(session.expiresAt),
          completedAt: session.completedAt ? new Date(session.completedAt) : null,
          status: session.status,
        },
        create: {
          id: session.id,
          examId: exam.id,
          candidateId: session.candidateId,
          startedAt: new Date(session.startedAt),
          expiresAt: new Date(session.expiresAt),
          completedAt: session.completedAt ? new Date(session.completedAt) : null,
          status: session.status,
        },
      });
    }

    for (const submission of submissions) {
      await tx.examSubmission.upsert({
        where: {
          examId_candidateId: {
            examId: exam.id,
            candidateId: submission.candidateId,
          },
        },
        update: {
          score: submission.score,
          totalQuestions: submission.totalQuestions,
          submittedAt: new Date(submission.submittedAt),
          securityFlags: submission.securityFlags ?? 0,
          submittedAnswers: {
            deleteMany: {},
            create: (submission.submittedAnswers ?? []).map((answer, index) => ({
              questionId: answer.questionId ?? `legacy-answer-${index + 1}`,
              questionOrder: index + 1,
              prompt: answer.prompt ?? "",
              explanation: answer.explanation ?? null,
              correctAnswer: answer.correctAnswer ?? "",
              selectedOption: answer.selectedOption ?? null,
              isCorrect: Boolean(answer.isCorrect),
            })),
          },
        },
        create: {
          id: submission.id,
          examId: exam.id,
          candidateId: submission.candidateId,
          score: submission.score,
          totalQuestions: submission.totalQuestions,
          submittedAt: new Date(submission.submittedAt),
          securityFlags: submission.securityFlags ?? 0,
          submittedAnswers: {
            create: (submission.submittedAnswers ?? []).map((answer, index) => ({
              questionId: answer.questionId ?? `legacy-answer-${index + 1}`,
              questionOrder: index + 1,
              prompt: answer.prompt ?? "",
              explanation: answer.explanation ?? null,
              correctAnswer: answer.correctAnswer ?? "",
              selectedOption: answer.selectedOption ?? null,
              isCorrect: Boolean(answer.isCorrect),
            })),
          },
        },
      });
    }
  });

  console.log(
    `Imported ${candidates.length} candidates, ${sessions.length} sessions, and ${submissions.length} submissions from legacy JSON.`,
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
