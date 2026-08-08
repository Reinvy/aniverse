"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface SectionHeadingProps {
  /** Heading label (rendered as uppercase sys-label) */
  title: string;
  /** Optional lucide icon shown before the title */
  icon?: React.ComponentType<{ className?: string }>;
  /** Optional sub-label / micro-label shown after the title (e.g. "SYS.02") */
  sublabel?: string;
  /** Alignment of the heading row */
  align?: "left" | "center";
  /** Extra classes for the wrapper */
  className?: string;
  /** Extra classes for the title */
  titleClassName?: string;
  /** Whether to show the gold diamond indicator (default: true) */
  showDiamond?: boolean;
}

/**
 * Reusable game-style section heading — AniVerse Design System v2.
 *
 * Consolidates the repeated "diamond indicator + uppercase sys-label +
 * gradient hairline" pattern used across detail pages (character profile,
 * blog article, challenges). Renders:
 *
 *   ◆  APPEARANCE // VISUAL  ────────────────
 *
 * All transitions use the premium cubic-bezier(0.16,1,0.3,1) easing.
 */
export function SectionHeading({
  title,
  icon: Icon,
  sublabel,
  align = "left",
  className,
  titleClassName,
  showDiamond = true,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2",
        align === "center" && "justify-center",
        className,
      )}
    >
      {showDiamond && (
        <span
          className="h-1.5 w-1.5 rotate-45 bg-gold-400 shadow-[0_0_6px_rgba(230,194,128,0.5)]"
          aria-hidden="true"
        />
      )}
      {Icon && <Icon className="h-4 w-4 text-gold-400 shrink-0" />}
      <h2
        className={cn(
          "sys-label text-sm font-bold tracking-[0.2em] text-gold-300",
          titleClassName,
        )}
      >
        {title}
      </h2>
      {sublabel && (
        <span className="text-[10px] tracking-wider text-white/25 uppercase">
          {sublabel}
        </span>
      )}
      <span
        className={cn(
          "h-px flex-1 bg-gradient-to-r from-stroke-gold/40 to-transparent",
          align === "center" && "max-w-[80px]",
        )}
        aria-hidden="true"
      />
    </div>
  );
}

export default SectionHeading;
