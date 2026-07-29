"use client";

import * as React from "react";
import * as ToastPrimitives from "@radix-ui/react-toast";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed bottom-4 right-4 z-[100] flex max-w-[360px] flex-col gap-3",
      "outline-none",
      className,
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva(
  [
    "group pointer-events-auto relative flex w-full items-center gap-3",
    "rounded-[4px] border px-4 py-3 shadow-lg",
    "backdrop-blur-xl",
    "cut-corner",
    "transition-all duration-300 premium-transition",
    "data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)]",
    "data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[swipe=end]:animate-out data-[state=closed]:fade-out-80",
    "data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-right-full",
    "data-[state=open]:fade-in-0",
  ].join(" "),
  {
    variants: {
      variant: {
        default:
          "border-[rgba(230,194,128,0.2)] bg-[rgba(11,15,25,0.85)] text-white/85",
        success:
          "border-[rgba(34,197,94,0.25)] bg-[rgba(11,15,25,0.85)] text-emerald-400",
        error:
          "border-[rgba(239,68,68,0.25)] bg-[rgba(11,15,25,0.85)] text-red-400",
        warning:
          "border-[rgba(251,191,36,0.25)] bg-[rgba(11,15,25,0.85)] text-amber-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {
  /** Optional description text */
  description?: string;
  /** Optional action element */
  action?: React.ReactNode;
  /** Toast icon element */
  icon?: React.ReactNode;
}

const Toast = React.forwardRef<HTMLLIElement, ToastProps>(
  ({ className, variant, description, icon, children, ...props }, ref) => {
    return (
      <ToastPrimitives.Root
        ref={ref}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        <div className="flex items-start gap-3 w-full">
          {icon && (
            <div className="shrink-0 mt-0.5">{icon}</div>
          )}
          <div className="flex-1 min-w-0">
            <ToastPrimitives.Title className="text-sm font-medium">
              {children}
            </ToastPrimitives.Title>
            {description && (
              <ToastPrimitives.Description className="mt-1 text-xs text-white/40">
                {description}
              </ToastPrimitives.Description>
            )}
          </div>
          <ToastPrimitives.Close className="shrink-0 rounded-[3px] p-1 text-white/20 hover:text-white/60 hover:bg-white/5 transition-all duration-200">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3L11 11M11 3L3 11"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </ToastPrimitives.Close>
        </div>
        {props.action && (
          <div className="mt-2 flex items-center gap-2 pt-2 border-t border-white/5">
            {props.action}
          </div>
        )}
      </ToastPrimitives.Root>
    );
  },
);
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex items-center justify-center rounded-[3px] px-2.5 py-1 text-xs font-medium",
      "border border-[rgba(230,194,128,0.2)] text-[#e5c587]",
      "hover:bg-[rgba(230,194,128,0.1)] hover:border-[rgba(230,194,128,0.3)]",
      "transition-all duration-200",
      className,
    )}
    {...props}
  />
));
ToastAction.displayName = ToastPrimitives.Action.displayName;

export { ToastProvider, ToastViewport, Toast, ToastAction };
