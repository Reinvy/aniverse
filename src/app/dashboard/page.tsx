"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Image,
  Wand2,
  TrendingUp,
  DollarSign,
  Clock,
  Heart,
  ArrowUpRight,
  Sparkles,
  Loader2,
  Users,
  Coins,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import Link from "next/link";
import { useAuth } from "@/components/auth/AuthProvider";

interface DashboardStats {
  generationsUsed: number;
  generationLimit: number | string;
  generationsLeft: number;
  usagePercent: number;
  totalArtworks: number;
  totalLikes: number;
  likesReceived: number;
  totalFollowers: number;
  totalFollowing: number;
  totalEarnings: number;
  coinBalance: number;
  daysUntilReset: number;
  tier: string;
  isUnlimited: boolean;
}

interface ActivityItem {
  type: string;
  action: string;
  detail: string;
  time: string;
}

type LoadState = "loading" | "loaded" | "error";

const TOKEN_KEY = "aniverse_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoadState("error");
      return;
    }

    fetch("/api/dashboard/stats", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => {
        setStats(data.stats);
        setActivity(data.activity || []);
        setLoadState("loaded");
      })
      .catch(() => {
        setLoadState("error");
      });
  }, []);

  // ── Build stats cards from real data ──────────────────────────
  const statsCards = stats
    ? [
        {
          title: "Generations Used",
          value: `${stats.generationsUsed}${stats.isUnlimited ? "" : ` / ${stats.generationLimit}`}`,
          subtext: stats.isUnlimited
            ? "Unlimited plan"
            : `${stats.generationsLeft} remaining this month`,
          icon: Wand2,
          gradient: "from-violet-500 to-purple-600",
          trend: `${stats.usagePercent}%`,
          trendUp: stats.generationsUsed > 0,
        },
        {
          title: "Total Artworks",
          value: String(stats.totalArtworks),
          subtext: "Across all galleries",
          icon: Image,
          gradient: "from-fuchsia-500 to-pink-600",
          trend:
            stats.totalArtworks > 0 ? `+${stats.totalArtworks}` : "0",
          trendUp: stats.totalArtworks > 0,
        },
        {
          title: "Likes Received",
          value: String(stats.likesReceived),
          subtext: "From community",
          icon: Heart,
          gradient: "from-rose-500 to-red-600",
          trend:
            stats.likesReceived > 0 ? `+${stats.likesReceived}` : "0",
          trendUp: stats.likesReceived > 0,
        },
        {
          title: "Earnings",
          value: `$${stats.totalEarnings.toFixed(2)}`,
          subtext: "Marketplace sales",
          icon: DollarSign,
          gradient: "from-emerald-500 to-teal-600",
          trend:
            stats.totalEarnings > 0
              ? `+$${stats.totalEarnings.toFixed(2)}`
              : "$0",
          trendUp: stats.totalEarnings > 0,
        },
      ]
    : [];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
              Dashboard
            </h1>
            <p className="mt-0.5 text-sm text-zinc-400">
              Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}!
              Here&apos;s an overview of your activity.
            </p>
          </div>
          <Link href="/dashboard/create" className="w-full sm:w-auto">
            <Button className="w-full gap-2 sm:w-auto shadow-lg shadow-violet-600/20">
              <Sparkles className="h-4 w-4" />
              Create New
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Loading State */}
      {loadState === "loading" && (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
          <p className="mt-4 text-sm text-zinc-500">
            Loading your dashboard...
          </p>
        </div>
      )}

      {/* Error State */}
      {loadState === "error" && (
        <div className="mt-20 flex flex-col items-center justify-center text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-900/30">
            <TrendingUp className="h-7 w-7 text-red-400" />
          </div>
          <p className="mt-4 text-lg font-medium text-zinc-300">
            Could not load dashboard
          </p>
          <p className="mt-1 text-sm text-zinc-500">
            Please make sure you are logged in and try again.
          </p>
          <Button
            variant="outline"
            className="mt-6"
            onClick={() => {
              setLoadState("loading");
              const token = getToken();
              if (!token) {
                setLoadState("error");
                return;
              }
              fetch("/api/dashboard/stats", {
                headers: { Authorization: `Bearer ${token}` },
              })
                .then((res) => {
                  if (!res.ok) throw new Error("Failed");
                  return res.json();
                })
                .then((data) => {
                  setStats(data.stats);
                  setActivity(data.activity || []);
                  setLoadState("loaded");
                })
                .catch(() => setLoadState("error"));
            }}
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Stats Grid */}
      {loadState === "loaded" && stats && (
        <motion.div
          className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
        >
          {statsCards.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
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
                        <ArrowUpRight
                          className={`h-3 w-3 ${stat.trendUp ? "text-emerald-400" : "text-zinc-500"}`}
                        />
                        <span>{stat.trend}</span>
                      </Badge>
                    </div>
                    <p className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold text-white">
                      {stat.value}
                    </p>
                    <p className="mt-0.5 text-xs sm:text-sm text-zinc-500">
                      {stat.subtext}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* Recent Activity + Quick Actions */}
      {loadState === "loaded" && (
        <div className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <Card className="border-zinc-800/60">
              <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">
                  Recent Activity
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {activity.length > 0 ? "Latest" : "No activity"}
                </Badge>
              </CardHeader>
              <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
                {activity.length === 0 ? (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Sparkles className="h-8 w-8 text-zinc-700" />
                    <p className="mt-3 text-sm text-zinc-500">
                      No activity yet. Start by creating your first artwork!
                    </p>
                    <Link href="/dashboard/create" className="mt-4">
                      <Button size="sm" className="gap-2">
                        <Wand2 className="h-4 w-4" />
                        Create Artwork
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
                    {activity.map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 sm:gap-4 border-b border-zinc-800/40 pb-3 sm:pb-4 last:border-0 last:pb-0"
                      >
                        <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                          {item.type === "create" && (
                            <Wand2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-400" />
                          )}
                          {item.type === "like" && (
                            <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-400" />
                          )}
                          {item.type === "comment" && (
                            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
                          )}
                          {item.type === "sale" && (
                            <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm text-zinc-200">
                            {item.action}
                          </p>
                          <p className="text-[11px] sm:text-xs text-zinc-500 truncate">
                            {item.detail}
                          </p>
                        </div>
                        <span className="shrink-0 text-[11px] sm:text-xs text-zinc-600">
                          {timeAgo(new Date(item.time))}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.4 }}
          >
            <Card className="border-zinc-800/60">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 sm:space-y-3 px-4 pb-4 sm:px-6 sm:pb-6">
                <Link href="/dashboard/create" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 text-xs sm:text-sm"
                  >
                    <Wand2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-400" />
                    Generate New Artwork
                  </Button>
                </Link>
                <Link href="/dashboard/gallery" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 text-xs sm:text-sm"
                  >
                    <Image className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-fuchsia-400" />
                    Browse My Gallery
                  </Button>
                </Link>
                <Link href="/dashboard/marketplace" className="block w-full">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 text-xs sm:text-sm"
                  >
                    <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                    Marketplace
                  </Button>
                </Link>
                <hr className="border-zinc-800" />
                <div className="rounded-lg bg-zinc-800/40 p-3">
                  <div className="flex items-center gap-2 text-xs sm:text-sm">
                    <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
                    <span className="text-zinc-300">
                      {stats
                        ? stats.isUnlimited
                          ? "Unlimited generations"
                          : `${stats.generationsLeft} generations left`
                        : "Loading..."}
                    </span>
                  </div>
                  {stats && !stats.isUnlimited && (
                    <>
                      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-700">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                          style={{
                            width: `${Math.min(100, stats.usagePercent)}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-zinc-500">
                        Resets in {stats.daysUntilReset} day
                        {stats.daysUntilReset !== 1 ? "s" : ""}
                      </p>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </div>
  );
}
