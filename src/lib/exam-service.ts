import { Prisma, type ExamStatus } from "@prisma/client";
import currentYearQuestions from "@/data/current-year-questions.json";
import { prisma } from "@/lib/prisma";
import type {
  ExamSettingsInput,
  QuestionInput,
  RegistrationInput,
  SubmissionInput,
} from "@/lib/validation";

const DEFAULT_EXAM_SLUG = "discipleship-stewardship-class-exam";

const seedQuestions = currentYearQuestions satisfies Array<{
  id: string;
  order: number;
  prompt: string;
  explanation?: string;
  options: Array<{ label: string; isCorrect: boolean; order: number }>;
}>;

const defaultDepartments = [
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
];

const defaultLevels = ["100", "200", "300", "400", "500"];

const examWithRelations = {
  questions: {
    orderBy: {
      order: "asc",
    },
    include: {
      options: {
        orderBy: {
          order: "asc",
        },
      },
    },
  },
} satisfies Prisma.ExamInclude;

async function getOrCreateExam() {
  const existing = await prisma.exam.findFirst({
    orderBy: {
      createdAt: "asc",
    },
    include: examWithRelations,
  });

  if (existing) {
    if (existing.departments.length === 0 || existing.levels.length === 0) {
      return prisma.exam.update({
        where: { id: existing.id },
        data: {
          departments: existing.departments.length > 0 ? existing.departments : defaultDepartments,
          levels: existing.levels.length > 0 ? existing.levels : defaultLevels,
        },
        include: examWithRelations,
      });
    }

    return existing;
  }

  return prisma.exam.create({
    data: {
      title: "Discipleship/Stewardship Class Exam",
      slug: DEFAULT_EXAM_SLUG,
      instructions:
        "Follow the same church exam flow, but submissions and results are now stored on the backend.",
      durationMinutes: 50,
      status: "PUBLISHED",
      departments: defaultDepartments,
      levels: defaultLevels,
      questions: {
        create: seedQuestions.map((question, questionIndex) => ({
          prompt: question.prompt,
          explanation: question.explanation,
          order: question.order || questionIndex + 1,
          options: {
            create: question.options.map((option, optionIndex) => ({
              label: option.label,
              isCorrect: option.isCorrect,
              order: option.order || optionIndex + 1,
            })),
          },
        })),
      },
    },
    include: examWithRelations,
  });
}

function mapCandidate(candidate: {
  id: string;
  fullName: string;
  matricNumber: string;
  phoneNumber: string;
  department: string;
  level: string;
  createdAt: Date;
}) {
  return {
    id: candidate.id,
    fullName: candidate.fullName,
    matricNumber: candidate.matricNumber,
    phoneNumber: candidate.phoneNumber,
    department: candidate.department,
    level: candidate.level,
    createdAt: candidate.createdAt.toISOString(),
  };
}

function mapExamQuestion(question: {
  id: string;
  prompt: string;
  explanation: string | null;
  order: number;
  options: Array<{ label: string; isCorrect: boolean; order: number }>;
}) {
  return {
    id: question.id,
    prompt: question.prompt,
    explanation: question.explanation ?? undefined,
    order: question.order,
    options: question.options
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((option) => ({
        label: option.label,
        isCorrect: option.isCorrect,
      })),
  };
}

function mapExam(exam: Awaited<ReturnType<typeof getOrCreateExam>>) {
  return {
    id: exam.id,
    title: exam.title,
    slug: exam.slug,
    instructions: exam.instructions ?? "",
    durationMinutes: exam.durationMinutes,
    status: exam.status,
    departments: exam.departments,
    levels: exam.levels,
    questions: exam.questions.map(mapExamQuestion),
  };
}

function normalizeOptionPayload(input: QuestionInput) {
  const options = input.options
    .map((option) => option.trim())
    .filter(Boolean)
    .map((label, index) => ({
      label,
      isCorrect: index === input.correctOptionIndex,
      order: index + 1,
    }));

  if (options.length < 2) {
    throw new Error("At least two options are required.");
  }

  if (!options.some((option) => option.isCorrect)) {
    throw new Error("A correct option must be selected.");
  }

  return options;
}

