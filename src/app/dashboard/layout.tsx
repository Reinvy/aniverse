"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-zinc-950">
        <Sidebar />
        <main className="ml-64 flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
