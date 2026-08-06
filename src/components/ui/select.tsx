import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Accessible label shown only to screen readers (use when no visible label) */
  "aria-label"?: string;
  /** Visible label rendered above the select (sys-label style) */
  label?: string;
  /** Container className override */
  containerClassName?: string;
}

/**
 * Reusable game-style select — AniVerse Design System v2.
 *
 * Recessed dark background with the input-astral treatment, gold inner
 * glow on focus, chamfered corners and a monospace chevron indicator.
 * Options render with the eclipse background so the native dropdown
 * matches the dark theme.
 *
 * Usage:
 *   <Select label="SORT // ORDER" value={sort} onChange={...}>
 *     <option value="newest">Newest</option>
 *   </Select>
 */
const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, containerClassName, label, children, ...props }, ref) => {
    return (
      <div className={cn("w-full", containerClassName)}>
        {label && (
          <label
            htmlFor={props.id}
            className="sys-label block mb-1.5 text-white/40"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={cn(
              "h-10 w-full appearance-none rounded-[4px] border border-white/10",
              "bg-[rgba(0,0,0,0.4)] pl-3 pr-9 text-sm text-white/75",
              "backdrop-blur-xl",
              "input-astral",
              "focus-visible:outline-none focus-visible:border-[rgba(230,194,128,0.4)]",
              "focus-visible:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),_0_2px_0_rgba(230,194,128,0.12)]",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "transition-all duration-300 premium-transition",
              className,
            )}
            {...props}
          >
            {children}
          </select>
          {/* Decorative chevron — gold diamond accent */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5">
            <ChevronDown className="h-4 w-4 text-[#e6c280]/70" />
          </div>
        </div>
      </div>
    );
  },
);
Select.displayName = "Select";

export { Select };
