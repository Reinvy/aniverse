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

  // Close sidebar on route change (mobile)
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-zinc-800/60 px-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-fuchsia-600 shadow-lg shadow-violet-600/20">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            {APP_NAME}
          </span>
        </Link>
        <button
          onClick={onClose}
          className="flex h-9 w-9 lg:h-8 lg:w-8 items-center justify-center rounded-lg text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5 lg:h-4 lg:w-4" />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6 overflow-y-auto">
        {sidebarNav.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 lg:py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-gradient-to-r from-violet-600/20 to-fuchsia-600/10 text-white shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200",
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-violet-400" : "text-zinc-500",
                )}
              />
              {item.label}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User area / Logout */}
      <div className="border-t border-zinc-800/60 p-4">
        <div className="mb-3 flex items-center gap-3 rounded-lg bg-zinc-800/40 p-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-fuchsia-600 text-xs font-bold text-white">
            U
          </div>
          <div className="flex-1 min-w-0">
            <p className="truncate text-sm font-medium text-zinc-200">
              User
            </p>
            <p className="truncate text-xs text-zinc-500">Free Plan</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-zinc-400"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign Out
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile sidebar (slide-in) */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[85vw] flex-col border-r border-zinc-800/60 bg-zinc-950 transition-transform duration-300 ease-in-out lg:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {sidebarContent}
      </aside>

      {/* Desktop sidebar (always visible) */}
      <aside className="hidden lg:flex lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:w-64 lg:flex-col lg:border-r lg:border-zinc-800/60 lg:bg-zinc-950/90 lg:backdrop-blur-xl">
        {sidebarContent}
      </aside>
    </>
  );
}
