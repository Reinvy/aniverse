"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Sparkles,
  Coins,
  Crown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/ui/stat-card";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { pricingTiers, coinPacks } from "@/lib/pricing";
import Link from "next/link";

const revenueStreams = [
  {
    title: "Subscriptions (MRR)",
    value: "$0.00",
    subtext: "Pre-launch — Stripe pending",
    icon: DollarSign,
    gradient: "from-violet-500 to-purple-600",
    trend: "0%",
    trendUp: false,
  },
  {
    title: "Coin Purchases",
    value: "$0.00",
    subtext: "Microtransaction revenue",
    icon: Coins,
    gradient: "from-amber-500 to-orange-600",
    trend: "0%",
    trendUp: false,
  },
  {
    title: "Marketplace Fees",
    value: "$0.00",
    subtext: "15% commission",
    icon: ShoppingCart,
    gradient: "from-emerald-500 to-teal-600",
    trend: "0%",
    trendUp: false,
  },
  {
    title: "Active Users",
    value: "1,284",
    subtext: "Free tier + trial",
    icon: Users,
    gradient: "from-fuchsia-500 to-pink-600",
    trend: "+3.8%",
    trendUp: true,
  },
];

const conversionGoals = [
  { label: "Free → Pro", current: "0%", target: "3.2%", progress: 0 },
  { label: "Free → Studio", current: "0%", target: "0.5%", progress: 0 },
  { label: "Pro → Studio", current: "0%", target: "2%", progress: 0 },
];

