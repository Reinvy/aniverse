"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * Modal — reusable game-style modal dialog (Design System v2)
 *
 * Astral Luxury treatment: glass-obsidian panel, chamfered cut
 * corners, diamond indicator, sys-label header, energy sweep.
 * Supports: ESC to close, backdrop click, body scroll lock,
 * AnimatePresence enter/exit, optional header actions.
 * ────────────────────────────────────────────────────────────── */

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Called when the modal requests to close (ESC / backdrop / X) */
  onClose: () => void;
  /** Modal title (rendered as a sys-label + bold title) */
  title?: React.ReactNode;
  /** Optional micro label above the title (lang-label style) */
  microLabel?: { en: string; ja: string };
  /** Modal body content */
  children: React.ReactNode;
  /** Optional right-aligned actions in the header (e.g. buttons) */
  headerActions?: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Extra classes for the panel */
  className?: string;
  /** Close when the backdrop is clicked (default: true) */
  closeOnBackdrop?: boolean;
}

const SIZE_CLASSES: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  microLabel,
  children,
  headerActions,
  footer,
  size = "md",
  className,
  closeOnBackdrop = true,
}: ModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll while open
  React.useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-6">
          {/* Backdrop */}
          <motion.button
            type="button"
            aria-label="Close dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeOnBackdrop ? onClose : undefined}
            className="absolute inset-0 cursor-default bg-[#05080F]/80 backdrop-blur-md"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full overflow-hidden rounded-t-[6px] sm:rounded-[6px]",
              "glass-obsidian cut-corner diamond-indicator",
              "energy-sweep watermark-crest",
              "shadow-[0_24px_80px_rgba(0,0,0,0.6)]",
              SIZE_CLASSES[size],
              className,
            )}
          >
            {/* Top accent bar */}
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(229,197,135,0.6)] to-transparent" />

            {/* Header */}
            {(title || headerActions) && (
              <div className="flex items-start justify-between gap-4 border-b border-white/[0.06] px-5 py-4 sm:px-6">
                <div className="min-w-0">
                  {microLabel && (
                    <span
                      className="micro-lang block mb-1"
                      data-en={microLabel.en}
                      data-ja={microLabel.ja}
                    />
                  )}
                  {title && (
                    <h2 className="text-base sm:text-lg font-bold text-white">
                      {title}
                    </h2>
                  )}
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {headerActions}
                  <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-white/10 bg-white/[0.03] text-white/50 transition-all duration-300 hover:scale-105 hover:border-[rgba(229,197,135,0.3)] hover:text-gold-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Body */}
            <div className="max-h-[70vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] bg-black/20 px-5 py-4 sm:px-6">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
