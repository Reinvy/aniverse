"use client";

import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { Menu, Sparkles } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <AuthGuard>
      <div className="flex min-h-screen bg-[#05080F] bg-noise">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Mobile header bar — Game HUD style */}
        <div className="fixed inset-x-0 top-0 z-30 flex h-14 items-center gap-3 border-b border-white/5 bg-[#0B0F19]/95 backdrop-blur-xl px-4 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 hover:bg-white/5 hover:text-white/80 transition-colors"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[rgba(229,197,135,0.3)] to-[rgba(229,197,135,0.1)] border border-[rgba(229,197,135,0.3)]">
              <Sparkles className="h-3.5 w-3.5 text-[#e5c587]" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              {APP_NAME}
            </span>
            <span className="sys-label hidden xs:inline ml-1">v2.4</span>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden pt-14 lg:ml-64 lg:pt-0 bg-starfield">
          {/* Subtle grid overlay */}
          <div className="fixed inset-0 pointer-events-none bg-grid opacity-30" />
          <div className="relative z-10 animate-stagger">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
