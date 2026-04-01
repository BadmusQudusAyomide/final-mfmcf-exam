"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa";

type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastItem {
  id: number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<ToastVariant, string> = {
  success:
    "border-[#d3ead9] bg-[linear-gradient(135deg,rgba(244,255,247,0.98),rgba(231,248,236,0.95))] text-[#1f6c38]",
  error:
    "border-[#f1c7d3] bg-[linear-gradient(135deg,rgba(255,247,249,0.98),rgba(255,236,241,0.95))] text-[#9d1f46]",
  warning:
    "border-[#f2d6bc] bg-[linear-gradient(135deg,rgba(255,249,242,0.98),rgba(255,239,223,0.95))] text-[#9a5d1d]",
  info:
    "border-[#ead8f0] bg-[linear-gradient(135deg,rgba(254,249,255,0.98),rgba(247,236,250,0.95))] text-[#7e1137]",
};

const variantBarStyles: Record<ToastVariant, string> = {
  success: "from-[#1f6c38] to-[#67b47d]",
  error: "from-[#9d1f46] to-[#d55a82]",
  warning: "from-[#9a5d1d] to-[#d09041]",
  info: "from-[#7e1137] to-[#c76c95]",
};

const variantIcons = {
  success: FaCheckCircle,
  error: FaTimes,
  warning: FaExclamationTriangle,
  info: FaInfoCircle,
} satisfies Record<ToastVariant, typeof FaInfoCircle>;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((toast: Omit<ToastItem, "id">) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((current) => [...current, { ...toast, id }]);

    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4500);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed top-4 right-4 z-[2000] flex w-[min(92vw,390px)] flex-col gap-3">
        {toasts.map((toast) => {
          const Icon = variantIcons[toast.variant];
          return (
            <div
              key={toast.id}
              className={`pointer-events-auto relative overflow-hidden rounded-[24px] border px-4 py-4 shadow-[0_22px_48px_rgba(126,17,55,0.16)] ring-1 ring-white/60 backdrop-blur-xl ${variantStyles[toast.variant]} motion-safe:animate-[fadeInDown_0.35s_ease-out]`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${variantBarStyles[toast.variant]}`}
              />
              <div className="absolute -top-10 -right-8 h-28 w-28 rounded-full bg-white/35 blur-2xl" />
              <div className="flex items-start gap-3">
                <div className="rounded-full border border-white/65 bg-white/80 p-2.5 shadow-[0_8px_18px_rgba(126,17,55,0.08)]">
                  <Icon className="text-base" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold tracking-[0.01em]">{toast.title}</p>
                  {toast.description ? (
                    <p className="mt-1 text-sm leading-6 text-current/85">{toast.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setToasts((current) => current.filter((item) => item.id !== toast.id))
                  }
                  className="rounded-full p-1.5 text-current/70 transition hover:bg-white/60 hover:text-current"
                  aria-label="Dismiss notification"
                >
                  <FaTimes />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider.");
  }

  return context;
}
