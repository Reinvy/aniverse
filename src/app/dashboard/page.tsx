"use client";

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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatNumber, timeAgo } from "@/lib/utils";
import Link from "next/link";

const statsCards = [
  {
    title: "Generations Used",
    value: "3 / 10",
    subtext: "Free tier limit",
    icon: Wand2,
    gradient: "from-violet-500 to-purple-600",
    trend: "+12%",
    trendUp: true,
  },
  {
    title: "Total Artworks",
    value: "8",
    subtext: "Across all galleries",
    icon: Image,
    gradient: "from-fuchsia-500 to-pink-600",
    trend: "+2",
    trendUp: true,
  },
  {
    title: "Likes Received",
    value: "142",
    subtext: "From community",
    icon: Heart,
    gradient: "from-rose-500 to-red-600",
    trend: "+23%",
    trendUp: true,
  },
  {
    title: "Earnings",
    value: "$24.50",
    subtext: "Marketplace sales",
    icon: DollarSign,
    gradient: "from-emerald-500 to-teal-600",
    trend: "+$12",
    trendUp: true,
  },
];

const recentActivity = [
  { action: "Created artwork", detail: "Neon Samurai", time: new Date(Date.now() - 1000 * 60 * 30), type: "create" },
  { action: "Sold artwork", detail: "Spirit Dance — $5.00", time: new Date(Date.now() - 1000 * 60 * 60 * 2), type: "sale" },
  { action: "Liked artwork", detail: "Starlight Dancer by KiraKira", time: new Date(Date.now() - 1000 * 60 * 60 * 5), type: "like" },
  { action: "Published to gallery", detail: "Cyberpunk Cityscape", time: new Date(Date.now() - 1000 * 60 * 60 * 24), type: "publish" },
];

export default function DashboardPage() {
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
              Welcome back! Here&apos;s an overview of your activity.
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

      {/* Stats Grid */}
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
                      className="flex items-center gap-0.5 border-0 bg-zinc-800 text-xs"
                    >
                      <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                      <span className="text-emerald-400">{stat.trend}</span>
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

      {/* Recent Activity + Quick Actions */}
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
              <CardTitle className="text-base sm:text-lg">Recent Activity</CardTitle>
              <Badge variant="secondary" className="text-xs">Today</Badge>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="space-y-3 sm:space-y-4">
                {recentActivity.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 sm:gap-4 border-b border-zinc-800/40 pb-3 sm:pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full bg-zinc-800">
                      {item.type === "create" && (
                        <Wand2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-400" />
                      )}
                      {item.type === "sale" && (
                        <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                      )}
                      {item.type === "like" && (
                        <Heart className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-rose-400" />
                      )}
                      {item.type === "publish" && (
                        <Image className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm text-zinc-200">{item.action}</p>
                      <p className="text-[11px] sm:text-xs text-zinc-500 truncate">
                        {item.detail}
                      </p>
                    </div>
                    <span className="shrink-0 text-[11px] sm:text-xs text-zinc-600">
                      {timeAgo(item.time)}
                    </span>
                  </div>
                ))}
              </div>
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
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 sm:space-y-3 px-4 pb-4 sm:px-6 sm:pb-6">
              <Link href="/dashboard/create" className="block w-full">
                <Button variant="outline" className="w-full justify-start gap-3 text-xs sm:text-sm">
                  <Wand2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-violet-400" />
                  Generate New Artwork
                </Button>
              </Link>
              <Link href="/dashboard/gallery" className="block w-full">
                <Button variant="outline" className="w-full justify-start gap-3 text-xs sm:text-sm">
                  <Image className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-fuchsia-400" />
                  Browse My Gallery
                </Button>
              </Link>
              <Link href="/dashboard/marketplace" className="block w-full">
                <Button variant="outline" className="w-full justify-start gap-3 text-xs sm:text-sm">
                  <DollarSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-emerald-400" />
                  Marketplace
                </Button>
              </Link>
              <hr className="border-zinc-800" />
              <div className="rounded-lg bg-zinc-800/40 p-3">
                <div className="flex items-center gap-2 text-xs sm:text-sm">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-amber-400" />
                  <span className="text-zinc-300">7 generations left</span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-zinc-700">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    style={{ width: "30%" }}
                  />
                </div>
                <p className="mt-1.5 text-xs text-zinc-500">
                  Resets in 12 days
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
