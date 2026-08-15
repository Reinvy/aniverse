/**
 * AniVerse Pricing & Monetization Configuration
 *
 * Display-layer pricing tiers DERIVED from the canonical `TIERS` definition
 * in `@/lib/constants` — the single source of truth for price, credits, and
 * features (used by the landing page, dashboard generation limits, and the
 * monetization dashboard). This module only adds display-only metadata
 * (`description`, `cta`) that the raw tier constants don't carry.
 *
 * NEVER duplicate price/credits/features here — import TIERS and extend it,
 * so the surfaces can never drift apart again (Studio was $19.99 here vs
 * $24.99 in TIERS, and Pro's feature list had silently diverged).
 *
 * @see TIERS in constants.ts for the canonical definitions.
 */

import { TIERS } from "@/lib/constants";

export type PricingTierId = keyof typeof TIERS;

/** A canonical tier plus the display-only fields used by monetization UI. */
export type PricingTier = (typeof TIERS)[PricingTierId] & {
  description: string;
  cta: string;
};

function tier(
  id: PricingTierId,
  description: string,
  cta: string,
): PricingTier {
  return { ...TIERS[id], description, cta };
}

export const pricingTiers = {
  free: tier("FREE", "Perfect for exploring AI anime generation.", "Get Started"),
  pro: tier("PRO", "For serious creators who want more power.", "Subscribe"),
  studio: tier("STUDIO", "For studios and power users.", "Go Pro"),
} as const;

/** Coin pack pricing (microtransaction model). */
export const coinPacks = [
  { id: "coins-10", coins: 10, price: 1.99, bonus: 0, label: "Starter Pack" },
  { id: "coins-50", coins: 50, price: 7.99, bonus: 5, label: "Creator Pack" },
  { id: "coins-100", coins: 100, price: 14.99, bonus: 15, label: "Pro Pack" },
  { id: "coins-500", coins: 500, price: 59.99, bonus: 100, label: "Mega Pack" },
] as const;

/**
 * Monthly-equivalent price when billed annually (20% discount), rounded to
 * cents. Mirrors the landing page's annual toggle math so every surface
 * shows the same discounted figure.
 */
export function annualMonthlyPrice(monthly: number): number {
  return Math.round(monthly * 0.8 * 100) / 100;
}

export default pricingTiers;
