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
  /** Max number of numbered page buttons to show (excluding ellipses) */
  maxPageButtons?: number;
  /** Custom class */
  className?: string;
}

/**
 * Compute the page numbers to render — current page centered with
 * ellipsis gaps on either side when the range is large.
 */
function getPageItems(
  page: number,
  totalPages: number,
  maxButtons: number,
): (number | "ellipsis-start" | "ellipsis-end")[] {
  if (totalPages <= maxButtons) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // Always show first + last; window around the current page.
  const items: (number | "ellipsis-start" | "ellipsis-end")[] = [1];

  const side = Math.floor((maxButtons - 3) / 2); // room for first, last, current
  let start = Math.max(2, page - side);
  let end = Math.min(totalPages - 1, page + side);

  // Re-anchor the window when near the edges so it stays dense.
  if (page - side <= 2) {
    end = Math.min(totalPages - 1, maxButtons - 2);
  }
  if (page + side >= totalPages - 1) {
    start = Math.max(2, totalPages - (maxButtons - 2));
  }

  if (start > 2) items.push("ellipsis-start");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < totalPages - 1) items.push("ellipsis-end");

  items.push(totalPages);
  return items;
}

/**
 * Reusable game-style pagination bar — AniVerse Design System v2.
 * Chamfered prev/next buttons + numbered page buttons with gold active
 * state + monospace "PAGE X OF Y" readout.
 */
export function Pagination({
  page,
  totalPages,
  onPageChange,
  totalItems,
  maxPageButtons = 7,
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const prevDisabled = page <= 1;
  const nextDisabled = page >= totalPages;
  const pageItems = getPageItems(page, totalPages, maxPageButtons);

  return (
    <div
      className={cn(
        "mt-10 flex flex-col items-center justify-center gap-3 sm:gap-4",
        className,
      )}
    >
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
        {/* Previous */}
        <Button
          variant="outline"
          size="icon-sm"
          disabled={prevDisabled}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Numbered pages */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {pageItems.map((item, i) => {
            if (item === "ellipsis-start" || item === "ellipsis-end") {
              return (
                <span
                  key={`${item}-${i}`}
                  aria-hidden="true"
                  className="px-1 text-xs text-white/25 select-none"
                >
                  …
                </span>
              );
            }
            const isActive = item === page;
            return (
              <Button
                key={item}
                variant={isActive ? "default" : "ghost"}
                size="icon-sm"
                onClick={() => onPageChange(item)}
                aria-label={`Page ${item}`}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "min-w-8 font-mono text-xs",
                  isActive && "border-[rgba(230,194,128,0.35)] text-[#e6c280] shadow-[inset_0_0_12px_rgba(230,194,128,0.1)]",
                )}
              >
                {item}
              </Button>
            );
          })}
        </div>

        {/* Next */}
        <Button
          variant="outline"
          size="icon-sm"
          disabled={nextDisabled}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

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
    </div>
  );
}

export default Pagination;
