"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { cn } from "@/lib/utils";
import { APP_NAME, MAIN_NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50 glass-obsidian mt-3 mx-3 sm:mx-4 rounded-none chamfered glow-ambient bg-noise">

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 animate-stagger">
        {/* ── HUD Status Display (replaces plain logo) ── */}
        <Link href="/" className="flex items-center gap-4 group shrink-0">
          {/* Logo emblem */}
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(229,197,135,0.3)] to-[rgba(229,197,135,0.1)] border border-stroke-gold shadow-[0_0_15px_rgba(229,197,135,0.1)] group-hover:shadow-[0_0_25px_rgba(229,197,135,0.2)] transition-all duration-300">
            <Sparkles className="h-4.5 w-4.5 text-gold-400" />
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_6px_rgba(229,197,135,0.6)]" />
          </div>

          {/* Logo text + sys version */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-gold-300 transition-colors">
                {APP_NAME}
              </span>
              <span className="badge-neon-gold text-[0.6rem] px-1.5 py-0.5 leading-none">v2.4</span>
            </div>

            {/* CREDITS / GENERATIONS indicator bar (mock for public landing) */}
            <div className="hud-bar gap-2 mt-0.5 hidden md:flex">
              <span className="text-[0.6rem] tracking-wider text-white/40">CREDITS</span>
              <span className="hud-value text-[0.65rem]">10/10 FREE</span>
              <span className="hud-bar-fill min-w-[48px]">
                <span className="hud-fill-inner" style={{ width: "100%" }} />
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop nav — Astral Diamond Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {MAIN_NAV_LINKS.map((link) => {
            const isActive = pathname === link.href || (link.href.length > 1 && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn("nav-diamond text-sm font-medium tracking-wide", isActive && "active")}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3 animate-stagger">
          {/* System status badge */}
          <span className="badge-neon text-[0.6rem] px-2 py-0.5 gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#2DD4BF] shadow-[0_0_6px_#2DD4BF] animate-pulse" />
            SYS.ONLINE
          </span>

          {isAuthenticated && user ? (
            <Link href="/dashboard">
              <Button variant="primary" size="sm" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button variant="primary" size="sm" className="gap-2">
                  <UserPlus className="h-4 w-4" />
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex md:hidden items-center justify-center rounded-lg p-2 text-white/50 hover:bg-glass-300 hover:text-white transition-all duration-200"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu — Game HUD dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-x-hidden border-t border-stroke-white glass-strong max-w-[calc(100vw-2rem)]"
          >
            <div className="space-y-1 px-4 py-4">
              <span className="sys-label block px-3 pb-2">NAVIGATION // MAIN</span>
              {MAIN_NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block rounded-lg px-3 py-2.5 text-sm text-white/50 transition-colors hover:bg-glass-300 hover:text-gold-300"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="my-3 border-stroke-white" />
              <span className="sys-label block px-3 pb-1">SESSION // AUTH</span>
              {isAuthenticated && user ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gold-400 hover:bg-glass-300"
                >
                  <Sparkles className="h-4 w-4" />
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-white/50 hover:bg-glass-300 hover:text-white"
                  >
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-gold-400 hover:bg-glass-300"
                  >
                    <UserPlus className="h-4 w-4" />
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
