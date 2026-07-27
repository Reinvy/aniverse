import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg",
    "text-sm font-medium transition-all duration-300",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(243,198,105,0.4)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F19]",
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
          "bg-gradient-to-r from-[rgba(243,198,105,0.2)] to-[rgba(243,198,105,0.1)] border border-[rgba(243,198,105,0.3)] text-[#f3c669] hover:bg-[rgba(243,198,105,0.25)] hover:border-[rgba(243,198,105,0.5)] hover:shadow-[0_0_20px_rgba(243,198,105,0.15)]",
        primary:
          "bg-gradient-to-r from-[rgba(243,198,105,0.3)] to-[rgba(62,230,196,0.15)] border border-[rgba(243,198,105,0.4)] text-white hover:shadow-[0_0_25px_rgba(243,198,105,0.2)]",
        destructive:
          "bg-[rgba(239,68,68,0.15)] border border-[rgba(239,68,68,0.3)] text-red-400 hover:bg-[rgba(239,68,68,0.25)] hover:border-[rgba(239,68,68,0.5)]",
        outline:
          "border border-white/10 text-white/70 hover:bg-white/5 hover:border-white/20 hover:text-white",
        secondary:
          "bg-white/5 border border-white/5 text-white/70 hover:bg-white/10 hover:text-white",
        ghost:
          "text-white/50 hover:bg-white/5 hover:text-white/80",
        link: "text-[#f3c669] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        icon: "h-10 w-10 rounded-lg",
        "icon-sm": "h-8 w-8 rounded-md",
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
