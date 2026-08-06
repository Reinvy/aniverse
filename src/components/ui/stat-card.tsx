"use client";

import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface StatCardProps {
  /** Card title (also used as the key / aria label) */
  title: string;
  /** Main value shown in bold */
  value: string;
  /** Supporting text under the value */
  subtext?: string;
  /** Lucide icon for the gradient tile */
  icon?: LucideIcon;
  /** Tailwind gradient classes for the icon tile, e.g. "from-violet-500 to-purple-600" */
  gradient?: string;
  /** Trend text shown in the corner badge */
  trend?: string;
  /** Whether the trend is positive (emerald) or neutral/negative (zinc) */
  trendUp?: boolean;
  /** Premium micro label — shown as data-en / data-ja pair (e.g. { en: "GENERATIONS", ja: "ジェネレーション" }) */
  microLabel?: { en: string; ja: string };
  /** System node tag, e.g. "SYS.01" */
  sysNode?: string;
  /** Extra classes for the outer card */
  className?: string;
  /** Extra classes for the content wrapper */
  contentClassName?: string;
}

/**
 * Game-style stat card — reusable across dashboard pages.
 * Premium variant (microLabel/sysNode) renders the micro-lang + sys-node
 * HUD detailing used on the main dashboard; base variant renders a clean
 * icon + value + trend layout used on monetization/social pages.
 */
export function StatCard({
  title,
  value,
  subtext,
  icon: Icon,
  gradient,
  trend,
  trendUp = true,
  microLabel,
  sysNode,
  className,
  contentClassName,
}: StatCardProps) {
  return (
    <Card
      aria-label={title}
      className={cn(
        "group h-full",
        "diamond-indicator crosshair-mark glow-ambient bracket-corner watermark-crest",
        className,
      )}
    >
      <CardContent className={cn("p-4 sm:p-5", contentClassName)}>
        {/* Screen-reader-only title (visual label comes from microLabel or subtext) */}
        <span className="sr-only">{title}</span>
        {/* Premium HUD detailing (dashboard variant) */}
        {microLabel && (
          <span
            className="micro-lang block mb-1"
            data-en={microLabel.en}
            data-ja={microLabel.ja}
          />
        )}
        {sysNode && (
          <span className="sys-node block mb-1">[{sysNode}]</span>
        )}

        <div className="flex items-start justify-between gap-3">
          {Icon && (
            <div
              className={cn(
                "flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl shadow-lg",
                gradient ? `bg-gradient-to-br ${gradient}` : "bg-[rgba(255,255,255,0.06)]",
              )}
            >
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          )}
          {trend !== undefined && (
            <Badge
              variant="secondary"
              className={cn(
                "flex items-center gap-0.5 border-0 bg-[rgba(0,0,0,0.35)] text-xs shrink-0",
                trendUp ? "text-emerald-400" : "text-white/35",
              )}
            >
              <ArrowUpRight
                className={cn(
                  "h-3 w-3",
                  trendUp ? "text-emerald-400" : "text-white/35",
                )}
              />
              <span>{trend}</span>
            </Badge>
          )}
        </div>

        <p
          className={cn(
            "text-xl sm:text-2xl font-bold text-white",
            (Icon || trend !== undefined) && "mt-3 sm:mt-4",
          )}
        >
          {value}
        </p>
        {subtext && (
          <p className="mt-0.5 text-xs sm:text-sm text-white/40">{subtext}</p>
        )}
      </CardContent>
    </Card>
  );
}
