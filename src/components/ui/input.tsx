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
            "flex h-10 w-full rounded-[4px] border border-white/[0.06] bg-[rgba(0,0,0,0.5)] px-3 py-2 text-sm text-white/85 placeholder:text-white/25",
            "backdrop-blur-xl",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-white/70",
            "input-astral",
            "focus-visible:outline-none focus-visible:border-[rgba(66,232,224,0.5)] focus-visible:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3),_0_2px_0_rgba(66,232,224,0.15)]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-all duration-300",
            startIcon && "pl-10",
            endIcon && "pr-10",
            className,
          )}
          ref={ref}
          {...props}
        />
        {endIcon && (
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-white/40 [&_button]:pointer-events-auto [&_button]:cursor-pointer">
            {endIcon}
          </div>
        )}
      </div>
    );
  },
);
Input.displayName = "Input";

export { Input };
