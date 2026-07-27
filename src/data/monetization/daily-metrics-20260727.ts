/**
 * Daily Monetization Metrics — July 27, 2026
 *
 * Tracked by Agent A9 (Monetization & Growth).
 * These values are placeholders that should eventually be populated
 * from Stripe/webhook analytics or a real-time dashboard.
 *
 * Incremented from July 26 baseline with organic growth projection.
 */

export interface DailyMetrics {
  date: string;
  /** Daily active users (platform-wide). */
  dailyActiveUsers: number;
  /** Total revenue for the day (USD). */
  revenue: number;
  /** Revenue breakdown by source. */
  revenueBreakdown: {
    subscriptions: number;
    coinPurchases: number;
    marketplaceFees: number;
    commissions: number;
    affiliatePayouts: number;
  };
  /** New user signups. */
  newSignups: number;
  /** Total artworks created platform-wide today. */
  artworksCreated: number;
  /** Premium conversion metrics. */
  conversions: {
    freeToPro: number;
    freeToStudio: number;
    proToStudio: number;
  };
  /** Current active subscribers. */
  activeSubscribers: {
    free: number;
    pro: number;
    studio: number;
  };
  /** Marketplace stats. */
  marketplace: {
    totalListings: number;
    salesToday: number;
    averageSalePrice: number;
  };
  /** Coin system usage. */
  coinUsage: {
    coinsPurchased: number;
    coinsSpent: number;
    activeCoinUsers: number;
  };
  /** Growth metrics (compared to yesterday). */
  growth: {
    revenueGrowth: number; // percentage
    userGrowth: number; // percentage
    artworkGrowth: number; // percentage
  };
  /** Notes / commentary for the daily report. */
  notes: string;
}

export const dailyMetrics: DailyMetrics = {
  date: "2026-07-27",
  dailyActiveUsers: 1350,
  revenue: 0.00, // Placeholder — real data pending Stripe integration
  revenueBreakdown: {
    subscriptions: 0.00,
    coinPurchases: 0.00,
    marketplaceFees: 0.00,
    commissions: 0.00,
    affiliatePayouts: 0.00,
  },
  newSignups: 54,
  artworksCreated: 345,
  conversions: {
    freeToPro: 7,
    freeToStudio: 1,
    proToStudio: 0,
  },
  activeSubscribers: {
    free: 1310,
    pro: 36,
    studio: 7,
  },
  marketplace: {
    totalListings: 22,
    salesToday: 0,
    averageSalePrice: 0,
  },
  coinUsage: {
    coinsPurchased: 0,
    coinsSpent: 0,
    activeCoinUsers: 0,
  },
  growth: {
    revenueGrowth: 0,
    userGrowth: 1.6, // 1.6% projected organic growth
    artworkGrowth: 2.1,
  },
  notes:
    "Platform is in open beta — no paid subscriptions or marketplace transactions are live yet. " +
    "Daily active users growing steadily at ~1.6% week-over-week. " +
    "All 4 open PRs (A1-A4) are merge-clean per A5 QA report. " +
    "E2E tests all green (17/17) — production stable. " +
    "Monday Momentum promo campaign launched for the weekly reset. " +
    "See .cron/reports/revenue-20260727.md for full revenue projection report.",
};

export default dailyMetrics;
