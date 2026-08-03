/**
 * AniVerse Pricing & Monetization Configuration
 *
 * Central pricing definitions used across the app for tier display,
 * checkout, and revenue tracking.
 *
 * @see TIERS in constants.ts for the original canonical definitions.
 */

// Pricing constants are defined locally — constants.ts has canonical versions.
// No imports needed — we define pricingTiers below.

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

/** Coin pack pricing (microtransaction model). */
export const coinPacks = [
  { id: "coins-10", coins: 10, price: 1.99, bonus: 0, label: "Starter Pack" },
  { id: "coins-50", coins: 50, price: 7.99, bonus: 5, label: "Creator Pack" },
  { id: "coins-100", coins: 100, price: 14.99, bonus: 15, label: "Pro Pack" },
  { id: "coins-500", coins: 500, price: 59.99, bonus: 100, label: "Mega Pack" },
] as const;

export default pricingTiers;
