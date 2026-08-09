"use client";

import * as React from "react";
import { MotionConfig } from "framer-motion";

/**
 * MotionProvider — wraps the app in Framer Motion's MotionConfig with
 * `reducedMotion="user"`, so every motion.div / AnimatePresence animation
 * automatically respects the user's `prefers-reduced-motion` setting
 * (transform/scale animations are disabled, opacity fades remain).
 *
 * CSS-based animations are already covered in globals.css; this closes
 * the gap for JS-driven Framer Motion animations.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