async function renumberQuestions(examId: string, tx: Prisma.TransactionClient = prisma) {
  const questions = await tx.examQuestion.findMany({
    where: { examId },
    orderBy: { order: "asc" },
    select: { id: true },
  });

  for (const [index, question] of questions.entries()) {
    await tx.examQuestion.update({
      where: { id: question.id },
      data: { order: 1000 + index },
    });
  }

  for (const [index, question] of questions.entries()) {
    await tx.examQuestion.update({
      where: { id: question.id },
      data: { order: index + 1 },
    });
  }
}

export async function registerCandidate(input: RegistrationInput) {
  const exam = await getOrCreateExam();

  const candidate = await prisma.candidate.create({
    data: {
      fullName: input.fullName,
      matricNumber: input.matricNumber,
      phoneNumber: input.phoneNumber,
      department: input.department,
      level: input.level,
    },
  });

  const session = await prisma.examSession.create({
    data: {
      examId: exam.id,
      candidateId: candidate.id,
      expiresAt: new Date(Date.now() + exam.durationMinutes * 60 * 1000),
      status: "ACTIVE",
    },
  });

  return {
    candidateId: candidate.id,
    sessionId: session.id,
    examSlug: exam.slug,
  };
}

export async function getExamForCandidate(candidateId: string) {
  const exam = await getOrCreateExam();
  const [candidate, session, submission] = await prisma.$transaction([
    prisma.candidate.findUnique({
      where: { id: candidateId },
    }),
    prisma.examSession.findUnique({
      where: {
        examId_candidateId: {
          examId: exam.id,
          candidateId,
        },
      },
    }),
    prisma.examSubmission.findUnique({
      where: {
        examId_candidateId: {
          examId: exam.id,
          candidateId,
        },
      },
      select: {
        id: true,
      },
    }),
  ]);

  if (!candidate) {
    throw new Error("Candidate not found.");
  }

  if (submission) {
    throw new Error("ALREADY_SUBMITTED");
  }

  if (!session) {
    throw new Error("Session not found.");
  }

  return {
    candidate: mapCandidate(candidate),
    exam: {
      id: exam.id,
      slug: exam.slug,
      title: exam.title,
      durationMinutes: exam.durationMinutes,
      instructions: exam.instructions ?? "",
      departments: exam.departments,
      levels: exam.levels,
      questions: exam.questions.map((question) => ({
        id: question.id,
        prompt: question.prompt,
        order: question.order,
        options: question.options
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((option) => option.label),
      })),
    },
    session: {
      id: session.id,
      status: session.status,
      expiresAt: session.expiresAt.toISOString(),
      completedAt: session.completedAt?.toISOString() ?? null,
    },
  };
}

