"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Sparkles,
  LogIn,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { APP_NAME, MAIN_NAV_LINKS } from "@/lib/constants";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 glass border-b border-stroke-white">
      {/* Angled bar accent */}
      <div className="angled-bar" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo — Game HUD style */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-[rgba(243,198,105,0.3)] to-[rgba(243,198,105,0.1)] border border-stroke-gold shadow-[0_0_15px_rgba(243,198,105,0.1)] group-hover:shadow-[0_0_25px_rgba(243,198,105,0.2)] transition-all duration-300">
            <Sparkles className="h-4.5 w-4.5 text-gold-400" />
            {/* Corner accent dot */}
            <span className="absolute -top-0.5 -right-0.5 h-1.5 w-1.5 rounded-full bg-gold-400 shadow-[0_0_6px_rgba(243,198,105,0.6)]" />
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white group-hover:text-gold-300 transition-colors">
              {APP_NAME}
            </span>
            <span className="sys-label-gold -mt-0.5">v2.4 // SYS-ACTIVE</span>
          </div>
        </Link>

        {/* Desktop nav — HUD style */}
        <nav className="hidden md:flex items-center gap-1">
          {MAIN_NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative px-4 py-2 text-sm text-white/50 transition-all duration-200 hover:text-gold-300 group"
            >
              {link.label}
              {/* Bottom glow indicator on hover */}
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-gradient-to-r from-transparent via-gold-400/50 to-transparent group-hover:w-3/4 transition-all duration-300" />
            </Link>
          ))}
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-3">
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
            className="overflow-hidden border-t border-stroke-white glass-strong"
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
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
