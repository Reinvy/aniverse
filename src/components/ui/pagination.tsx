"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PaginationProps {
  /** Current page (1-based) */
  page: number;
  /** Total number of pages */
  totalPages: number;
  /** Called when page changes */
  onPageChange: (page: number) => void;
  /** Optional total items count for display */
  totalItems?: number;
  /** Custom class */
  className?: string;
}

/**
 * Reusable game-style pagination bar.
 * Chamfered prev/next buttons + monospace "PAGE X OF Y" readout,
 * matching the AniVerse HUD design system.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;

  return (
    <div
      className={cn(
        "mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6",
        className,
      )}
    >
      <Button
        variant="outline"
        size="sm"
        disabled={prevDisabled}
        onClick={() => onPageChange(page - 1)}
        className="w-full gap-2 sm:w-auto"
        aria-label="Previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </Button>

      <div className="flex flex-col items-center gap-1">
        <span className="sys-label text-white/40">
          PAGE {page} OF {totalPages}
        </span>
        {typeof totalItems === "number" && (
          <span className="text-[10px] tracking-wider text-white/20">
            {totalItems.toLocaleString()} ITEMS
          </span>
        )}
      </div>

      <Button
        variant="outline"
        size="sm"
        disabled={nextDisabled}
        onClick={() => onPageChange(page + 1)}
        className="w-full gap-2 sm:w-auto"
        aria-label="Next page"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default Pagination;
