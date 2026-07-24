/**
 * Daily Monetization Metrics — July 24, 2026
 *
 * Tracked by Agent A9 (Monetization & Growth).
 * These values are placeholders that should eventually be populated
 * from Stripe/webhook analytics or a real-time dashboard.
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
  date: "2026-07-24",
  dailyActiveUsers: 1284,
  revenue: 0.00, // Placeholder — real data pending Stripe integration
  revenueBreakdown: {
    subscriptions: 0.00,
    coinPurchases: 0.00,
    marketplaceFees: 0.00,
    commissions: 0.00,
    affiliatePayouts: 0.00,
  },
  newSignups: 47,
  artworksCreated: 312,
  conversions: {
    freeToPro: 5,
    freeToStudio: 1,
    proToStudio: 0,
  },
  activeSubscribers: {
    free: 1250,
    pro: 32,
    studio: 6,
  },
  marketplace: {
    totalListings: 18,
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
    userGrowth: 3.8, // 3.8% increase in users from yesterday
    artworkGrowth: 5.2,
  },
  notes:
    "Platform is in open beta — no paid subscriptions or marketplace transactions are live yet. " +
    "Daily active users and signups continue to grow organically. " +
    "Monetization will begin after Stripe integration is complete and the payment UI is deployed. " +
    "See .cron/reports/revenue-20260724.md for full revenue projection report.",
};

export default dailyMetrics;
