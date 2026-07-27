import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, startIcon, endIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {startIcon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-white/40">
            {startIcon}
          </div>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/85 placeholder:text-white/30",
            "backdrop-blur-xl",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white/70",
            "focus-visible:outline-none focus-visible:border-[rgba(243,198,105,0.4)] focus-visible:shadow-[0_0_15px_rgba(243,198,105,0.08)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-200",
            startIcon && "pl-10",
            endIcon && "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-white/40">
            {endIcon}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
