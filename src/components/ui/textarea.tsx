"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  /** Show character count */
  showCount?: boolean;
  /** Container className override */
  containerClassName?: string;
}

/**
 * Game-style textarea with recessed background, gold inner glow on focus,
 * and optional character count. Mirrors the Input component's aesthetic.
 */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, containerClassName, showCount, ...props }, ref) => {
    const valueLength =
      typeof props.value === "string" ? props.value.length : 0;
    const maxLength = props.maxLength;

    return (
      <div className={cn("relative w-full", containerClassName)}>
        <textarea
          className={cn(
            "min-h-[100px] w-full rounded-[4px]",
            "border border-white/10 bg-[rgba(0,0,0,0.45)]",
            "p-3 text-sm text-white/85 placeholder:text-white/25",
            "backdrop-blur-xl resize-none",
            "focus-visible:outline-none focus-visible:border-[rgba(230,194,128,0.4)]",
            "focus-visible:shadow-[0_0_0_1px_rgba(230,194,128,0.2),_inset_0_0_12px_rgba(230,194,128,0.15)]",
            "transition-all duration-300",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
          ref={ref}
          {...props}
        />
        {showCount && (
          <div className="mt-1.5 flex items-center justify-between">
            <span />
            <span className="text-xs text-white/30">
              {valueLength}
              {maxLength ? ` / ${maxLength}` : ""} characters
            </span>
          </div>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
