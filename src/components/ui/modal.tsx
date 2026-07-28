"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { X, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface ModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Close handler */
  onClose: () => void;
  /** Modal title */
  title?: string;
  /** Modal description / subtitle */
  description?: string;
  /** Content inside the modal */
  children: React.ReactNode;
  /** Optional footer content */
  footer?: React.ReactNode;
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl" | "full";
  /** Show decorative corner brackets */
  showBrackets?: boolean;
  /** Show diamond indicator */
  showDiamond?: boolean;
  /** Custom class */
  className?: string;
  /** Close on backdrop click (default: true) */
  closeOnBackdrop?: boolean;
}

/**
 * Anime game-style Modal component
 * Features: cut-corner, corner-brackets, glass panel, energy-sweep,
 * backdrop blur, Framer Motion enter/exit animations.
 */
export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  showBrackets = true,
  showDiamond = true,
  className,
  closeOnBackdrop = true,
}: ModalProps) {
  // Close on Escape key
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) {
      document.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    full: "max-w-[calc(100%-2rem)]",
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-[rgba(0,0,0,0.7)] backdrop-blur-sm"
            onClick={closeOnBackdrop ? onClose : undefined}
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "relative w-full",
              sizeClasses[size],
              "glass-strong rounded-[4px]",
              "cut-corner energy-sweep",
              showBrackets && "corner-brackets",
              showDiamond && "diamond-indicator",
              "border border-[rgba(230,194,128,0.15)]",
              "shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_80px_rgba(230,194,128,0.05)]",
              "max-h-[85vh] flex flex-col",
              className,
            )}
          >
            {/* Decorative top bar */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(230,194,128,0.4)] to-transparent pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className={cn(
                "absolute top-3 right-3 z-10",
                "flex h-7 w-7 items-center justify-center rounded-[3px]",
                "text-white/30 hover:text-white/80 hover:bg-white/5",
                "transition-all duration-200",
              )}
              aria-label="Close modal"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Header */}
            {(title || description) && (
              <div className="flex-shrink-0 px-5 pt-5 pb-3 border-b border-white/5">
                {title && (
                  <div className="flex items-center gap-2 pr-6">
                    <Sparkles className="h-4 w-4 text-[#e6c280]" />
                    <h2 className="text-lg font-bold text-white">{title}</h2>
                  </div>
                )}
                {description && (
                  <p className="mt-1 text-sm text-white/40 pl-6">{description}</p>
                )}
              </div>
            )}

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-5 py-4">
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div className="flex-shrink-0 px-5 py-4 border-t border-white/5 flex items-center justify-end gap-3">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
