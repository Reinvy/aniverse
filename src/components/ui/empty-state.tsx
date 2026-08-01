"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface EmptyStateProps {
  /** Icon component (lucide) */
  icon?: React.ComponentType<{ className?: string }>;
  /** Main title */
  title: string;
  /** Optional description */
  description?: string;
  /** Optional action node (buttons, links) */
  action?: React.ReactNode;
  /** Compact variant (smaller padding, inline) */
  compact?: boolean;
  /** Custom class */
  className?: string;
}

/**
 * Reusable game-style empty state.
 * Glass card with diamond-indicator + cut-corner, centered icon,
 * title, description and optional action. Follows the AniVerse
 * design system v2 (glass, cut-corner, sys typography).
 */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  compact,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden text-center",
        "glass rounded-[4px] cut-corner diamond-indicator",
        compact ? "p-6" : "p-8 sm:p-10",
        className,
      )}
    >
      {/* Ambient gold glow */}
      <div className="pointer-events-none absolute -left-16 -top-16 h-40 w-40 rounded-full bg-[rgba(230,194,128,0.04)] blur-3xl" />

      <div className="relative z-10 flex flex-col items-center">
        {Icon && (
          <div
            className={cn(
              "flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-[rgba(0,0,0,0.3)]",
              compact ? "h-10 w-10 mb-3" : "h-14 w-14 mb-4",
            )}
          >
            <Icon
              className={cn(
                "text-white/25",
                compact ? "h-5 w-5" : "h-7 w-7",
              )}
            />
          </div>
        )}

        <p
          className={cn(
            "font-semibold text-white/70",
            compact ? "text-sm" : "text-base sm:text-lg",
          )}
        >
          {title}
        </p>

        {description && (
          <p className={cn(
            "text-sm text-white/35 max-w-sm",
            compact ? "mt-1" : "mt-2",
          )}>
            {description}
          </p>
        )}

        {action && (
          <div className={compact ? "mt-3" : "mt-5"}>{action}</div>
        )}

        {/* Decorative sys label */}
        <span className="sys-label mt-4 text-white/15">
          NO DATA // EMPTY NODE
        </span>
      </div>
    </div>
  );
}

export default EmptyState;
