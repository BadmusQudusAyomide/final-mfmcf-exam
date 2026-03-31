"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminShell } from "@/components/admin-shell";

interface AdminQuestion {
  id: string;
  prompt: string;
  explanation?: string;
  order: number;
  options: Array<{
    label: string;
    isCorrect: boolean;
  }>;
}

interface AdminExam {
  id: string;
  title: string;
  slug: string;
  instructions: string;
  durationMinutes: number;
  status: "DRAFT" | "PUBLISHED" | "CLOSED";
  departments: string[];
  levels: string[];
  questions: AdminQuestion[];
}

const emptyQuestionForm = {
  prompt: "",
  explanation: "",
  options: ["", "", "", ""],
  correctOptionIndex: 0,
};

export default function AdminExamPage() {
  const [exam, setExam] = useState<AdminExam | null>(null);
  const [settingsMessage, setSettingsMessage] = useState("");
  const [questionMessage, setQuestionMessage] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [savingQuestion, setSavingQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState(emptyQuestionForm);
  const [questionSearch, setQuestionSearch] = useState("");

  useEffect(() => {
    async function loadExam() {
      const response = await fetch("/api/admin/exam");
      const data = (await response.json()) as { exam?: AdminExam };
      if (data.exam) {
        setExam(data.exam);
      }
    }

    void loadExam();
  }, []);

  const filteredQuestions = useMemo(() => {
    if (!exam) {
      return [];
    }

    const search = questionSearch.trim().toLowerCase();
    if (!search) {
      return exam.questions;
    }

    return exam.questions.filter((question) =>
      question.prompt.toLowerCase().includes(search) ||
      (question.explanation ?? "").toLowerCase().includes(search),
    );
  }, [exam, questionSearch]);

  async function handleSettingsSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!exam) return;

    const formData = new FormData(event.currentTarget);
    setSavingSettings(true);
    setSettingsMessage("");

    const payload = {
      title: String(formData.get("title") ?? ""),
      slug: String(formData.get("slug") ?? ""),
      instructions: String(formData.get("instructions") ?? ""),
      durationMinutes: Number(formData.get("durationMinutes") ?? 35),
      status: String(formData.get("status") ?? "DRAFT"),
      departments: String(formData.get("departments") ?? "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      levels: String(formData.get("levels") ?? "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const response = await fetch("/api/admin/exam", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as { exam?: AdminExam; error?: string };

    if (response.ok && data.exam) {
      setExam(data.exam);
      setSettingsMessage("Exam settings saved successfully.");
    } else {
      setSettingsMessage(data.error ?? "Unable to save settings.");
    }

    setSavingSettings(false);
  }

  async function saveQuestion() {
    if (!exam) return;

    setSavingQuestion(true);
    setQuestionMessage("");

    const payload = {
      prompt: questionForm.prompt,
      explanation: questionForm.explanation,
      options: questionForm.options,
      correctOptionIndex: questionForm.correctOptionIndex,
    };

    const endpoint = editingQuestionId
      ? `/api/admin/questions/${editingQuestionId}`
      : "/api/admin/questions";
    const method = editingQuestionId ? "PUT" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = (await response.json()) as
      | { questions?: AdminQuestion[]; question?: AdminQuestion; error?: string };

    if (!response.ok) {
      setQuestionMessage(data.error ?? "Unable to save question.");
      setSavingQuestion(false);
      return;
    }

    if (editingQuestionId && data.question) {
      setExam({
        ...exam,
        questions: exam.questions.map((question) =>
          question.id === data.question?.id ? data.question : question,
        ),
      });
    }

    if (!editingQuestionId && data.questions) {
      setExam({
        ...exam,
        questions: data.questions,
      });
    }

    setQuestionForm(emptyQuestionForm);
    setEditingQuestionId(null);
    setQuestionMessage(editingQuestionId ? "Question updated." : "Question created.");
    setSavingQuestion(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function removeQuestion(questionId: string) {
    if (!exam) return;

    const response = await fetch(`/api/admin/questions/${questionId}`, {
      method: "DELETE",
    });
    const data = (await response.json()) as { questions?: AdminQuestion[]; error?: string };

    if (response.ok && data.questions) {
      setExam({
        ...exam,
        questions: data.questions,
      });
      if (editingQuestionId === questionId) {
        setEditingQuestionId(null);
        setQuestionForm(emptyQuestionForm);
      }
      setQuestionMessage("Question deleted.");
    } else {
      setQuestionMessage(data.error ?? "Unable to delete question.");
    }
  }

  function startEdit(question: AdminQuestion) {
    setEditingQuestionId(question.id);
    setQuestionForm({
      prompt: question.prompt,
      explanation: question.explanation ?? "",
      options: question.options.map((option) => option.label).concat(["", "", "", ""]).slice(0, 4),
      correctOptionIndex: Math.max(
        question.options.findIndex((option) => option.isCorrect),
        0,
      ),
    });
    setQuestionMessage(`Now editing Question ${question.order}. Save to update this exact question.`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!exam) {
    return <main className="min-h-screen p-10 text-center">Loading admin exam page...</main>;
  }

  return (
    <AdminShell
      current="exam"
      title="Exam Builder and Question Management"
      description="Control the published exam, allowed departments and levels, and manage questions from a clearer builder experience."
    >
      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <section className="rounded-[24px] border border-white/65 bg-white/75 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#7e1137]">Exam Settings</h3>
                <p className="text-sm text-[#655a61]">
                  These settings control what students see on the registration flow.
                </p>
              </div>
              <div className="rounded-full bg-[#7e1137] px-4 py-2 text-sm font-semibold text-white">
                {exam.questions.length} questions
              </div>
            </div>

            <form className="mt-6 space-y-4" onSubmit={(event) => void handleSettingsSubmit(event)}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#555]">Exam Title</label>
                <input
                  name="title"
                  defaultValue={exam.title}
                  className="w-full rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-[#2c262a] outline-none transition focus:border-[#7e1137]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#555]">Slug</label>
                  <input
                    name="slug"
                    defaultValue={exam.slug}
                    className="w-full rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-[#2c262a] outline-none transition focus:border-[#7e1137]"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#555]">Duration in Minutes</label>
                  <input
                    name="durationMinutes"
                    type="number"
                    defaultValue={exam.durationMinutes}
                    className="w-full rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-[#2c262a] outline-none transition focus:border-[#7e1137]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#555]">Status</label>
                <select
                  name="status"
                  defaultValue={exam.status}
                  className="w-full rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-[#2c262a] outline-none transition focus:border-[#7e1137]"
                >
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="CLOSED">Closed</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#555]">Instructions</label>
                <textarea
                  name="instructions"
                  defaultValue={exam.instructions}
                  rows={4}
                  className="w-full rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-[#2c262a] outline-none transition focus:border-[#7e1137]"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#555]">Departments</label>
                  <textarea
                    name="departments"
                    defaultValue={exam.departments.join("\n")}
                    rows={7}
                    className="w-full rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-[#2c262a] outline-none transition focus:border-[#7e1137]"
                  />
                  <p className="mt-2 text-xs text-[#7d7378]">Use one department per line.</p>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#555]">Levels</label>
                  <textarea
                    name="levels"
                    defaultValue={exam.levels.join("\n")}
                    rows={7}
                    className="w-full rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-[#2c262a] outline-none transition focus:border-[#7e1137]"
                  />
                  <p className="mt-2 text-xs text-[#7d7378]">Use one level per line.</p>
                </div>
              </div>

              {settingsMessage ? (
                <p className="rounded-2xl bg-[#fff4f8] px-4 py-3 text-sm text-[#7e1137]">
                  {settingsMessage}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={savingSettings}
                className="rounded-2xl bg-[#7e1137] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#65102d] disabled:opacity-70"
              >
                {savingSettings ? "Saving..." : "Save Exam Settings"}
              </button>
            </form>
          </section>

          <section className="rounded-[24px] border border-white/65 bg-white/75 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold text-[#7e1137]">
                  {editingQuestionId ? "Editing Question" : "Create Question"}
                </h3>
                <p className="text-sm text-[#655a61]">
                  {editingQuestionId
                    ? "You are editing an existing question. Save to update it immediately."
                    : "Add a new question and choose exactly one correct option."}
                </p>
              </div>
              {editingQuestionId ? (
                <button
                  type="button"
                  onClick={() => {
                    setEditingQuestionId(null);
                    setQuestionForm(emptyQuestionForm);
                    setQuestionMessage("");
                  }}
                  className="rounded-2xl bg-[#7e1137] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#65102d]"
                >
                  Stop Editing
                </button>
              ) : null}
            </div>

            {questionMessage ? (
              <p className="mt-5 rounded-2xl bg-[#f7f0ff] px-4 py-3 text-sm text-[#63458f]">
                {questionMessage}
              </p>
            ) : null}

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#555]">Question Prompt</label>
                <textarea
                  rows={4}
                  value={questionForm.prompt}
                  onChange={(event) =>
                    setQuestionForm((current) => ({ ...current, prompt: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-[#2c262a] outline-none transition focus:border-[#7e1137]"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#555]">Explanation</label>
                <textarea
                  rows={3}
                  value={questionForm.explanation}
                  onChange={(event) =>
                    setQuestionForm((current) => ({ ...current, explanation: event.target.value }))
                  }
                  className="w-full rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-[#2c262a] outline-none transition focus:border-[#7e1137]"
                />
              </div>

              {questionForm.options.map((option, index) => (
                <div
                  key={index}
                  className="grid gap-3 rounded-2xl border border-[#efe2e7] bg-[#fffdfd] p-4 md:grid-cols-[auto_1fr]"
                >
                  <label className="flex items-center gap-2 text-sm font-semibold text-[#555]">
                    <input
                      type="radio"
                      name="correctOption"
                      checked={questionForm.correctOptionIndex === index}
                      onChange={() =>
                        setQuestionForm((current) => ({
                          ...current,
                          correctOptionIndex: index,
                        }))
                      }
                    />
                    Mark as Correct
                  </label>
                  <input
                    value={option}
                    onChange={(event) =>
                      setQuestionForm((current) => ({
                        ...current,
                        options: current.options.map((item, itemIndex) =>
                          itemIndex === index ? event.target.value : item,
                        ),
                      }))
                    }
                    placeholder={`Option ${index + 1}`}
                    className="w-full rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-[#2c262a] outline-none transition focus:border-[#7e1137]"
                  />
                </div>
              ))}

              <button
                type="button"
                onClick={() => void saveQuestion()}
                disabled={savingQuestion}
                className="rounded-2xl bg-[#7e1137] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#65102d] disabled:opacity-70"
              >
                {savingQuestion
                  ? "Saving..."
                  : editingQuestionId
                    ? "Update Question"
                    : "Create Question"}
              </button>
            </div>
          </section>
        </div>

        <section className="rounded-[24px] border border-white/65 bg-white/75 p-6 shadow-[0_16px_40px_rgba(91,16,43,0.08)] backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold text-[#7e1137]">
                Question Management ({exam.questions.length})
              </h3>
              <p className="text-sm text-[#655a61]">
                Search, review, and edit existing questions directly from this list.
              </p>
            </div>
            <input
              value={questionSearch}
              onChange={(event) => setQuestionSearch(event.target.value)}
              placeholder="Search questions..."
              className="rounded-2xl border border-[#e0d3d9] bg-white px-4 py-3 text-sm text-[#2c262a] outline-none transition focus:border-[#7e1137]"
            />
          </div>

          <div className="mt-6 space-y-4">
            {filteredQuestions.map((question) => {
              const isEditing = editingQuestionId === question.id;

              return (
                <article
                  key={question.id}
                  className={`rounded-[22px] border p-5 transition ${
                    isEditing
                      ? "border-[#c28aa0] bg-[#fff4f8] shadow-[0_14px_30px_rgba(91,16,43,0.10)]"
                      : "border-[#eee] bg-[#fffdfd]"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#f7f0ff] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#6646a0]">
                          Question {question.order}
                        </span>
                        {isEditing ? (
                          <span className="rounded-full bg-[#7e1137] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white">
                            Currently Editing
                          </span>
                        ) : null}
                      </div>
                      <h4 className="mt-3 text-lg font-semibold text-[#332b30]">{question.prompt}</h4>
                      {question.explanation ? (
                        <p className="mt-2 text-sm leading-6 text-[#655a61]">{question.explanation}</p>
                      ) : null}
                      <div className="mt-4 grid gap-2">
                        {question.options.map((option) => (
                          <div
                            key={`${question.id}-${option.label}`}
                            className={`rounded-2xl px-4 py-3 text-sm ${
                              option.isCorrect
                                ? "bg-[rgba(76,175,80,0.10)] text-[#2f7d32]"
                                : "bg-[#f8f9fa] text-[#555]"
                            }`}
                          >
                            {option.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(question)}
                        className="rounded-2xl bg-[#7e1137] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#65102d]"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void removeQuestion(question.id)}
                        className="rounded-2xl bg-[#d83a52] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bf2f45]"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}

            {filteredQuestions.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#d9c6ce] px-4 py-10 text-center text-[#776b72]">
                No questions matched your search.
              </div>
            ) : null}
          </div>
        </section>
      </section>
    </AdminShell>
  );
}
