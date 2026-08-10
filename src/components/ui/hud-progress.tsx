"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * HudProgress — reusable game-style HUD progress bar
 *
 * Design System v2: monospace HUD label + value + segmented
 * fill track (hud-bar / hud-bar-fill tokens). Variants map to
 * the system accent palette (Aether Cyan / Celestial Gold /
 * Emerald sync). Clamps `percent` to 0–100.
 *
 * Used by dashboard "generations left" meter and anywhere a
 * compact status fill is needed (credits, quota, XP, sync).
 * ────────────────────────────────────────────────────────────── */

export interface HudProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** HUD label, e.g. "GENERATIONS" (rendered uppercase mono) */
  label: string;
  /** Value text right of the label, e.g. "3/10" or "30%" */
  value: string;
  /** Fill percentage 0–100 (clamped) */
  percent: number;
  /** Accent variant — affects fill gradient + value color */
  variant?: "cyan" | "gold" | "emerald";
  /** Optional trailing SYS node tag (e.g. "SYS.05") */
  sysNode?: string;
  /** Extra classes for the root bar */
  className?: string;
}

const FILL_GRADIENTS: Record<NonNullable<HudProgressProps["variant"]>, string> = {
  cyan: "linear-gradient(90deg, rgba(45,212,191,0.4), rgba(45,212,191,0.85))",
  gold: "linear-gradient(90deg, rgba(230,194,128,0.4), rgba(230,194,128,0.9))",
  emerald: "linear-gradient(90deg, rgba(52,211,153,0.4), rgba(52,211,153,0.85))",
};

const VALUE_COLORS: Record<NonNullable<HudProgressProps["variant"]>, string> = {
  cyan: "text-[#2dd4bf]",
  gold: "text-[#e6c280]",
  emerald: "text-[#34d399]",
};

export function HudProgress({
  label,
  value,
  percent,
  variant = "cyan",
  sysNode,
  className,
  ...props
}: HudProgressProps) {
  const clamped = Math.max(0, Math.min(100, percent));

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(clamped)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className={cn(
        "hud-bar gap-2",
        className,
      )}
      {...props}
    >
      <span className="text-[0.6rem] tracking-wider text-white/40">{label}</span>
      <span className={cn("hud-value text-[0.65rem]", VALUE_COLORS[variant])}>
        {value}
      </span>
      <span className="hud-bar-fill min-w-[48px]">
        <span
          className="hud-fill-inner block"
          style={{
            width: `${clamped}%`,
            background: FILL_GRADIENTS[variant],
          }}
        />
      </span>
      {sysNode && <span className="sys-node text-white/20">{sysNode}</span>}
    </div>
  );
}

export default HudProgress;
