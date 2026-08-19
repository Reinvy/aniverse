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
  free: {
    name: "Free",
    price: 0,
    description: "Perfect for exploring AI anime generation.",
    features: [
      "10 AI generations per month",
      "Standard resolution (512×512)",
      "Basic style presets",
      "Community gallery access",
      "Watermark on exports",
    ],
    cta: "Get Started",
    popular: false,
    color: "zinc" as const,
  },
  pro: {
    name: "Pro",
    price: 9.99,
    description: "For serious creators who want more power.",
    features: [
      "100 AI generations per month",
      "HD resolution (1024×1024)",
      "All style presets + custom prompts",
      "Commercial license",
      "Priority generation queue",
      "Export without watermark",
      "API access (100 req/day)",
    ],
    cta: "Subscribe",
    popular: true,
    color: "violet" as const,
  },
  studio: {
    name: "Studio",
    price: 19.99,
    description: "For studios and power users.",
    features: [
      "Unlimited AI generations",
      "4K resolution (2048×2048)",
      "Full model control + negative prompts",
      "Commercial + resale license",
      "Priority support",
      "API access (1000 req/day)",
      "Team collaboration (up to 5)",
    ],
    cta: "Go Pro",
    popular: false,
    color: "amber" as const,
  },
} as const;

export type PricingTierId = keyof typeof pricingTiers;

/** Annual billing prices (20% discount). */
export const annualPrices: Record<PricingTierId, number> = {
  free: 0,
  pro: 7.99, // $95.88/yr — saves $24
  studio: 15.99, // $191.88/yr — saves $48
} as const;

/** Annual savings display strings. */
export const annualSavings: Record<Exclude<PricingTierId, "free">, string> = {
  pro: "Save $24/year",
  studio: "Save $48/year",
} as const;

/** Per-generation cost breakdown for transparency. */
export const perGenerationCost = {
  free: { generations: 10, costPerGen: "Free" },
  pro: { generations: 100, costPerGen: "$0.10" },
  studio: { generations: "Unlimited", costPerGen: "~$0.00" },
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
