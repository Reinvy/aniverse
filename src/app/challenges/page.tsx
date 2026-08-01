"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Clock,
  Coins,
  Sparkles,
  Users,
  ArrowRight,
  CalendarDays,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FetchErrorState } from "@/components/ui/fetch-error";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "DAILY" | "WEEKLY";
  status: "ACTIVE" | "COMPLETED" | "CANCELLED";
  startsAt: string;
  endsAt: string;
  rewardCoins: number;
  prompt: string | null;
  createdAt: string;
  _count: { submissions: number };
}

// ─── Skeleton ─────────────────────────────────────────────────────

function ChallengeSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {[1, 2].map((i) => (
        <div key={i} className="glass rounded-[4px] cut-corner p-6">
          <Skeleton className="h-5 w-16 mb-3" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getTimeRemaining(endsAt: string): string {
  const now = new Date();
  const end = new Date(endsAt);
  const diffMs = end.getTime() - now.getTime();

  if (diffMs <= 0) return "Ended";

  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) return `${days}d ${hours}h remaining`;
  return `${hours}h remaining`;
}

// ─── Main Page ────────────────────────────────────────────────────

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scope, setScope] = useState<"active" | "all">("active");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const fetchChallenges = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/challenges?scope=${scope}&limit=50`);
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        const data = await res.json();
        setChallenges(data.challenges || []);
      } catch (err) {
        console.error("Failed to fetch challenges:", err);
        setError(err instanceof Error ? err.message : "Failed to load challenges");
        setChallenges([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [scope, retryKey]);

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24 pb-16">
        {/* Background layers */}
        <div className="pointer-events-none fixed inset-0 bg-eclipse" />
        <div className="pointer-events-none fixed inset-0 bg-starfield opacity-40" />
        <div className="pointer-events-none fixed inset-0 bg-grid opacity-15" />
        <div className="pointer-events-none fixed inset-0 scanline" />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Trophy className="mr-1.5 h-3.5 w-3.5" />
              CHALLENGES // GAMIFICATION
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Weekly Challenges
            </h1>
            <p className="mt-3 text-lg text-white/50 max-w-2xl mx-auto">
              Compete with the community, showcase your creativity, and earn
              rewards. New challenges every week!
            </p>
          </motion.div>

          {/* Scope Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-2 mb-8"
          >
            <button
              onClick={() => setScope("active")}
              className={cn(
                "px-4 py-2 rounded-[4px] text-sm transition-all duration-200",
                scope === "active"
                  ? "bg-gold-400/20 text-gold-300 border border-stroke-gold"
                  : "bg-glass-300 text-white/50 border border-transparent hover:border-stroke-gold hover:text-gold-300",
              )}
            >
              Active
            </button>
            <button
              onClick={() => setScope("all")}
              className={cn(
                "px-4 py-2 rounded-[4px] text-sm transition-all duration-200",
                scope === "all"
                  ? "bg-gold-400/20 text-gold-300 border border-stroke-gold"
                  : "bg-glass-300 text-white/50 border border-transparent hover:border-stroke-gold hover:text-gold-300",
              )}
            >
              All Challenges
            </button>
          </motion.div>

          {/* Challenges List */}
          {loading ? (
            <ChallengeSkeleton />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto"
            >
              <FetchErrorState
                title="Could not load challenges"
                message={error}
                onRetry={() => setRetryKey((k) => k + 1)}
              />
            </motion.div>
          ) : challenges.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="glass rounded-xl p-10 max-w-md mx-auto cut-corner">
                <Trophy className="mx-auto h-12 w-12 text-white/20 mb-4" />
                <p className="text-white/40 text-sm">
                  {scope === "active"
                    ? "No active challenges right now. Check back soon!"
                    : "No challenges found."}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="space-y-6"
            >
              {challenges.map((challenge, i) => (
                <motion.div
                  key={challenge.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                >
                  <Card className="group cut-corner energy-sweep relative overflow-hidden">
                    <CardContent className="p-6 sm:p-8">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          {/* Type badge */}
                          <div className="flex items-center gap-2 mb-3">
                            <Badge
                              variant={challenge.type === "WEEKLY" ? "default" : "secondary"}
                              className="text-[10px] px-2 py-0.5"
                            >
                              {challenge.type}
                            </Badge>
                            {challenge.status === "ACTIVE" && (
                              <span className="flex items-center gap-1 text-[10px] text-cyan-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                LIVE
                              </span>
                            )}
                          </div>

                          {/* Title */}
                          <h2 className="text-lg font-bold text-white group-hover:text-gold-300 transition-colors mb-2">
                            {challenge.title}
                          </h2>

                          {/* Description */}
                          <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-3">
                            {challenge.description}
                          </p>

                          {/* Meta */}
                          <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                            <span className="flex items-center gap-1.5">
                              <CalendarDays className="h-3.5 w-3.5" />
                              {formatDate(challenge.startsAt)} — {formatDate(challenge.endsAt)}
                            </span>
                            <span className="flex items-center gap-1.5 text-cyan-400">
                              <Clock className="h-3.5 w-3.5" />
                              {getTimeRemaining(challenge.endsAt)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5" />
                              {challenge._count.submissions} submissions
                            </span>
                          </div>
                        </div>

                        {/* Right side: Reward + Action */}
                        <div className="flex flex-row sm:flex-col items-center sm:items-end gap-3 sm:gap-4 shrink-0">
                          <div className="flex items-center gap-2 px-3 py-2 rounded-[4px] bg-gold-400/10 border border-stroke-gold/30">
                            <Coins className="h-4 w-4 text-gold-400" />
                            <span className="text-sm font-bold text-gold-300">
                              {challenge.rewardCoins}
                            </span>
                          </div>
                          <Link href={challenge.status === "ACTIVE" ? `/dashboard/challenges?id=${challenge.id}` : "#"}>
                            <Button
                              variant={challenge.status === "ACTIVE" ? "primary" : "outline"}
                              size="sm"
                              className="gap-2"
                              disabled={challenge.status !== "ACTIVE"}
                            >
                              {challenge.status === "ACTIVE" ? (
                                <>Participate <ArrowRight className="h-3.5 w-3.5" /></>
                              ) : (
                                "Ended"
                              )}
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Bottom CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-16 text-center"
          >
            <div className="glass rounded-xl p-8 cut-corner max-w-lg mx-auto">
              <Sparkles className="mx-auto h-8 w-8 text-gold-400 mb-3" />
              <h3 className="text-lg font-bold text-white mb-2">
                Ready to join the challenge?
              </h3>
              <p className="text-sm text-white/40 mb-4">
                Sign up for free and start participating in weekly challenges
                to earn coins and showcase your art.
              </p>
              <Link href="/register">
                <Button variant="primary" className="gap-2">
                  Sign Up Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  );
}
