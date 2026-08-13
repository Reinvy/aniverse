"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CtaCardProps {
  /** Icon shown above the title (default: Sparkles) */
  icon?: LucideIcon;
  /** Card heading */
  title: string;
  /** Supporting description */
  description: string;
  /** Button label */
  ctaLabel: string;
  /** Button destination — must be a real href */
  ctaHref: string;
  /** Entrance animation delay (seconds, default: 0.4) */
  delay?: number;
  /** Extra classes for the wrapper */
  className?: string;
}

/**
 * CtaCard — reusable game-style bottom call-to-action (AniVerse Design System v2).
 *
 * Glass panel + cut-corner + diamond-indicator + energy-sweep + gold corner
 * brackets, with the standard "primary" chamfered button (btn-glow-sweep /
 * light-sweep + hover scale-105 micro-interaction). Replaces the duplicated
 * bottom-CTA markup across public pages (blog, characters, challenges).
 *
 * Usage:
 *   <CtaCard
 *     title="Ready to create?"
 *     description="Generate AI anime art for free."
 *     ctaLabel="Start Creating"
 *     ctaHref="/register"
 *   />
 */
export function CtaCard({
  icon: Icon = Sparkles,
  title,
  description,
  ctaLabel,
  ctaHref,
  delay = 0.4,
  className,
}: CtaCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay, duration: 0.5 }}
      className={cn("mt-16 text-center", className)}
    >
      <div className="relative mx-auto max-w-lg overflow-hidden glass rounded-[4px] cut-corner diamond-indicator energy-sweep p-8">
        {/* Decorative gold corner brackets */}
        <div className="pointer-events-none absolute top-0 left-0 h-8 w-8 bracket-corner" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 bracket-corner-br" />

        <Icon className="mx-auto mb-3 h-8 w-8 text-gold-400" aria-hidden="true" />
        <h3 className="mb-2 text-lg font-bold text-white">{title}</h3>
        <p className="mb-4 text-sm text-white/40">{description}</p>

        <Link href={ctaHref} className="inline-block">
          <Button variant="primary" className="gap-2">
            {ctaLabel}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default CtaCard;
