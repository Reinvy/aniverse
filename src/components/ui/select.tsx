"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronDown, Sparkles } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────── */

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
}

export interface SelectProps {
  /** Array of options */
  options: SelectOption[];
  /** Currently selected value */
  value?: string;
  /** Change handler */
  onChange?: (value: string) => void;
  /** Placeholder text when nothing selected */
  placeholder?: string;
  /** Label text */
  label?: string;
  /** Error message */
  error?: string;
  /** Disabled state */
  disabled?: boolean;
  /** Custom class */
  className?: string;
  /** Optionally show a micro-label (lang-label style) */
  microLabel?: { en: string; ja: string };
  /** Optional icon */
  icon?: React.ReactNode;
  /** Optional description below the label */
  description?: string;
}

/* ─── Select Component ───────────────────────────────────── */

/**
 * Anime game-style Select component.
 * Features: glass dropdown, cut-corner panel, gold accent, energy-sweep,
 * diamond indicator, sys-label styling, Framer Motion entrance.
 */
export function Select({
  options,
  value,
  onChange,
  placeholder = "Select...",
  label,
  error,
  disabled = false,
  className,
  microLabel,
  icon,
  description,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close on click outside
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  function handleSelect(optValue: string) {
    onChange?.(optValue);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Label */}
      {microLabel && (
        <span
          className="lang-label block mb-1"
          data-en={microLabel.en}
          data-ja={microLabel.ja}
        />
      )}
      {label && (
        <label className="sys-label block mb-1.5">
          {icon && <span className="mr-1.5 inline-flex">{icon}</span>}
          {label}
        </label>
      )}
      {description && (
        <p className="mb-2 text-xs text-white/40">{description}</p>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex h-10 w-full items-center justify-between rounded-[4px] px-3 py-2 text-sm",
          "border border-white/[0.06] bg-[rgba(0,0,0,0.5)] backdrop-blur-xl",
          "transition-all duration-300",
          "focus-visible:outline-none focus-visible:border-[rgba(66,232,224,0.5)]",
          "focus-visible:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),_0_2px_0_rgba(66,232,224,0.15)]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          error && "border-[rgba(239,68,68,0.4)]",
          !error && !isOpen && "hover:border-white/[0.12]",
          isOpen && "border-[rgba(230,194,128,0.4)] shadow-[inset_0_0_12px_rgba(230,194,128,0.1)]",
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span
          className={cn(
            "truncate",
            selectedOption ? "text-white/85" : "text-white/25",
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 transition-transform duration-300",
            isOpen && "rotate-180",
            selectedOption ? "text-[#e6c280]" : "text-white/30",
          )}
        />
      </button>

      {/* Error */}
      {error && (
        <p className="mt-1 text-xs text-red-400">{error}</p>
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-full min-w-[200px]",
            "glass-strong rounded-[4px] cut-corner energy-sweep",
            "border border-[rgba(230,194,128,0.15)]",
            "shadow-[0_0_40px_rgba(0,0,0,0.5),0_0_80px_rgba(230,194,128,0.05)]",
            "overflow-hidden",
          )}
          role="listbox"
        >
          {/* Decorative top bar */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[rgba(230,194,128,0.4)] to-transparent pointer-events-none" />

          <div className="max-h-60 overflow-y-auto py-1">
            {options.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-white/30">
                <Sparkles className="mx-auto mb-1 h-4 w-4 text-white/20" />
                No options available
              </div>
            ) : (
              options.map((opt) => {
                const isSelected = opt.value === value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value)}
                    className={cn(
                      "relative flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm",
                      "transition-all duration-200",
                      "focus-visible:outline-none focus-visible:bg-white/5",
                      isSelected
                        ? "bg-[rgba(230,194,128,0.08)] text-[#e6c280]"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                      opt.disabled && "cursor-not-allowed opacity-40",
                    )}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {/* Diamond indicator for selected */}
                    {isSelected && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] rounded-r-full bg-gradient-to-b from-[#e6c280] to-transparent" />
                    )}

                    <div className="flex-1 min-w-0">
                      <p
                        className={cn(
                          "truncate text-sm",
                          isSelected && "font-medium",
                        )}
                      >
                        {opt.label}
                      </p>
                      {opt.description && (
                        <p className="mt-0.5 truncate text-xs text-white/30">
                          {opt.description}
                        </p>
                      )}
                    </div>

                    {/* Checkmark */}
                    {isSelected && (
                      <Check className="h-4 w-4 shrink-0 text-[#e6c280]" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
