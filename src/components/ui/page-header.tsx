"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Page title */
  title: string;
  /** Optional subtitle / sys-label description */
  description?: string;
  /** Right-aligned action elements (buttons, badges, etc.) */
  actions?: React.ReactNode;
  /** Override or extend classes */
  className?: string;
  /** Stagger delay for entrance animation (default: 0) */
  delay?: number;
  /** Optional micro-label (lang-label style) */
  microLabel?: { en: string; ja: string };
}

/**
 * Standardized page header component with game-style entrance animation.
 * Used across all dashboard pages and public sub-pages.
 */
export function PageHeader({
  title,
  description,
  actions,
  className,
  delay = 0,
  microLabel,
}: PageHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}
    >
      <div>
        {microLabel && (
          <span
            className="micro-lang block mb-1"
            data-en={microLabel.en}
            data-ja={microLabel.ja}
          />
        )}
        <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-0.5 text-sm text-white/40 sys-label">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {actions}
        </div>
      )}
    </motion.div>
  );
}
