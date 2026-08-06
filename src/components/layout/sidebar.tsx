"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  Wand2,
  Store,
  Share2,
  DollarSign,
  Trophy,
  Sparkles,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { useEffect } from "react";

const sidebarNav = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Gallery", href: "/dashboard/gallery", icon: Image },
  { label: "Create", href: "/dashboard/create", icon: Wand2 },
  { label: "Marketplace", href: "/dashboard/marketplace", icon: Store },
  { label: "Social", href: "/dashboard/social", icon: Share2 },
  { label: "Challenges", href: "/dashboard/challenges", icon: Trophy },
  { label: "Monetization", href: "/dashboard/monetization", icon: DollarSign },
] as const;

export function Sidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const sidebarContent = (
    <div className="flex flex-col h-full watermark-crest bg-noise">
      <>
      {/* Logo / Brand — Game-style header */}
      <div className="relative flex h-16 items-center justify-between border-b border-white/5 px-5">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(229,197,135,0.3)] to-[rgba(229,197,135,0.1)] border border-[rgba(229,197,135,0.3)] shadow-[0_0_15px_rgba(229,197,135,0.1)]">
            <Sparkles className="h-4 w-4 text-[#e5c587]" />
            {/* Corner accent dots */}
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-[#e5c587] shadow-[0_0_6px_rgba(229,197,135,0.6)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white">
              {APP_NAME}
            </span>
            <span className="sys-label-gold -mt-0.5">v2.4 // SYS-ACTIVE</span>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="flex h-9 w-9 lg:h-8 lg:w-8 items-center justify-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white/70 transition-colors lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5 lg:h-4 lg:w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-5 overflow-y-auto">
        <span className="sys-label block px-3 pb-2">NAVIGATION // MAIN</span>
        {sidebarNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "nav-active-indicator relative flex items-center gap-3 rounded-lg px-3 py-3 lg:py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[rgba(229,197,135,0.08)] text-[#e5c587] border border-[rgba(229,197,135,0.15)] shadow-[0_0_15px_rgba(229,197,135,0.05)]"
                  : "text-white/40 hover:bg-white/5 hover:text-white/70",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0 transition-colors duration-200",
                  isActive ? "text-[#e5c587]" : "text-white/30",
                )}
              />
              <span>{item.label}</span>
              {isActive && (
                <>
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#e5c587] shadow-[0_0_8px_rgba(229,197,135,0.6)]" />
                  {/* Astral bracket corners */}
                  <span className="bracket-corner pointer-events-none" />
                  <span className="bracket-corner-br pointer-events-none" />
                </>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User area / Logout */}
      <div className="border-t border-white/5 p-4">
        <span className="sys-label block px-1 pb-2">ACCOUNT // NODE</span>
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-white/5 border border-white/5 p-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-[rgba(229,197,135,0.3)] to-[rgba(229,197,135,0.1)] border border-[rgba(229,197,135,0.2)] text-xs font-bold text-[#e5c587]">
            {user?.name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-white/80">
              {user?.name || user?.username || user?.email || "User"}
            </p>
            <p className="sys-label">
              TIER // {user?.premiumTier ? user.premiumTier.toUpperCase() : "FREE"}
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-white/40 hover:text-white/70 hover:bg-[rgba(239,68,68,0.08)] hover:text-red-400"
          onClick={logout}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          <span className="text-xs tracking-wider uppercase">Disconnect</span>
        </Button>
      </div>
    </>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar (slide-in) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col glass-obsidian border-holo glow-ambient shadow-2xl shadow-[rgba(0,0,0,0.5)] transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:flex-col glass-obsidian glow-ambient lg:border-r lg:border-white/5">
        {sidebarContent}
      </aside>
    </>
  );
}
