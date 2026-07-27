import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  [
    "inline-flex items-center rounded-md border px-2.5 py-0.5",
    "text-[11px] font-semibold tracking-wide uppercase",
    "transition-all duration-200",
    "focus:outline-none focus:ring-2 focus:ring-[rgba(243,198,105,0.3)] focus:ring-offset-2 focus:ring-offset-[#0B0F19]",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-[rgba(243,198,105,0.3)] bg-[rgba(243,198,105,0.1)] text-[#f3c669]",
        primary:
          "border-[rgba(62,230,196,0.3)] bg-[rgba(62,230,196,0.1)] text-[#3ee6c4]",
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
