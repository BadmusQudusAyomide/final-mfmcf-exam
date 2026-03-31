import { expect, test } from "@playwright/test";

type RegistrationPayload = {
  candidateId: string;
  sessionId: string;
  examSlug: string;
};

type ExamPayload = {
  candidate: {
    fullName: string;
    matricNumber: string;
  };
  exam: {
    slug: string;
    questions: Array<{ id: string; options: string[] }>;
  };
};

type ResultPayload = {
  candidate: {
    fullName: string;
  };
  submission: {
    score: number;
    totalQuestions: number;
  };
  questions: Array<{ prompt: string }>;
};

const adminUsername = process.env.ADMIN_USERNAME ?? "admin";
const adminPassword = process.env.ADMIN_PASSWORD ?? "church123";

async function signInAsAdmin(
  request: Parameters<Parameters<typeof test>[1]>[0]["request"],
  page: Parameters<Parameters<typeof test>[1]>[0]["page"],
) {
  const response = await request.post("/api/admin/login", {
    data: {
      username: adminUsername,
      password: adminPassword,
    },
  });

  expect(response.ok()).toBeTruthy();

  const setCookie = response.headers()["set-cookie"];
  const match = setCookie?.match(/mfmcf_admin_session=([^;]+)/);
  expect(match).toBeTruthy();

  await page.context().addCookies([
    {
      name: "mfmcf_admin_session",
      value: match![1],
      domain: "127.0.0.1",
      path: "/",
      httpOnly: true,
      sameSite: "Lax",
    },
  ]);
}

test.describe.serial("church exam smoke suite", () => {
  const unique = Date.now();
  const candidateName = `E2E Candidate ${unique}`;
  const matricNumber = `E2E/${unique}`;
  const phoneNumber = `080${String(unique).slice(-8)}`;

  let registration: RegistrationPayload;
  let examPayload: ExamPayload;
  let resultPayload: ResultPayload;

  test("student portal home page loads", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await expect(page.getByText("STUDENT PORTAL")).toBeVisible();
    await expect(page.getByRole("button", { name: "Take Exam" })).toBeVisible();
  });

  test("portal config API returns departments and levels", async ({ request }) => {
    const response = await request.get("/api/portal-config");
    expect(response.ok()).toBeTruthy();

    const payload = (await response.json()) as {
      exam: { departments: string[]; levels: string[] };
    };

    expect(payload.exam.departments.length).toBeGreaterThan(0);
    expect(payload.exam.levels.length).toBeGreaterThan(0);
  });

  test("registration API creates a candidate session", async ({ request }) => {
    const response = await request.post("/api/register", {
      data: {
        fullName: candidateName,
        matricNumber,
        department: "Choir",
        level: "100",
        phoneNumber,
      },
    });

    expect(response.ok()).toBeTruthy();
    registration = (await response.json()) as RegistrationPayload;

    expect(registration.candidateId).toBeTruthy();
    expect(registration.sessionId).toBeTruthy();
    expect(registration.examSlug).toBeTruthy();
  });

  test("instruction page opens for the registered candidate", async ({ page }) => {
    await page.goto(`/instruction?candidateId=${registration.candidateId}`);
    await expect(page.getByRole("heading", { name: "Important Instructions" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Start Exam" })).toBeVisible();
  });

  test("exam API returns the current 50-question paper", async ({ request }) => {
    const response = await request.get(`/api/exam?candidateId=${registration.candidateId}`);
    expect(response.ok()).toBeTruthy();

    examPayload = (await response.json()) as ExamPayload;

    expect(examPayload.candidate.fullName).toBe(candidateName);
    expect(examPayload.candidate.matricNumber).toBe(matricNumber);
    expect(examPayload.exam.slug).toBe(registration.examSlug);
    expect(examPayload.exam.questions.length).toBe(50);
  });

  test("submit API accepts answers for the registered candidate", async ({ request }) => {
    const response = await request.post("/api/submit", {
      data: {
        candidateId: registration.candidateId,
        examSlug: examPayload.exam.slug,
        answers: examPayload.exam.questions.map((question, index) => ({
          questionId: question.id,
          selectedOption: index < 5 ? question.options[0] : undefined,
        })),
      },
    });

    expect(response.ok()).toBeTruthy();

    const payload = (await response.json()) as {
      submissionId: string;
      totalQuestions: number;
    };

    expect(payload.submissionId).toBeTruthy();
    expect(payload.totalQuestions).toBe(50);
  });

  test("result API returns saved result data", async ({ request }) => {
    const response = await request.get(`/api/result?candidateId=${registration.candidateId}`);
    expect(response.ok()).toBeTruthy();

    resultPayload = (await response.json()) as ResultPayload;

    expect(resultPayload.candidate.fullName).toBe(candidateName);
    expect(resultPayload.submission.totalQuestions).toBe(50);
    expect(resultPayload.questions.length).toBe(50);
  });

  test("admin login page loads", async ({ page }) => {
    await page.goto("/admin/login");
    await expect(page.getByRole("heading", { name: "Sign in to the admin side" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();
  });

  test("admin dashboard shows the latest candidate after sign in", async ({ page, request }) => {
    await signInAsAdmin(request, page);

    await page.goto("/admin");
    await expect(page).toHaveURL(/\/admin$/);
    await expect(
      page.getByRole("heading", { name: "MFMCF Exam Dashboard" }).first(),
    ).toBeVisible();
    await expect(page.getByText(candidateName).first()).toBeVisible();
  });

  test("admin submissions page opens the candidate script", async ({ page, request }) => {
    await signInAsAdmin(request, page);

    await page.goto("/admin/submissions");
    await expect(page.getByRole("heading", { name: "All Submissions" })).toBeVisible();

    const row = page.locator("tr").filter({ hasText: candidateName }).first();
    await expect(row).toContainText(matricNumber);
    await row.getByRole("link", { name: "View Script" }).click();

    await expect(page).toHaveURL(/\/admin\/submissions\//);
    await expect(page.getByRole("heading", { name: "Full Script" })).toBeVisible();
    await expect(page.getByText(candidateName).first()).toBeVisible();
  });
});
