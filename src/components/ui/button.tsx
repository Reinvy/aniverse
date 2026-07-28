import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap",
    "text-sm font-medium transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(230,194,128,0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0E14]",
    "disabled:pointer-events-none disabled:opacity-40",
    "active:scale-[0.97]",
    "relative overflow-hidden",
    // Energy sweep on hover
    "energy-sweep",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "btn-glow-sweep border border-[rgba(230,194,128,0.25)] text-[#e6c280] shadow-sm",
        primary:
          "btn-glow-sweep border border-[rgba(230,194,128,0.35)] text-white font-semibold",
        destructive:
          "bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-red-400 hover:bg-[rgba(239,68,68,0.25)] hover:border-[rgba(239,68,68,0.5)]",
        outline:
          "border border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20 hover:text-white",
        secondary:
          "bg-white/5 border border-white/5 text-white/70 hover:bg-white/10 hover:text-white",
        ghost:
          "text-white/50 hover:bg-white/5 hover:text-white/80",
        link: "text-[#e6c280] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 rounded-[4px]",
        sm: "h-9 rounded-[3px] px-3 text-xs",
        lg: "h-12 rounded-[4px] px-8 text-base",
        icon: "h-10 w-10 rounded-[4px]",
        "icon-sm": "h-8 w-8 rounded-[3px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
