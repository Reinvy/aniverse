"use client";

import * as React from "react";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface SearchBarProps {
  /** Placeholder text for the input */
  placeholder?: string;
  /** Controlled input value */
  value: string;
  /** Called on every keystroke */
  onChange: (value: string) => void;
  /** Called when the form is submitted (Enter or button click) */
  onSubmit: (e: React.FormEvent) => void;
  /** Center the bar (for page headers) — default false (left-aligned, flex-1) */
  centered?: boolean;
  /** Max width class — default "max-w-md" */
  maxWidth?: string;
  /** Extra classes for the form wrapper */
  className?: string;
  /** Accessible label for the search input */
  "aria-label"?: string;
}

/**
 * Reusable game-style search bar — AniVerse Design System v2.
 *
 * Consolidates the duplicated search forms previously inlined on the
 * blog, characters and gallery pages: recessed dark input with a gold
 * search icon (startIcon) + chamfered submit button.
 *
 * Usage:
 *   <SearchBar value={q} onChange={setQ} onSubmit={handleSearch}
 *              placeholder="Search..." centered />
 */
export function SearchBar({
  placeholder = "Search...",
  value,
  onChange,
  onSubmit,
  centered = false,
  maxWidth = "max-w-md",
  className,
  "aria-label": ariaLabel = "Search",
}: SearchBarProps) {
  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className={cn(
        "flex gap-3",
        maxWidth,
        centered && "mx-auto",
        className,
      )}
    >
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        startIcon={<Search className="h-4 w-4" />}
        aria-label={ariaLabel}
        className="flex-1"
      />
      <Button type="submit" variant="default" size="icon" className="shrink-0" aria-label="Submit search">
        <Search className="h-4 w-4" />
      </Button>
    </form>
  );
}

export default SearchBar;
