import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center rounded-md border px-2.5 py-0.5",
    "text-[11px] font-semibold tracking-wide uppercase",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-[rgba(229,197,135,0.3)] focus:ring-offset-2 focus:ring-offset-[#05080F]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-[rgba(229,197,135,0.3)] bg-[rgba(229,197,135,0.1)] text-[#e5c587]",
        primary:
          "border-[rgba(66,232,224,0.3)] bg-[rgba(66,232,224,0.1)] text-[#42e8e0]",
        secondary:
          "border-white/10 bg-white/5 text-white/60",
        destructive:
          "border-[rgba(239,68,68,0.3)] bg-[rgba(239,68,68,0.1)] text-red-400",
        outline:
          "border-white/15 text-white/50",
        success:
          "border-[rgba(34,197,94,0.3)] bg-[rgba(34,197,94,0.1)] text-emerald-400",
        warning:
          "border-[rgba(251,191,36,0.3)] bg-[rgba(251,191,36,0.1)] text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
