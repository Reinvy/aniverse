"use client";

import { motion } from "framer-motion";
import {
  MessageCircle,
  Camera,
  Bookmark,
  Music,
  Share2,
  TrendingUp,
  Clock,
  Image,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { APP_URL } from "@/lib/constants";
import Link from "next/link";

const socialPlatforms = [
  {
    name: "Twitter / X",
    icon: MessageCircle,
    gradient: "from-sky-500 to-blue-600",
    posts: 5,
    status: "scheduled",
    time: "10:05 - 10:45 WIB",
    type: "Thread (5 tweets)",
  },
  {
    name: "Instagram",
    icon: Camera,
    gradient: "from-fuchsia-500 to-rose-600",
    posts: 1,
    status: "scheduled",
    time: "10:00 WIB",
    type: "Carousel (7 slides)",
  },
  {
    name: "Pinterest",
    icon: Bookmark,
    gradient: "from-red-600 to-orange-600",
    posts: 7,
    status: "scheduled",
    time: "10:00 WIB",
    type: "7 pins across 2 boards",
  },
  {
    name: "TikTok",
    icon: Music,
    gradient: "from-zinc-900 to-zinc-700",
    posts: 3,
    status: "scheduled",
    time: "11:00 / 14:00 / 17:00 WIB",
    type: "3 video variants",
  },
];

const todaysStats = [
  {
    label: "Total Posts Scheduled",
    value: "16",
    subtext: "Across 4 platforms",
    icon: Share2,
    color: "text-violet-400",
  },
  {
    label: "Artworks Featured",
    value: "7",
    subtext: "From today's A3 generation",
    icon: Image,
    color: "text-fuchsia-400",
  },
  {
    label: "Est. Reach",
    value: "14.2K+",
    subtext: "Combined platform reach",
    icon: TrendingUp,
    color: "text-emerald-400",
  },
  {
    label: "Next Post",
    value: "10:00 WIB",
    subtext: "IG Carousel goes live",
    icon: Clock,
    color: "text-amber-400",
  },
];

const scheduledPosts = [
  {
    platform: "Instagram",
    time: "10:00 WIB",
    content: "7-Artwork Carousel — Daily Art Drop (VHS Memories lead)",
    status: "ready",
  },
  {
    platform: "Twitter / X",
    time: "10:05 WIB",
    content: "Tweet 1/5: VHS Memories showcase",
    status: "ready",
  },
  {
    platform: "Twitter / X",
    time: "10:15 WIB",
    content: "Tweet 2/5: Vaporwave revival & tips",
    status: "ready",
  },
  {
    platform: "Twitter / X",
    time: "10:25 WIB",
    content: "Tweet 3/5: Art Nouveau x Anime fusion",
    status: "ready",
  },
  {
    platform: "Twitter / X",
    time: "10:35 WIB",
    content: "Tweet 4/5: Sepia Nostalgia + Pastel Goth",
    status: "ready",
  },
  {
    platform: "Twitter / X",
    time: "10:45 WIB",
    content: "Tweet 5/5: Story teaser + CTA + poll",
    status: "ready",
  },
  {
    platform: "Pinterest",
    time: "10:00 WIB",
    content: "7 pins — AI Anime Art Inspiration + Style Guide boards",
    status: "ready",
  },
  {
    platform: "TikTok",
    time: "11:00 WIB",
    content: "Variant A: 7 Artworks in 60s",
    status: "ready",
  },
  {
    platform: "TikTok",
    time: "14:00 WIB",
    content: "Variant B: Prompt to Vaporwave Artwork",
    status: "ready",
  },
  {
    platform: "TikTok",
    time: "17:00 WIB",
    content: "Variant C: 90s vs AI Anime Challenge",
    status: "ready",
  },
];

export default function SocialDashboardPage() {
  return (
    <ErrorBoundary compact message="Failed to load social dashboard">
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <PageHeader
        title="Social Media Empire"
        description="SOCIAL // POSTING — Agent A7 daily social media automation"
        actions={
          <Link href={APP_URL} target="_blank" className="w-full sm:w-auto">
            <Button className="w-full gap-2 sm:w-auto shadow-lg shadow-violet-600/20">
              <ExternalLink className="h-4 w-4" />
              View Site
            </Button>
          </Link>
        }
      />

      {/* Stats Grid */}
      <motion.div
        className="mt-6 sm:mt-8 grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-4 lg:grid-cols-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
      >
        {todaysStats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              className="glow-gold"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <Card className="group border-zinc-800/60 transition-all duration-200 hover:border-zinc-700">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg">
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
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

      {/* Platform Cards */}
      <div className="sys-label text-xs tracking-widest text-zinc-500 mb-3 uppercase">PLATFORMS // CHANNELS</div>
      <motion.div
        className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        {socialPlatforms.map((platform, i) => {
          const Icon = platform.icon;
          return (
            <motion.div
              key={platform.name}
              className="corner-accents energy-sweep"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.08, duration: 0.4 }}
            >
              <Card className="border-zinc-800/60 transition-all duration-200 hover:border-zinc-700 h-full">
                <CardContent className="p-4 sm:p-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${platform.gradient} shadow-lg`}
                    >
                      <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-semibold text-white truncate">
                        {platform.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-zinc-500 truncate">{platform.type}</p>
                    </div>
                  </div>
                  <div className="mt-3 sm:mt-4 flex items-center justify-between">
                    <div>
                      <p className="text-lg sm:text-xl font-bold text-white">
                        {platform.posts}
                      </p>
                      <p className="text-[11px] sm:text-xs text-zinc-500">posts today</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className="flex items-center gap-1 border-0 bg-emerald-500/10 text-emerald-400"
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      {platform.status}
                    </Badge>
                  </div>
                  <p className="mt-2 sm:mt-3 text-[11px] sm:text-xs text-zinc-600 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {platform.time}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Schedule Timeline */}
      <div className="sys-label text-xs tracking-widest text-zinc-500 mb-3 uppercase">SCHEDULE // TODAY</div>
      <motion.div
        className="mt-6 sm:mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Card className="corner-accents border-zinc-800/60">
          <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
            <CardTitle className="text-base sm:text-lg">Today&apos;s Posting Schedule</CardTitle>
            <Badge variant="secondary" className="text-xs">
              {new Date().toLocaleDateString("en-CA")}
            </Badge>
          </CardHeader>
          <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
            <div className="space-y-2 sm:space-y-3">
              {scheduledPosts.map((post, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 sm:gap-4 border-b border-zinc-800/40 pb-2 sm:pb-3 last:border-0 last:pb-0"
                >
                  <div className="flex h-6 sm:h-8 w-auto min-w-[3.5rem] sm:min-w-[4rem] shrink-0 items-center justify-center rounded-md bg-zinc-800 px-1.5 sm:px-2 text-[10px] sm:text-xs font-medium text-zinc-300">
                    {post.time}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-zinc-200">{post.content}</p>
                    <p className="text-[11px] sm:text-xs text-zinc-500">{post.platform}</p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="shrink-0 border-0 bg-emerald-500/10 text-emerald-400 text-[10px]"
                  >
                    Ready
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Files Info */}
      <motion.div
        className="mt-4 sm:mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <Card className="border-zinc-800/60">
          <CardContent className="p-4 sm:p-5">
            <p className="text-xs text-zinc-500">
              📁 Data files: src/data/social/twitter-20260725.ts • instagram-20260725.ts • pinterest-20260725.ts • tiktok-20260725.ts
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Note: API publishing requires platform API keys. Posts are saved as data files ready for publishing.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
    </ErrorBoundary>
  );
}