export async function submitExam(input: SubmissionInput) {
  const exam = await prisma.exam.findUnique({
    where: { slug: input.examSlug },
    include: examWithRelations,
  });

  if (!exam) {
    throw new Error("Exam not found.");
  }

  const candidate = await prisma.candidate.findUnique({
    where: { id: input.candidateId },
  });

  if (!candidate) {
    throw new Error("Candidate not found.");
  }

  const answerMap = new Map(
    input.answers.map((answer) => [answer.questionId, answer.selectedOption ?? null]),
  );

  const results = exam.questions.map((question) => {
    const selectedOption = answerMap.get(question.id) ?? null;
    const correctAnswer =
      question.options.find((option) => option.isCorrect)?.label ?? "";

    return {
      questionId: question.id,
      questionOrder: question.order,
      prompt: question.prompt,
      explanation: question.explanation,
      selectedOption,
      correctAnswer,
      isCorrect: selectedOption !== null && selectedOption === correctAnswer,
    };
  });

  const score = results.filter((item) => item.isCorrect).length;
  const submittedAt = new Date();

  const submission = await prisma.$transaction(async (tx) => {
    await tx.examSession.updateMany({
      where: {
        examId: exam.id,
        candidateId: candidate.id,
        status: "ACTIVE",
      },
      data: {
        status: "SUBMITTED",
        completedAt: submittedAt,
      },
    });

    return tx.examSubmission.upsert({
      where: {
        examId_candidateId: {
          examId: exam.id,
          candidateId: candidate.id,
        },
      },
      create: {
        examId: exam.id,
        candidateId: candidate.id,
        score,
        totalQuestions: exam.questions.length,
        submittedAt,
        securityFlags: input.securityFlags,
        submittedAnswers: {
          create: results.map((item) => ({
            questionId: item.questionId,
            questionOrder: item.questionOrder,
            prompt: item.prompt,
            explanation: item.explanation,
            correctAnswer: item.correctAnswer,
            selectedOption: item.selectedOption,
            isCorrect: item.isCorrect,
          })),
        },
      },
      update: {
        score,
        totalQuestions: exam.questions.length,
        submittedAt,
        securityFlags: input.securityFlags,
        submittedAnswers: {
          deleteMany: {},
          create: results.map((item) => ({
            questionId: item.questionId,
            questionOrder: item.questionOrder,
            prompt: item.prompt,
            explanation: item.explanation,
            correctAnswer: item.correctAnswer,
            selectedOption: item.selectedOption,
            isCorrect: item.isCorrect,
          })),
        },
      },
    });
  });

  return {
    submissionId: submission.id,
    score,
    totalQuestions: exam.questions.length,
    candidate: mapCandidate(candidate),
    submittedAt: submittedAt.toISOString(),
    results: results.map((item) => ({
      questionId: item.questionId,
      prompt: item.prompt,
      explanation: item.explanation,
      selectedOption: item.selectedOption,
      correctAnswer: item.correctAnswer,
      isCorrect: item.isCorrect,
    })),
  };
}

