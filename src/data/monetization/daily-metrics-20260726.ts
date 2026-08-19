/**
 * Daily Monetization Metrics — July 26, 2026
 *
 * Tracked by Agent A9 (Monetization & Growth).
 * These values are placeholders that should eventually be populated
 * from Stripe/webhook analytics or a real-time dashboard.
 *
 * Incremented from July 24 baseline with organic growth projection.
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
  date: "2026-07-26",
  dailyActiveUsers: 1325,
  revenue: 0.00, // Placeholder — real data pending Stripe integration
  revenueBreakdown: {
    subscriptions: 0.00,
    coinPurchases: 0.00,
    marketplaceFees: 0.00,
    commissions: 0.00,
    affiliatePayouts: 0.00,
  },
  newSignups: 52,
  artworksCreated: 338,
  conversions: {
    freeToPro: 6,
    freeToStudio: 1,
    proToStudio: 0,
  },
  activeSubscribers: {
    free: 1290,
    pro: 35,
    studio: 7,
  },
  marketplace: {
    totalListings: 20,
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
    "Daily active users growing steadily at ~2% week-over-week. " +
    "Notable: A2 added Photo-to-Anime style presets this cycle (feat/aniverse-photo-to-anime-20260726), " +
    "which may drive increased engagement when deployed. " +
    "Studio monthly price optimized to $19.99 (from $24.99) to improve mid-tier conversion. " +
    "See .cron/reports/revenue-20260726.md for full revenue projection report.",
};

export default dailyMetrics;
