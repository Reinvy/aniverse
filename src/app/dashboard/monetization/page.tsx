"use client";

import { motion } from "framer-motion";
import {
  DollarSign,
  TrendingUp,
  Users,
  ShoppingCart,
  Sparkles,
  ArrowUpRight,
  Coins,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="glow-gold"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card className="group border-zinc-800/60 transition-all duration-200 hover:border-zinc-700">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <Badge
                      variant="secondary"
                      className={`flex items-center gap-0.5 border-0 bg-zinc-800 text-xs ${
                        stat.trendUp ? "text-emerald-400" : "text-zinc-500"
                      }`}
                    >
                      <ArrowUpRight className={`h-3 w-3 ${stat.trendUp ? "text-emerald-400" : "text-zinc-500"}`} />
                      {stat.trend}
                    </Badge>
                  </div>
                  <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="mt-0.5 text-xs sm:text-sm text-zinc-500">{stat.subtext}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Pricing Tiers Overview */}
      <motion.div
        className="mt-6 sm:mt-8 corner-accents"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <Card className="border-zinc-800/60 angled-bar">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-4 sm:p-6">
            <div>
              <span className="sys-label mb-1 block text-[10px] tracking-[0.2em] text-zinc-500">PRICING // TIERS</span>
              <CardTitle className="text-base sm:text-lg">Pricing Tiers</CardTitle>
            </div>
            <Badge variant="secondary" className="text-xs shrink-0">Target Audience: ~1,288 users</Badge>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Object.values(pricingTiers).map((tier) => (
                <div
                  key={tier.name}
                  className={`rounded-xl border p-4 sm:p-5 ${
                    tier.popular
                      ? "border-violet-700/50 bg-violet-950/20"
                      : "border-zinc-800/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base sm:text-lg font-semibold text-white">{tier.name}</h3>
                    {tier.popular && (
                      <Badge className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-xs shrink-0">
                        Most Popular
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-zinc-400">{tier.description}</p>
                  <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-extrabold text-white">
                    {tier.price === 0 ? "Free" : `$${tier.price}`}
                    {tier.price > 0 && <span className="text-base font-normal text-zinc-500">/mo</span>}
                  </p>
                  <ul className="mt-3 sm:mt-4 space-y-1.5 sm:space-y-2">
                    {tier.features.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs sm:text-sm text-zinc-300">
                        <Sparkles className="mt-0.5 h-3 w-3 sm:h-3.5 sm:w-3.5 shrink-0 text-violet-400" />
                        {f}
                      </li>
                    ))}
                    {tier.features.length > 4 && (
                      <li className="text-xs text-zinc-500">+{tier.features.length - 4} more features</li>
                    )}
                  </ul>
                  <p className="mt-2 sm:mt-3 text-xs text-zinc-600">
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
          <Card className="border-zinc-800/60 angled-bar">
            <CardHeader className="p-4 sm:p-6">
              <span className="sys-label mb-1 block text-[10px] tracking-[0.2em] text-zinc-500">CONVERSION // GOALS</span>
              <CardTitle className="text-base sm:text-lg">Conversion Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-5 px-4 pb-4 sm:px-6 sm:pb-6">
              {conversionGoals.map((goal) => (
                <div key={goal.label}>
                  <div className="flex items-center justify-between text-xs sm:text-sm mb-1">
                    <span className="text-zinc-300">{goal.label}</span>
                    <span className="text-zinc-500">
                      <span className="text-amber-400">{goal.current}</span>
                      <span className="text-zinc-600 mx-1">→</span>
                      <span className="text-emerald-400">{goal.target}</span>
                    </span>
                  </div>
                  <div className="h-1.5 sm:h-2 w-full overflow-hidden rounded-full bg-zinc-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600"
                      style={{ width: `${goal.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="rounded-lg bg-zinc-800/40 p-3">
                <p className="text-xs text-zinc-500">
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
          <Card className="border-zinc-800/60 corner-accents">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
              <div>
                <span className="sys-label mb-1 block text-[10px] tracking-[0.2em] text-zinc-500">COIN // PACKS</span>
                <CardTitle className="text-base sm:text-lg">Coin Packs</CardTitle>
              </div>
              <Badge variant="secondary" className="text-xs">Microtransactions</Badge>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="space-y-2 sm:space-y-3">
                {coinPacks.map((pack) => (
                  <div
                    key={pack.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800/60 p-3 transition-colors hover:border-zinc-700"
                  >
                    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                      <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg">
                        <Coins className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-white truncate">
                          {pack.label}
                        </p>
                        <p className="text-[11px] sm:text-xs text-zinc-500">
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
              <div className="mt-3 sm:mt-4 rounded-lg bg-zinc-800/40 p-3">
                <p className="text-xs text-zinc-500">
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
          <Card className="border-zinc-800/60 corner-accents">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Referral Program</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
                <div className="rounded-lg bg-zinc-800/40 p-4 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-emerald-400">$5</p>
                  <p className="mt-1 text-xs text-zinc-400">Your reward per referral</p>
                </div>
                <div className="rounded-lg bg-zinc-800/40 p-4 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-violet-400">20%</p>
                  <p className="mt-1 text-xs text-zinc-400">Friend&apos;s first month discount</p>
                </div>
                <div className="rounded-lg bg-zinc-800/40 p-4 text-center">
                  <p className="text-xl sm:text-2xl font-bold text-amber-400">10</p>
                  <p className="mt-1 text-xs text-zinc-400">Max referrals/month</p>
                </div>
              </div>
              <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-zinc-500">
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
          <Card className="border-zinc-800/60">
            <CardHeader className="p-4 sm:p-6">
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
