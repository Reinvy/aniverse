"use client";

import { motion } from "framer-motion";
import {
  Trophy,
  Sparkles,
  Palette,
  Clock,
  Users,
  Coins,
  Award,
  Target,
  ChevronRight,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { dailyChallenge } from "@/data/challenges/daily-20260724";
import { weeklyChallenge } from "@/data/challenges/weekly-20260724";

export default function ChallengesPage() {
  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white sm:text-3xl">
              Daily & Weekly Challenges
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Create, compete, and earn rewards. New challenges every day.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="gap-1 border-0 bg-zinc-800 px-3 py-1.5">
              <Coins className="h-3.5 w-3.5 text-amber-400" />
              <span>Season 1</span>
            </Badge>
            <Badge variant="default" className="gap-1 px-3 py-1.5">
              <TrendingUp className="h-3.5 w-3.5" />
              <span>24 Participants Today</span>
            </Badge>
          </div>
        </div>
      </motion.div>

      {/* ─── Daily Challenge ─── */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-violet-700/30 bg-gradient-to-br from-violet-950/40 via-zinc-900 to-fuchsia-950/30">
          {/* Decorative gradient orbs */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-20 h-60 w-60 rounded-full bg-fuchsia-600/10 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-600/30">
                    <Trophy className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-xs">
                        DAILY CHALLENGE
                      </Badge>
                      <Badge variant="warning" className="text-xs">24h remaining</Badge>
                    </div>
                    <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                      {dailyChallenge.title}
                    </h2>
                  </div>
                </div>

                <p className="mt-4 text-base leading-relaxed text-zinc-300">
                  {dailyChallenge.description}
                </p>

                {/* Color Palette Display */}
                {dailyChallenge.palette && (
                  <div className="mt-6">
                    <p className="mb-2 text-sm font-medium text-zinc-400">
                      <Palette className="mr-1.5 inline h-4 w-4" />
                      Required Palette ({dailyChallenge.palette.length} colors)
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dailyChallenge.palette.map((color) => (
                        <div
                          key={color}
                          className="group relative"
                        >
                          <div
                            className="h-10 w-10 rounded-lg border border-zinc-700/50 shadow-lg transition-transform hover:scale-110"
                            style={{ backgroundColor: color }}
                          />
                          <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-zinc-600 opacity-0 transition-opacity group-hover:opacity-100">
                            {color}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Rules */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-zinc-300">Rules</h3>
                  <ul className="mt-2 space-y-1.5">
                    {dailyChallenge.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-500" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prompt */}
                <div className="mt-6 rounded-lg bg-zinc-800/40 p-4">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">AI Prompt Suggestion</p>
                  <p className="mt-1 text-sm text-zinc-300 italic">
                    &ldquo;{dailyChallenge.prompt}&rdquo;
                  </p>
                </div>
              </div>

              {/* Prize Card */}
              <div className="shrink-0 lg:w-72">
                <Card className="border-zinc-700/50 bg-zinc-800/40">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-400" />
                      <span className="text-sm font-semibold text-white">Prize</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
                      {dailyChallenge.prize}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                      <Users className="h-3.5 w-3.5" />
                      <span>{dailyChallenge.participants} participants so far</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{dailyChallenge.timeLeft} left</span>
                    </div>
                    <Button className="mt-5 w-full gap-2 shadow-lg shadow-violet-600/20">
                      <Sparkles className="h-4 w-4" />
                      Submit Entry
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Weekly Challenge ─── */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-amber-700/30 bg-gradient-to-br from-amber-950/30 via-zinc-900 to-orange-950/20">
          {/* Decorative gradient orbs */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-amber-600/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-orange-600/10 blur-3xl" />

          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-600/30">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-gradient-to-r from-amber-500 to-orange-600 text-xs">
                        WEEKLY CHALLENGE
                      </Badge>
                      <Badge variant="secondary" className="text-xs">7 days left</Badge>
                    </div>
                    <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                      {weeklyChallenge.title}
                    </h2>
                  </div>
                </div>

                <p className="mt-4 text-base leading-relaxed text-zinc-300">
                  {weeklyChallenge.description}
                </p>

                {/* Rules */}
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-zinc-300">Rules</h3>
                  <ul className="mt-2 space-y-1.5">
                    {weeklyChallenge.rules.map((rule, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-zinc-400">
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Prompt */}
                <div className="mt-6 rounded-lg bg-zinc-800/40 p-4">
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">AI Prompt Suggestion</p>
                  <p className="mt-1 text-sm text-zinc-300 italic">
                    &ldquo;{weeklyChallenge.prompt}&rdquo;
                  </p>
                </div>

                {/* Milestones */}
                {weeklyChallenge.milestones && (
                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-zinc-300">Community Milestones</h3>
                    <div className="mt-3 space-y-2">
                      {weeklyChallenge.milestones.map((ms, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-3 rounded-lg border border-zinc-800/60 bg-zinc-800/30 p-3"
                        >
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-900/40 text-xs font-bold text-amber-400">
                            {ms.participants}
                          </div>
                          <span className="text-sm text-zinc-300">{ms.reward}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Prize Card */}
              <div className="shrink-0 lg:w-72">
                <Card className="border-zinc-700/50 bg-zinc-800/40">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-amber-400" />
                      <span className="text-sm font-semibold text-white">Prizes</span>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-zinc-300 whitespace-pre-line">
                      {weeklyChallenge.prize}
                    </p>
                    <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Jul 24 – Jul 30</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
                      <Users className="h-3.5 w-3.5" />
                      <span>{weeklyChallenge.participants} participants so far</span>
                    </div>
                    <Button className="mt-5 w-full gap-2 border-amber-600/50 text-amber-300 shadow-lg shadow-amber-600/10 hover:bg-amber-950/30" variant="outline">
                      <Sparkles className="h-4 w-4" />
                      Join Weekly Challenge
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Challenge History ─── */}
      <motion.div
        className="mt-10"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <Card className="border-zinc-800/60">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Previous Challenges</CardTitle>
            <Badge variant="secondary" className="text-xs">Past 7 Days</Badge>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-zinc-800/60">
              {pastChallenges.map((challenge, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${challenge.color} shadow-sm`}>
                      <Trophy className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{challenge.title}</p>
                      <p className="text-xs text-zinc-500">{challenge.date} · {challenge.participants} participants</p>
                    </div>
                  </div>
                  <Badge
                    variant={challenge.winner ? "success" : "secondary"}
                    className="text-xs"
                  >
                    {challenge.winner ? `${challenge.winner} won` : "Closed"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

const pastChallenges = [
  {
    title: "Monochrome Magic",
    date: "Mon, Jul 21",
    participants: 18,
    color: "bg-gradient-to-br from-zinc-500 to-slate-600",
    winner: "CyberWeeb",
  },
  {
    title: "Fantasy Fusion",
    date: "Tue, Jul 22",
    participants: 23,
    color: "bg-gradient-to-br from-violet-500 to-purple-600",
    winner: "MoriArt",
  },
  {
    title: "OC Introduction",
    date: "Wed, Jul 23",
    participants: 15,
    color: "bg-gradient-to-br from-fuchsia-500 to-pink-600",
    winner: null,
  },
];
