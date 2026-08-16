"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Game-style loading skeleton with energy pulse animation.
 * Mimics the glass-card aesthetic while in loading state.
 */
function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "relative overflow-hidden rounded-[4px] bg-[rgba(255,255,255,0.04)]",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-[rgba(230,194,128,0.08)] before:to-transparent",
        "before:animate-[shimmer_1.5s_infinite]",
        className,
      )}
      {...props}
    />
  );
}

/**
 * Card skeleton — full glass-card placeholder with gold shimmer
 */
function CardSkeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "glass rounded-[4px] cut-corner p-4 sm:p-5",
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:-translate-x-full",
        "before:bg-gradient-to-r before:from-transparent before:via-[rgba(230,194,128,0.06)] before:to-transparent",
        "before:animate-[shimmer_1.8s_infinite]",
        "min-h-[120px]",
        className,
      )}
      {...props}
    >
      <div className="space-y-3">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-8 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

/**
 * Stat card skeleton — for dashboard stat loading states
 */
function StatCardSkeleton() {
  return (
    <div className="glass rounded-[4px] cut-corner p-4 sm:p-5 relative overflow-hidden
      before:absolute before:inset-0 before:-translate-x-full
      before:bg-gradient-to-r before:from-transparent before:via-[rgba(230,194,128,0.06)] before:to-transparent
      before:animate-[shimmer_1.8s_infinite]">
      <div className="flex items-start justify-between">
        <Skeleton className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl" />
        <Skeleton className="h-5 w-14 rounded-full" />
      </div>
      <Skeleton className="mt-3 sm:mt-4 h-7 w-24" />
      <Skeleton className="mt-1 h-3 w-32" />
    </div>
  );
}

/**
 * List item skeleton — for activity/feed loading
 */
function ListItemSkeleton() {
  return (
    <div className="flex items-center gap-3 sm:gap-4 py-3 sm:py-4 border-b border-white/5 last:border-0">
      <Skeleton className="h-7 w-7 sm:h-8 sm:w-8 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-3/5" />
        <Skeleton className="h-3 w-2/5" />
      </div>
      <Skeleton className="h-3 w-12 shrink-0" />
    </div>
  );
}

/**
 * Media card skeleton — shared placeholder for image-first cards
 * (gallery artworks / marketplace listings).
 *
 * - `variant="artwork"`: image + title + subtitle (gallery grid)
 * - `variant="listing"`: image + title + subtitle + price row (marketplace)
 */
function MediaCardSkeleton({
  variant = "artwork",
}: {
  variant?: "artwork" | "listing";
}) {
  return (
    <div
      aria-hidden="true"
      className="glass rounded-[4px] cut-corner overflow-hidden relative
        before:absolute before:inset-0 before:-translate-x-full
        before:bg-gradient-to-r before:from-transparent before:via-[rgba(230,194,128,0.06)] before:to-transparent
        before:animate-[shimmer_1.8s_infinite]"
    >
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className={variant === "listing" ? "p-4 space-y-2.5" : "p-4 space-y-2"}>
        <Skeleton className="h-5 w-3/4" />
        <Skeleton
          className={variant === "listing" ? "h-3.5 w-1/2" : "h-4 w-1/2"}
        />
        {variant === "listing" && (
          <div className="flex items-center justify-between pt-1">
            <Skeleton className="h-5 w-14" />
            <Skeleton className="h-8 w-24 rounded-[4px]" />
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Media grid skeleton — responsive grid of MediaCardSkeleton placeholders.
 * Use for gallery/marketplace/collection loading states.
 */
function MediaGridSkeleton({
  count = 8,
  variant = "artwork",
  className,
}: {
  count?: number;
  variant?: "artwork" | "listing";
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn(
        "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {Array.from({ length: count }).map((_, i) => (
        <MediaCardSkeleton key={i} variant={variant} />
      ))}
    </div>
  );
}

export {
  Skeleton,
  CardSkeleton,
  StatCardSkeleton,
  ListItemSkeleton,
  MediaCardSkeleton,
  MediaGridSkeleton,
};