export default function MonetizationPage() {
  return (
    <ErrorBoundary compact message="Failed to load monetization">
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <PageHeader
        title="Monetization"
        description="REVENUE // TRACKING — Pricing, sales, and growth metrics"
        microLabel={{ en: "MONETIZATION", ja: "収益化" }}
        actions={
          <Badge variant="secondary" className="gap-1 border-0 bg-amber-900/40 px-3 py-1.5 text-amber-400 self-start sm:self-auto">
            <Sparkles className="h-3.5 w-3.5" />
            Pre-Launch
          </Badge>
        }
      />

      {/* Revenue Stats */}
      <motion.div
        className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {revenueStreams.map((stat, i) => {
          return (
            <motion.div
              key={stat.title}
              className="glow-gold"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <StatCard
                title={stat.title}
                value={stat.value}
                subtext={stat.subtext}
                icon={stat.icon}
                gradient={stat.gradient}
                trend={stat.trend}
                trendUp={stat.trendUp}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pricing Tiers Overview */}
      <motion.div
        className="mt-6 sm:mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="diamond-indicator glow-ambient bracket-corner watermark-crest">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 sm:p-6">
            <div>
              <span className="micro-lang block mb-1" data-en="PRICING // TIERS" data-ja="料金プラン" />
              <CardTitle className="text-base sm:text-lg">Pricing Tiers</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs shrink-0">Target Audience: ~1,288 users</Badge>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Object.values(pricingTiers).map((tier) => (
                <div
                  key={tier.name}
                  className={`relative overflow-hidden rounded-[4px] border p-4 sm:p-5 cut-corner transition-all duration-300 premium-transition ${
                    tier.popular
                      ? "card-supply-gold border-[rgba(229,197,135,0.35)]"
                      : "card-supply border-white/[0.06] bg-[rgba(255,255,255,0.02)] hover:border-white/[0.14]"
                  }`}
                >
                  {tier.popular && (
                    <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-[rgba(229,197,135,0.08)] blur-2xl" />
                  )}
                  <div className="relative flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-white flex items-center gap-2">
                      {tier.popular && <Crown className="h-4 w-4 text-gold-400" />}
                      {tier.name}
                    </h3>
                    {tier.popular && (
                      <Badge variant="default" className="bg-gradient-to-r from-[rgba(229,197,135,0.25)] to-[rgba(229,197,135,0.1)] text-gold-300 text-xs shrink-0 border border-[rgba(229,197,135,0.35)]">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <p className="relative mt-1 text-xs sm:text-sm text-white/40">{tier.description}</p>
                  <p className="relative mt-3 sm:mt-4 text-2xl sm:text-3xl font-extrabold text-white">
                    {tier.price === 0 ? "Free" : `$${tier.price}`}
                    {tier.price > 0 && <span className="text-base font-normal text-white/40">/mo</span>}
                  </p>
                  <ul className="relative mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                    {tier.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-white/60">
                        <Sparkles className="mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-gold-400" />
                        {f}
                      </li>
                    ))}
                    {tier.features.length > 4 && (
                      <li className="text-xs text-white/30">+{tier.features.length - 4} more features</li>
                    )}
                  </ul>
                  <p className="relative mt-2 sm:mt-3 text-xs text-white/25">
                    Annual: {tier.price === 0 ? "Free" : `$${tier.price === 9.99 ? 7.99 : 19.99}/mo`}
                    {tier.price > 0 && " (Save 20%)"}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Conversion Goals + Coin Packs */}
      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Conversion Goals */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
        >
          <Card className="crosshair-mark glow-ambient bracket-corner watermark-crest">
            <CardHeader className="p-4 sm:p-6">
              <span className="micro-lang block mb-1" data-en="CONVERSION // GOALS" data-ja="コンバージョン" />
              <CardTitle className="text-base sm:text-lg">Conversion Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 px-4 pb-4 sm:px-6 sm:pb-6">
              {conversionGoals.map((goal) => (
                <div key={goal.label}>
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                    <span className="text-white/70">{goal.label}</span>
                    <span className="text-white/30">
                      <span className="text-gold-400">{goal.current}</span>
                      <span className="text-white/20 mx-1">→</span>
                      <span className="text-emerald-400">{goal.target}</span>
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-[rgba(255,255,255,0.06)]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="rounded-[4px] border border-white/[0.06] bg-[rgba(0,0,0,0.3)] p-3 cut-corner">
                <p className="text-xs text-white/40">
                  Conversion tracking will begin after Stripe integration is complete.
                  Current focus: building features and growing the user base.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Coin Packs Preview */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <Card className="crosshair-mark glow-ambient-cyan bracket-corner watermark-crest">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
              <div>
                <span className="micro-lang block mb-1" data-en="COIN // PACKS" data-ja="コインパック" />
                <CardTitle className="text-base sm:text-lg">Coin Packs</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">Microtransactions</Badge>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="space-y-2 sm:space-y-3">
                {coinPacks.map((pack) => (
                  <div
                    key={pack.id}
                    className="flex items-center justify-between rounded-[4px] border border-white/[0.06] bg-[rgba(255,255,255,0.02)] p-3 transition-all duration-300 premium-transition hover:border-[rgba(229,197,135,0.25)] hover:bg-[rgba(229,197,135,0.04)]"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-[4px] bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                        <Coins className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-white truncate">
                          {pack.label}
                        </p>
                        <p className="text-[11px] sm:text-xs text-white/30">
                          {pack.coins} coins{pack.bonus > 0 ? ` + ${pack.bonus} bonus` : ""}
                        </p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm font-semibold text-white shrink-0">
                      ${pack.price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-3 sm:mt-4 rounded-[4px] border border-white/[0.06] bg-[rgba(0,0,0,0.3)] p-3 cut-corner">
                <p className="text-xs text-white/40">
                  Coin system is configured but not yet accepting payments.
                  Stripe integration is required to go live.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Referral Program + Quick Actions */}
      <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Referral Program */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.4 }}
        >
          <Card className="diamond-indicator glow-ambient bracket-corner watermark-crest">
            <CardHeader className="p-4 sm:p-6">
              <span className="micro-lang block mb-1" data-en="REFERRAL // PROGRAM" data-ja="紹介プログラム" />
              <CardTitle className="text-base sm:text-lg">Referral Program</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="rounded-[4px] border border-white/[0.06] bg-[rgba(0,0,0,0.3)] p-4 text-center cut-corner">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400">$5</p>
                  <p className="mt-1 text-xs text-white/40">Your reward per referral</p>
                </div>
                <div className="rounded-[4px] border border-white/[0.06] bg-[rgba(0,0,0,0.3)] p-4 text-center cut-corner">
                  <p className="text-xl sm:text-2xl font-bold text-violet-400">20%</p>
                  <p className="mt-1 text-xs text-white/40">Friend&apos;s first month discount</p>
                </div>
                <div className="rounded-[4px] border border-white/[0.06] bg-[rgba(0,0,0,0.3)] p-4 text-center cut-corner">
                  <p className="text-xl sm:text-2xl font-bold text-amber-400">10</p>
                  <p className="mt-1 text-xs text-white/40">Max referrals/month</p>
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-white/40">
                Refer friends to AniVerse. You earn $5 in credits per referral,
                and your friend gets 20% off their first month. Minimum $20 to cash out.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.4 }}
        >
          <Card className="crosshair-mark glow-ambient bracket-corner watermark-crest">
            <CardHeader className="p-4 sm:p-6">
              <span className="micro-lang block mb-1" data-en="ACTIONS" data-ja="アクション" />
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 px-4 pb-4 sm:px-6 sm:pb-6">
              <Link href="/dashboard/create" className="block w-full">
                <Button variant="outline" className="w-full justify-start gap-3 text-xs sm:text-sm">
                  <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-400" />
                  Generate Artwork
                </Button>
              </Link>
              <Link href="/dashboard/marketplace" className="block w-full">
                <Button variant="outline" className="w-full justify-start gap-3 text-xs sm:text-sm">
                  <ShoppingCart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                  Browse Marketplace
                </Button>
              </Link>
              <Link href="/register?plan=pro" className="block w-full">
                <Button variant="outline" className="w-full justify-start gap-3 text-xs sm:text-sm">
                  <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
                  View Pro Plan
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
    </ErrorBoundary>
  );
}
