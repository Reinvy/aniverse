"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Menu } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-zinc-950">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Mobile header bar */}
        <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-zinc-800/60 bg-zinc-950/90 px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-600 to-fuchsia-600">
              <span className="text-xs font-bold text-white">A</span>
            </div>
            <span className="text-sm font-semibold text-white">
              {APP_NAME}
            </span>
          </div>
        </div>

        <main className="flex-1 overflow-x-hidden pt-14 lg:ml-64 lg:pt-0">
          {children}
        </main>
      </div>
    </AuthGuard>
  );
}
