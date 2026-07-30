"use client";

import {
  ToastProvider,
  ToastViewport,
  Toast,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, AlertTriangle, Sparkles } from "lucide-react";

const variantIcons = {
  default: <Sparkles className="h-4 w-4 text-[#e5c587]" />,
  success: <CheckCircle2 className="h-4 w-4 text-emerald-400" />,
  error: <XCircle className="h-4 w-4 text-red-400" />,
  warning: <AlertTriangle className="h-4 w-4 text-amber-400" />,
} as const;

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, variant, icon, open, onOpenChange, ...props }) {
        return (
          <Toast
            key={id}
            variant={variant}
            icon={icon || (variant ? variantIcons[variant] : variantIcons.default)}
            open={open}
            onOpenChange={onOpenChange}
            {...props}
          >
            {title}
            {description && <span>{description}</span>}
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
