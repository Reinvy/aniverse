"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2, Sparkles } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */

export interface SpinnerProps {
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Optional label text shown below the spinner */
  label?: string;
  /** Show as full-page overlay */
  fullPage?: boolean;
  /** Custom class */
  className?: string;
  /** Variant */
  variant?: "default" | "gold" | "cyan";
}

/* ─── Size Map ───────────────────────────────────────────── */

const sizeMap = {
  sm: "h-5 w-5",
  md: "h-8 w-8",
  lg: "h-12 w-12",
  xl: "h-16 w-16",
};

const iconSizeMap = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-6 w-6",
  xl: "h-8 w-8",
};

const glowColorMap = {
  default: "rgba(230, 194, 128, 0.3)",
  gold: "rgba(230, 194, 128, 0.4)",
  cyan: "rgba(66, 232, 224, 0.3)",
};

const borderColorMap = {
  default: "border-[rgba(230,194,128,0.2)] border-t-[#e6c280]",
  gold: "border-[rgba(230,194,128,0.25)] border-t-[#e6c280]",
  cyan: "border-[rgba(66,232,224,0.2)] border-t-[#42e8e0]",
};

const textColorMap = {
  default: "text-[#e6c280]",
  gold: "text-[#e6c280]",
  cyan: "text-[#42e8e0]",
};

/* ─── Spinner Component ──────────────────────────────────── */

/**
 * Game-style loading spinner with energy pulse animation.
 * Mimics the AniVerse design system with gold/cyan accents,
 * glass-morphism container, and cut-corner styling.
 */
export function Spinner({
  size = "md",
  label,
  fullPage = false,
  className,
  variant = "default",
}: SpinnerProps) {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullPage && "min-h-[60vh]",
        className,
      )}
    >
      {/* Outer decorative ring */}
      <div className="relative flex items-center justify-center">
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full blur-xl animate-glow-pulse"
          style={{
            background: `radial-gradient(circle, ${glowColorMap[variant]} 0%, transparent 70%)`,
          }}
        />

        {/* Spinning ring */}
        <div
          className={cn(
            "rounded-full border-2 animate-spin",
            sizeMap[size],
            borderColorMap[variant],
          )}
          style={{ animationDuration: "0.8s" }}
        />

        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className={cn(
            iconSizeMap[size],
            textColorMap[variant],
            "animate-pulse",
          )} />
        </div>
      </div>

      {/* Label */}
      {label && (
        <div className="flex flex-col items-center gap-1">
          <p className={cn(
            "text-sm font-medium",
            textColorMap[variant],
          )}>
            {label}
          </p>
          <span className="sys-label animate-pulse">
            LOADING // SYSTEM
          </span>
        </div>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
}

/* ─── Inline Spinner (for buttons, small areas) ──────────── */

/**
 * Tiny inline spinner for buttons and compact areas.
 * Just the spinning ring, no label or decorative elements.
 */
export function InlineSpinner({
  className,
}: {
  className?: string;
}) {
  return (
    <Loader2
      className={cn("h-4 w-4 animate-spin text-[#e6c280]", className)}
    />
  );
}

/* ─── Page Loading Shell ─────────────────────────────────── */

/**
 * Full-page loading shell with the game-style aesthetic.
 * Shows glass cards with shimmer animation while content loads.
 */
export function PageLoadingShell({
  sections = 3,
  className,
}: {
  /** Number of skeleton sections to show */
  sections?: number;
  className?: string;
}) {
  return (
    <div className={cn("p-4 sm:p-6 lg:p-8", className)}>
      {/* Header skeleton */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between animate-pulse">
        <div>
          <div className="h-3 w-20 rounded bg-white/5" />
          <div className="mt-1 h-8 w-48 rounded bg-white/5" />
        </div>
        <div className="h-10 w-32 rounded-[4px] bg-white/5" />
      </div>

      {/* Content skeleton */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: sections }).map((_, i) => (
          <div
            key={i}
            className="glass rounded-[4px] cut-corner p-5 relative overflow-hidden
              before:absolute before:inset-0 before:-translate-x-full
              before:bg-gradient-to-r before:from-transparent before:via-[rgba(230,194,128,0.06)] before:to-transparent
              before:animate-[shimmer_1.8s_infinite]"
          >
            <div className="space-y-3">
              <div className="h-4 w-1/3 rounded bg-white/5" />
              <div className="h-8 w-1/2 rounded bg-white/5" />
              <div className="h-3 w-2/3 rounded bg-white/5" />
              <div className="h-3 w-1/2 rounded bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