export async function getAdminDashboardData() {
  const exam = await getOrCreateExam();

  const [candidates, sessions, submissions] = await prisma.$transaction([
    prisma.candidate.findMany({
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.examSession.findMany({
      where: {
        examId: exam.id,
      },
    }),
    prisma.examSubmission.findMany({
      where: {
        examId: exam.id,
      },
      include: {
        candidate: true,
      },
      orderBy: {
        submittedAt: "desc",
      },
    }),
  ]);

  const activeSessions = sessions.filter((session) => session.status === "ACTIVE").length;
  const averageScore =
    submissions.length === 0
      ? 0
      : Math.round(
          submissions.reduce((total, submission) => total + submission.score, 0) /
            submissions.length,
        );

  const departmentMap = new Map<string, { total: number; submitted: number }>();
  const levelMap = new Map<string, number>();
  const submissionByCandidateId = new Map(
    submissions.map((submission) => [submission.candidateId, submission]),
  );
  const sessionByCandidateId = new Map(
    sessions.map((session) => [session.candidateId, session]),
  );

  for (const candidate of candidates) {
    const departmentEntry = departmentMap.get(candidate.department) ?? {
      total: 0,
      submitted: 0,
    };
    departmentEntry.total += 1;
    if (submissionByCandidateId.has(candidate.id)) {
      departmentEntry.submitted += 1;
    }
    departmentMap.set(candidate.department, departmentEntry);

    levelMap.set(candidate.level, (levelMap.get(candidate.level) ?? 0) + 1);
  }

  const students = candidates.map((candidate) => {
    const submission = submissionByCandidateId.get(candidate.id);
    const session = sessionByCandidateId.get(candidate.id);

    return {
      id: candidate.id,
      fullName: candidate.fullName,
      matricNumber: candidate.matricNumber,
      phoneNumber: candidate.phoneNumber,
      department: candidate.department,
      level: candidate.level,
      registeredAt: candidate.createdAt.toISOString(),
      submissionId: submission?.id ?? null,
      score: submission?.score ?? null,
      totalQuestions: submission?.totalQuestions ?? null,
      status: submission
        ? "Submitted"
        : session?.status === "ACTIVE"
          ? "In Progress"
          : "Registered",
      securityFlags: submission?.securityFlags ?? 0,
    };
  });

  return {
    exam: {
      title: exam.title,
      slug: exam.slug,
      durationMinutes: exam.durationMinutes,
      status: exam.status,
      departments: exam.departments,
      levels: exam.levels,
    },
    stats: [
      {
        label: "Registered Candidates",
        value: candidates.length,
        note: "Students who have completed the first church exam registration step.",
      },
      {
        label: "Submitted Papers",
        value: submissions.length,
        note: "Exam scripts already submitted and saved on the backend.",
      },
      {
        label: "Average Score",
        value: `${averageScore}/${exam.questions.length}`,
        note: "This is now derived from backend submissions, not browser storage.",
      },
      {
        label: "Active Sessions",
        value: activeSessions,
        note: "Candidates who registered and started but have not submitted yet.",
      },
    ],
    submissions: submissions.map((submission) => ({
      id: submission.id,
      candidateName: submission.candidate.fullName,
      matricNumber: submission.candidate.matricNumber,
      phoneNumber: submission.candidate.phoneNumber,
      department: submission.candidate.department,
      level: submission.candidate.level,
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      securityFlags: submission.securityFlags,
      submittedAt: submission.submittedAt.toISOString(),
    })),
    students,
    departments: Array.from(departmentMap.entries())
      .map(([name, values]) => ({
        name,
        registered: values.total,
        submitted: values.submitted,
      }))
      .sort((a, b) => b.registered - a.registered),
    analytics: {
      levelDistribution: Array.from(levelMap.entries())
        .map(([level, count]) => ({
          label: `${level} Level`,
          count,
        }))
        .sort((a, b) => a.label.localeCompare(b.label)),
      scoreBands: [
        {
          label: "High (70%+)",
          count: submissions.filter(
            (submission) =>
              submission.totalQuestions > 0 &&
              submission.score / submission.totalQuestions >= 0.7,
          ).length,
        },
        {
          label: "Mid (40-69%)",
          count: submissions.filter((submission) => {
            if (submission.totalQuestions === 0) {
              return false;
            }
            const percentage = submission.score / submission.totalQuestions;
            return percentage >= 0.4 && percentage < 0.7;
          }).length,
        },
        {
          label: "Low (0-39%)",
          count: submissions.filter((submission) => {
            if (submission.totalQuestions === 0) {
              return false;
            }
            return submission.score / submission.totalQuestions < 0.4;
          }).length,
        },
      ],
    },
  };
}

export async function getCandidateResult(candidateId: string) {
  const exam = await getOrCreateExam();

  const [candidate, submission] = await prisma.$transaction([
    prisma.candidate.findUnique({
      where: { id: candidateId },
    }),
    prisma.examSubmission.findUnique({
      where: {
        examId_candidateId: {
          examId: exam.id,
          candidateId,
        },
      },
      include: {
        submittedAnswers: {
          orderBy: {
            questionOrder: "asc",
          },
        },
      },
    }),
  ]);

  if (!candidate || !submission) {
    throw new Error("Result not found.");
  }

  return {
    candidate: mapCandidate(candidate),
    submission: {
      id: submission.id,
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      submittedAt: submission.submittedAt.toISOString(),
    },
    questions: submission.submittedAnswers.map((answer) => ({
      id: answer.questionId,
      prompt: answer.prompt,
      explanation: answer.explanation,
      correctAnswer: answer.correctAnswer,
      userAnswer: answer.selectedOption,
      isCorrect: answer.isCorrect,
    })),
  };
}

export async function getAdminExamData() {
  const exam = await getOrCreateExam();

  return {
    exam: mapExam(exam),
  };
}

export async function updateExamSettings(input: ExamSettingsInput) {
  const exam = await getOrCreateExam();

  const updated = await prisma.exam.update({
    where: { id: exam.id },
    data: {
      title: input.title,
      slug: input.slug,
      instructions: input.instructions,
      durationMinutes: input.durationMinutes,
      status: input.status as ExamStatus,
      departments: input.departments,
      levels: input.levels,
    },
    include: examWithRelations,
  });

  return mapExam(updated);
}

export async function createQuestion(input: QuestionInput) {
  const exam = await getOrCreateExam();
  const options = normalizeOptionPayload(input);

  await prisma.examQuestion.create({
    data: {
      examId: exam.id,
      prompt: input.prompt.trim(),
      explanation: input.explanation?.trim() || null,
      order: exam.questions.length + 1,
      options: {
        create: options,
      },
    },
  });

  const refreshed = await getOrCreateExam();
  return refreshed.questions.map(mapExamQuestion);
}

export async function updateQuestion(questionId: string, input: QuestionInput) {
  const options = normalizeOptionPayload(input);

  const existing = await prisma.examQuestion.findUnique({
    where: { id: questionId },
    include: {
      options: true,
    },
  });

  if (!existing) {
    throw new Error("Question not found.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.examQuestion.update({
      where: { id: questionId },
      data: {
        prompt: input.prompt.trim(),
        explanation: input.explanation?.trim() || null,
      },
    });

    await tx.questionOption.deleteMany({
      where: { questionId },
    });

    await tx.questionOption.createMany({
      data: options.map((option) => ({
        questionId,
        label: option.label,
        isCorrect: option.isCorrect,
        order: option.order,
      })),
    });

    return tx.examQuestion.findUnique({
      where: { id: questionId },
      include: {
        options: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });
  });

  if (!updated) {
    throw new Error("Question not found.");
  }

  return mapExamQuestion(updated);
}

export async function deleteQuestion(questionId: string) {
  const existing = await prisma.examQuestion.findUnique({
    where: { id: questionId },
    select: {
      id: true,
      examId: true,
    },
  });

  if (!existing) {
    throw new Error("Question not found.");
  }

  await prisma.$transaction(async (tx) => {
    await tx.examQuestion.delete({
      where: { id: questionId },
    });

    await renumberQuestions(existing.examId, tx);
  });

  const refreshed = await prisma.exam.findUnique({
    where: { id: existing.examId },
    include: examWithRelations,
  });

  if (!refreshed) {
    throw new Error("Exam not found.");
  }

  return refreshed.questions.map(mapExamQuestion);
}

export async function getSubmissionDetail(submissionId: string) {
  const submission = await prisma.examSubmission.findUnique({
    where: { id: submissionId },
    include: {
      candidate: true,
      exam: true,
      submittedAnswers: {
        orderBy: {
          questionOrder: "asc",
        },
      },
    },
  });

  if (!submission) {
    throw new Error("Submission not found.");
  }

  return {
    candidate: mapCandidate(submission.candidate),
    submission: {
      id: submission.id,
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      submittedAt: submission.submittedAt.toISOString(),
      securityFlags: submission.securityFlags,
    },
    exam: {
      title: submission.exam.title,
      slug: submission.exam.slug,
      durationMinutes: submission.exam.durationMinutes,
    },
    answers: submission.submittedAnswers.map((answer) => ({
      questionId: answer.questionId,
      prompt: answer.prompt,
      explanation: answer.explanation,
      correctAnswer: answer.correctAnswer,
      selectedOption: answer.selectedOption,
      isCorrect: answer.isCorrect,
    })),
  };
}

export async function getPortalConfig() {
  const exam = await getOrCreateExam();

  return {
    exam: {
      title: exam.title,
      departments: exam.departments,
      levels: exam.levels,
    },
  };
}

export async function getAdminResultsExportData() {
  const exam = await getOrCreateExam();

  const submissions = await prisma.examSubmission.findMany({
    where: {
      examId: exam.id,
    },
    include: {
      candidate: true,
    },
    orderBy: {
      submittedAt: "desc",
    },
  });

  return {
    exam: {
      title: exam.title,
      slug: exam.slug,
      totalQuestions: exam.questions.length,
    },
    submissions: submissions.map((submission) => ({
      candidateName: submission.candidate.fullName,
      matricNumber: submission.candidate.matricNumber,
      phoneNumber: submission.candidate.phoneNumber,
      department: submission.candidate.department,
      level: submission.candidate.level,
      score: submission.score,
      totalQuestions: submission.totalQuestions,
      percentage:
        submission.totalQuestions > 0
          ? Math.round((submission.score / submission.totalQuestions) * 100)
          : 0,
      securityFlags: submission.securityFlags,
      submittedAt: submission.submittedAt.toISOString(),
    })),
  };
}
