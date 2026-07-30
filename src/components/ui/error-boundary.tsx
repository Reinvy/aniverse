"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";

export interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
  /** Optional custom message */
  message?: string;
  /** Whether to show in a compact card form */
  compact?: boolean;
}

/**
 * Game-styled error fallback UI
 * Shows in a glass card with diamond-indicator and cut-corner
 */
export function ErrorFallback({
  error,
  resetErrorBoundary,
  message,
  compact,
}: ErrorFallbackProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden",
        "glass rounded-[4px] cut-corner diamond-indicator",
        "border border-[rgba(239,68,68,0.15)]",
        compact ? "p-4" : "p-6 sm:p-8",
      )}
      role="alert"
    >
      {/* Subtle red glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />

      <div className={cn(
        "relative z-10 flex",
        compact ? "items-center gap-3" : "flex-col items-center text-center",
      )}>
        {/* Icon */}
        <div className={cn(
          "flex shrink-0 items-center justify-center rounded-full border border-[rgba(239,68,68,0.2)] bg-[rgba(239,68,68,0.1)]",
          compact ? "h-8 w-8" : "h-14 w-14 mb-4",
        )}>
          <AlertTriangle className={cn(
            "text-red-400",
            compact ? "h-4 w-4" : "h-7 w-7",
          )} />
        </div>

        <div className={compact ? "flex-1 min-w-0" : ""}>
          {/* Error title */}
          <p className={cn(
            "font-semibold text-red-400",
            compact ? "text-sm" : "text-lg",
          )}>
            {message || "Something went wrong"}
          </p>

          {/* Error detail (hidden in compact mode) */}
          {!compact && error.message && (
            <p className="mt-2 text-sm text-white/40 max-w-md mx-auto">
              {error.message}
            </p>
          )}

          {/* Retry button */}
          {resetErrorBoundary && (
            <button
              onClick={resetErrorBoundary}
              className={cn(
                "inline-flex items-center gap-2 mt-4",
                "btn-glow-sweep border border-[rgba(230,194,128,0.25)] text-[#e6c280]",
                "px-4 py-2 text-sm font-medium rounded-[4px]",
                "transition-all duration-300 hover:scale-105",
                compact ? "mt-0" : "mt-4",
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

// ─── Error Boundary Class Component ──────────────────────────

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode | ((props: ErrorFallbackProps) => React.ReactNode);
  /** Optional custom error message */
  message?: string;
  /** Use compact styling */
  compact?: boolean;
  /** Optional onError callback */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Game-style ErrorBoundary — wraps sections of the app
 * Shows a styled error fallback with retry capability.
 */
class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[AniVerse ErrorBoundary]", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      // Custom fallback render
      if (this.props.fallback) {
        if (typeof this.props.fallback === "function") {
          return this.props.fallback({
            error: this.state.error,
            resetErrorBoundary: this.resetErrorBoundary,
            message: this.props.message,
            compact: this.props.compact,
          });
        }
        return this.props.fallback;
      }

      // Default fallback
      return (
        <ErrorFallback
          error={this.state.error}
          resetErrorBoundary={this.resetErrorBoundary}
          message={this.props.message}
          compact={this.props.compact}
        />
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
