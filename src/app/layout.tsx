import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ToastProvider } from "@/components/toast-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "MFMCF Exam Portal",
  description: "Student exam portal and admin dashboard for MFMCF UNIOSUN.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ToastProvider>
          <div className="app-shell">{children}</div>
        </ToastProvider>
      </body>
    </html>
  );
}
