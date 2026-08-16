"use client";

import * as React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/* ──────────────────────────────────────────────────────────────
 * Reveal / StaggerGroup / StaggerItem — AniVerse Design System v2
 *
 * Reusable micro-interaction toolkit replacing hand-rolled
 * `motion.div initial/animate` entrance patterns across pages.
 *
 * - `Reveal`        : single-element fade-up (blur optional) entrance
 * - `StaggerGroup`  : container that staggers its `StaggerItem` children
 * - `StaggerItem`   : child of `StaggerGroup` (fade-up variant)
 *
 * Design tokens:
 * - Easing: cubic-bezier(0.16, 1, 0.3, 1) (premium-transition)
 * - Movement: y 16px fade-up (matches existing stats/activity entrances)
 * - Reduced motion: transform/blur disabled, opacity fade retained
 * ────────────────────────────────────────────────────────────── */

/** Design-system easing — cubic-bezier(0.16, 1, 0.3, 1) */
const EASE = [0.16, 1, 0.3, 1] as const;

type RevealAs = "div" | "section" | "li" | "span" | "article";

/** Static motion tag map — declared outside render so components are
 * never created during render (react-hooks/static-components). */
const MOTION_TAGS = {
  div: motion.div,
  section: motion.section,
  li: motion.li,
  span: motion.span,
  article: motion.article,
} as const;

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** HTML id (e.g. scroll target) */
  id?: string;
  /** Entrance delay in seconds (default 0) */
  delay?: number;
  /** Vertical travel distance in px (default 16) */
  y?: number;
  /** Animation duration in seconds (default 0.5) */
  duration?: number;
  /** Semantic tag to render (default "div") */
  as?: RevealAs;
}

/**
 * Reveal — single-element fade-up entrance.
 * Mount-based (matches existing page entrances); respects
 * `prefers-reduced-motion` by skipping the vertical transform.
 */
export function Reveal({
  children,
  className,
  id,
  delay = 0,
  y = 16,
  duration = 0.5,
  as = "div",
}: RevealProps) {
  const reduce = useReducedMotion();
  const Tag = MOTION_TAGS[as];

  return (
    <Tag
      id={id}
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

export interface StaggerGroupProps {
  children: React.ReactNode;
  className?: string;
  /** HTML id (e.g. scroll target) */
  id?: string;
  /** Delay before the whole group starts (default 0) */
  delay?: number;
  /** Delay between items in seconds (default 0.08) */
  stagger?: number;
  /** Semantic tag to render (default "div") */
  as?: RevealAs;
}

/**
 * StaggerGroup — container that plays its `StaggerItem` children
 * in sequence (fade-up, staggered). Honors reduced motion.
 */
export function StaggerGroup({
  children,
  className,
  id,
  delay = 0,
  stagger = 0.08,
  as = "div",
}: StaggerGroupProps) {
  const reduce = useReducedMotion();
  const Tag = MOTION_TAGS[as];

  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: delay },
    },
  };

  return (
    <Tag
      id={id}
      className={className}
      variants={variants}
      initial="hidden"
      animate="show"
    >
      {children}
    </Tag>
  );
}

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  /** Vertical travel distance in px (default 16) */
  y?: number;
  /** Semantic tag to render (default "div") */
  as?: RevealAs;
}

/**
 * StaggerItem — a single child of `StaggerGroup`.
 * Uses the shared item variants so the whole group animates in sync.
 */
export function StaggerItem({
  children,
  className,
  y = 16,
  as = "div",
}: StaggerItemProps) {
  const reduce = useReducedMotion();
  const Tag = MOTION_TAGS[as];

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: reduce ? 0 : y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: EASE },
    },
  };

  return (
    <Tag className={className} variants={itemVariants}>
      {children}
    </Tag>
  );
}