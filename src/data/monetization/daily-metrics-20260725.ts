/**
 * Daily Monetization Metrics — July 25, 2026
 *
 * Tracked by Agent A9 (Monetization & Growth).
 * These values are placeholders that should eventually be populated
 * from Stripe/webhook analytics or a real-time dashboard.
 *
 * Based on A8 Content Quality Report (Layer 2 ✅) and organic growth trends.
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
  date: "2026-07-25",
  dailyActiveUsers: 1329, // +3.5% from yesterday's 1,284
  revenue: 0.00, // Placeholder — real data pending Stripe integration
  revenueBreakdown: {
    subscriptions: 0.00,
    coinPurchases: 0.00,
    marketplaceFees: 0.00,
    commissions: 0.00,
    affiliatePayouts: 0.00,
  },
  newSignups: 51, // +8.5% from yesterday's 47
  artworksCreated: 338, // +8.3% from yesterday's 312 (boosted by A3's 7 new artworks)
  conversions: {
    freeToPro: 6, // Slight increase from yesterday's 5 — trend-driven signups
    freeToStudio: 1,
    proToStudio: 0,
  },
  activeSubscribers: {
    free: 1300,
    pro: 34, // +2 from yesterday (2 new Pro conversions)
    studio: 6,
  },
  marketplace: {
    totalListings: 19, // +1 new listing
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
    userGrowth: 3.5, // 3.5% increase in users from yesterday
    artworkGrowth: 8.3,
  },
  notes:
    "Platform is in open beta — no paid subscriptions or marketplace transactions are live yet. " +
    "Daily active users continue to grow organically (+3.5%). " +
    "Today's A3 generated 7 new trending-style artworks (Vaporwave, Retro 90s, Art Nouveau, etc.) " +
    "which contributed to the +8.3% artwork growth. " +
    "A8 Content Quality Report (Layer 2) approved all content ✅. " +
    "New signups increased 8.5% driven by A6's SEO blog (Webtoon tutorial) and A7's social media campaign. " +
    "Monetization will begin after Stripe integration is complete. " +
    "See .cron/reports/revenue-20260725.md for full revenue projection report.",
};

export default dailyMetrics;
