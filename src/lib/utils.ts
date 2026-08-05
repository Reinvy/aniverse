import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind CSS classes with conflict resolution.
 * Combines clsx and tailwind-merge for clean className composition.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string relative to now (e.g., "2 hours ago").
 */
export function timeAgo(date: Date | string): string {
  const now = new Date();
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

/**
 * Format a number with abbreviation (e.g., 1.2K, 3.5M).
 */
export function formatNumber(num: number): string {
  if (num < 1000) return num.toString();
  const suffixes = ["", "K", "M", "B", "T"];
  const tier = Math.floor(Math.log10(Math.abs(num)) / 3);
  if (tier === 0) return num.toString();
  const suffix = suffixes[tier] ?? "";
  const scaled = num / Math.pow(10, tier * 3);
  return `${scaled.toFixed(1).replace(/\.0$/, "")}${suffix}`;
}
