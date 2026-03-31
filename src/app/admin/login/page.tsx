"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AdminLoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json()) as { error?: string };

      if (!response.ok) {
        setErrorMessage(data.error ?? "Unable to sign in.");
        setSubmitting(false);
        return;
      }

      router.push(nextPath);
      router.refresh();
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to sign in.");
      setSubmitting(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f9fa] px-5 py-8">
      <section className="w-full max-w-md rounded-2xl bg-white p-8 shadow-[0_12px_35px_rgba(0,0,0,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#ba124f]">
          Admin Access
        </p>
        <h1 className="mt-3 text-3xl font-bold text-[#7e1137]">Sign in to the admin side</h1>
        <p className="mt-3 text-sm leading-6 text-[#666]">
          This protects exam creation, question management, and student script review.
        </p>

        <form className="mt-8 space-y-4" onSubmit={(event) => void handleSubmit(event)}>
          <div>
            <label className="mb-2 block text-sm font-semibold text-[#555]">Username</label>
            <input
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="w-full rounded-md border border-[#ddd] px-4 py-3 text-[#222] outline-none transition focus:border-[#ba124f]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#555]">Password</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-md border border-[#ddd] px-4 py-3 text-[#222] outline-none transition focus:border-[#ba124f]"
            />
          </div>

          {errorMessage ? (
            <p className="rounded-md bg-[rgba(244,67,54,0.08)] px-4 py-3 text-sm text-[#c62828]">
              {errorMessage}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-[#ba124f] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#9a0f41] disabled:opacity-70"
          >
            {submitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen p-10 text-center">Loading admin login...</main>}>
      <AdminLoginPageContent />
    </Suspense>
  );
}
