"use client";

import { useRouter } from "next/navigation";

export function AdminLogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin/logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={() => void handleLogout()}
      className="rounded-full border border-white/40 bg-[#7e1137] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#65102d]"
    >
      Log Out
    </button>
  );
}
