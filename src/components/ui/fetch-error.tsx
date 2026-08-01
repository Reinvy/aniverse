"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FetchErrorStateProps {
  /** Short title shown above the message */
  title?: string;
  /** Human-readable error detail */
  message?: string;
  /** Called when the user clicks "Try Again" */
  onRetry?: () => void;
  /** Compact variant for embedding inside cards */
  compact?: boolean;
  className?: string;
}

/**
 * Game-style fetch error state with retry — reusable across pages
 * that load data from the API. Distinguishes a real failure from an
 * empty result set so users aren't shown a misleading "no data" UI.
 */
export function FetchErrorState({
  title = "Could not load data",
  message = "Something went wrong while fetching data. Check your connection and try again.",
  onRetry,
  compact,
  className,
}: FetchErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        "relative overflow-hidden",
        "glass rounded-[4px] cut-corner diamond-indicator",
        "border border-[rgba(239,68,68,0.15)]",
        compact ? "p-5" : "p-6 sm:p-8",
        className,
      )}
    >
      {/* Subtle red glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />

      <div
        className={cn(
          "relative z-10 flex",
          compact ? "items-center gap-3" : "flex-col items-center text-center",
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)]",
            compact ? "h-9 w-9" : "h-14 w-14 mb-4",
          )}
        >
          <AlertTriangle
            className={cn("text-red-400", compact ? "h-4 w-4" : "h-7 w-7")}
          />
        </div>

        <div className={compact ? "flex-1 min-w-0" : ""}>
          <p className="font-semibold text-red-400 text-sm sm:text-base">
            {title}
          </p>
          {!compact && (
            <p className="mt-2 text-sm text-white/40 max-w-md mx-auto">
              {message}
            </p>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className={cn(
                "inline-flex items-center gap-2",
                "btn-glow-sweep border border-[rgba(230,194,128,0.25)] text-[#e6c280]",
                "px-4 py-2 text-sm font-medium rounded-[4px]",
                "transition-all duration-300 hover:scale-105",
                compact ? "mt-0 shrink-0" : "mt-5",
              )}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
