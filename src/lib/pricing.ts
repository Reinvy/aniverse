/**
 * AniVerse Pricing & Monetization Configuration
 *
 * Central pricing definitions used across the app for tier display,
 * checkout, and revenue tracking.
 *
 * @see TIERS in constants.ts for the original canonical definitions.
 */

import { TIERS, type TierId, PRICING_INTERVALS } from "./constants";

/** Per-tier CTA button text. */
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
    description: "For studios and power users — now more affordable.",
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

/** Marketplace commission rate (percentage). */
export const MARKETPLACE_COMMISSION = 0.15 as const;

/** Affiliate/referral reward structure. */
export const REFERRAL_REWARDS = {
  referrerCredit: 5.0, // $5 credit for referrer
  refereeDiscount: 0.20, // 20% off first month
  maxReferralsPerMonth: 10,
  payoutThreshold: 20.0, // Minimum $20 to cash out
} as const;

/** Feature comparison for plan upgrade CTAs. */
export const upgradeReasons: Record<PricingTierId, string[]> = {
  free: [
    "Unlock HD resolution",
    "Remove watermark",
    "Get 10× more generations",
    "Commercial license included",
  ],
  pro: [
    "Unlimited generations",
    "4K resolution",
    "Full model control",
    "Priority support & API access",
  ],
  studio: [
    "You're on the best plan!",
    "Refer friends to earn credits",
    "Explore the marketplace",
  ],
} as const;

/** Pricing page display helpers. */
export function formatPrice(price: number): string {
  if (price === 0) return "Free";
  return `$${price.toFixed(2)}`;
}

export function getPriceId(tier: PricingTierId, interval: "monthly" | "annual"): string {
  // Stripe Price IDs would go here when integrated
  const prefix = interval === "annual" ? "annual" : "monthly";
  return `${prefix}_${tier}`;
}

export default pricingTiers;
