"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FilterChipOption<T extends string = string> {
  id: T;
  label: string;
}

export interface FilterChipsProps<T extends string = string> {
  /** Filter options to render */
  options: readonly FilterChipOption<T>[];
  /** Currently active option id */
  value: T;
  /** Called when a chip is selected */
  onChange: (value: T) => void;
  /** Show the gold diamond indicator on the active chip (default: true) */
  showDiamond?: boolean;
  /** Extra classes for the wrapping container */
  className?: string;
}

/**
 * Reusable game-style category filter chips — AniVerse Design System v2.
 *
 * Active chip gets the celestial-gold treatment (border + tint + diamond
 * indicator); inactive chips are recessed dark glass with hover glow.
 * Chips use mobile-friendly touch targets (min 36px) and the
 * premium cubic-bezier(0.16,1,0.3,1) transition.
 *
 * Usage:
 *   <FilterChips options={CATEGORIES} value={active} onChange={setActive} />
 */
export function FilterChips<T extends string = string>({
  options,
  value,
  onChange,
  showDiamond = true,
  className,
}: FilterChipsProps<T>) {
  return (
    <div
      role="group"
      aria-label="Filter"
      className={cn("flex flex-wrap gap-2", className)}
    >
      {options.map((option) => {
        const isActive = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            onClick={() => onChange(option.id)}
            aria-pressed={isActive}
            className={cn(
              "relative inline-flex min-h-[36px] items-center gap-1.5 rounded-[4px] px-3 py-2 text-xs font-medium",
              "transition-all duration-300 premium-transition",
              isActive
                ? "border border-[rgba(230,194,128,0.35)] bg-[rgba(230,194,128,0.1)] text-gold-400 shadow-[inset_0_0_12px_rgba(230,194,128,0.08)]"
                : "border border-white/10 bg-[rgba(0,0,0,0.2)] text-white/40 hover:border-white/20 hover:bg-[rgba(255,255,255,0.03)] hover:text-white/60",
            )}
          >
            {showDiamond && isActive && (
              <span
                className="shrink-0 text-[9px] leading-none text-gold-400"
                aria-hidden="true"
              >
                ◆
              </span>
            )}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export default FilterChips;
