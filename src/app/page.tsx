"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Image,
  Wand2,
  Store,
  Palette,
  Zap,
  Shield,
  Users,
  ArrowRight,
  Star,
  ChevronRight,
  TrendingUp,
  PenLine,
  Share2,
  MousePointerClick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { TrendingPalettes } from "@/components/trending-palettes";
import { APP_NAME, APP_TAGLINE, TIERS, TRENDING_STYLES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const fadeInUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

const stagger = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-100px" },
  transition: { staggerChildren: 0.1 },
};

const features = [
  {
    icon: Wand2,
    title: "AI-Powered Generation",
    description:
      "Create stunning anime artwork from text prompts using state-of-the-art AI models trained on millions of anime illustrations.",
    accent: "gold",
  },
  {
    icon: Palette,
    title: "Style Presets",
    description:
      "Choose from curated anime styles — classic cel-shaded, modern, watercolor, cyberpunk, Ghibli-inspired, and more.",
    accent: "cyan",
  },
  {
    icon: Image,
    title: "High-Resolution Output",
    description:
      "Export your creations in up to 4K resolution. Perfect for wallpapers, prints, merchandise, and digital art portfolios.",
    accent: "gold",
  },
  {
    icon: Store,
    title: "Marketplace",
    description:
      "Buy and sell AI-generated anime art. Set your own prices and earn royalties every time your art is licensed.",
    accent: "cyan",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate artwork in seconds with our optimized inference pipeline. No more waiting hours for renders.",
    accent: "gold",
  },
  {
    icon: Shield,
    title: "Safe & Private",
    description:
      "Your prompts and creations are private by default. Enterprise-grade encryption and optional anonymous mode.",
    accent: "cyan",
  },
];

const tierEntries = Object.values(TIERS);

const howItWorks = [
  {
    step: "01",
    title: "Describe Your Vision",
    desc: "Write a prompt or pick a style preset. AI anime generation starts in seconds.",
    icon: PenLine,
  },
  {
    step: "02",
    title: "AI Creates Your Art",
    desc: "Our models render your anime artwork in stunning detail — from character portraits to full scenes.",
    icon: Sparkles,
  },
  {
    step: "03",
    title: "Share & Earn",
    desc: "Publish to the gallery, sell in the marketplace, or share with your community.",
    icon: Share2,
  },
];

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ─── HERO SECTION ─── */}
        <section className="relative overflow-hidden pt-28 pb-20 sm:pt-36 sm:pb-28">
          {/* Starfield + grid background */}
          <div className="pointer-events-none absolute inset-0 bg-starfield" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

          {/* Glow orbs */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-gold-400/10 via-transparent to-transparent blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-40 w-[400px] h-[400px] bg-gradient-to-bl from-cyan-400/10 to-transparent blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mx-auto max-w-4xl text-center"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="flex justify-center"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-stroke-gold bg-[rgba(243,198,105,0.08)] px-4 py-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-gold-400" />
                  <span className="sys-label-gold text-[11px]">NOW IN OPEN BETA // v2.4</span>
                </div>
              </motion.div>

              {/* Hero heading */}
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="text-white">Where AI Meets</span>
                <br />
                <span className="bg-gradient-to-r from-gold-300 via-gold-400 to-cyan-400 bg-clip-text text-transparent">
                  Anime Art
                </span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-white/50 sm:text-xl max-w-2xl mx-auto">
                {APP_NAME} is the creative platform for generating, sharing, and
                discovering AI-powered anime artwork. No prompts? No problem.
              </p>

              {/* CTA Buttons */}
              <motion.div
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Link href="/register">
                  <Button size="lg" variant="primary" className="gap-2 text-base glow-gold">
                    <Sparkles className="h-5 w-5" />
                    Start Creating Free
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="gap-2 text-base">
                    See Features
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>

              <motion.p
                className="mt-6 sys-label"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                FREE PLAN: 10 GENERATIONS/MONTH // NO CREDIT CARD REQUIRED
              </motion.p>
            </motion.div>

            {/* Hero mockup — Game UI style panel */}
            <motion.div
              className="relative mx-auto mt-16 max-w-5xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="glass rounded-xl overflow-hidden cut-corner">
                {/* Terminal-style header */}
                <div className="flex items-center gap-2 border-b border-stroke-white px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500 shadow-[0_0_6px_rgba(234,179,8,0.5)]" />
                    <div className="h-3 w-3 rounded-full bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]" />
                  </div>
                  <div className="ml-4 flex gap-1 sys-label">
                    <span className="rounded bg-glass-300 px-2 py-0.5 text-gold-400">aniverse</span>
                    <span className="text-white/20">/</span>
                    <span className="text-white/40">create</span>
                  </div>
                  <span className="ml-auto sys-label text-white/15">NODE//01</span>
                </div>

                {/* Mockup content */}
                <div className="p-6 sm:p-10">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="glass rounded-lg p-6 aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <Palette className="mx-auto h-12 w-12 text-gold-400/60" />
                        <p className="mt-3 text-sm text-white/40 sys-label">
                          &ldquo;samurai neon city, cyberpunk anime&rdquo;
                        </p>
                        <Badge variant="default" className="mt-4">PROMPT // ACTIVE</Badge>
                      </div>
                    </div>
                    <div className="glass rounded-lg p-6 aspect-square flex items-center justify-center relative">
                      <div className="text-center">
                        <Image className="mx-auto h-12 w-12 text-cyan-400/60" />
                        <p className="mt-3 text-sm text-white/40">
                          Your creation appears here
                        </p>
                      </div>
                      {/* Corner accent decorative */}
                      <span className="absolute top-2 right-2 h-4 w-4 border-t border-r border-stroke-cyan pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── TRENDING STYLES ─── */}
        <section className="relative py-16 sm:py-20">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-glass-200 to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div {...fadeInUp}>
              <div className="flex items-center gap-3 mb-8">
                <TrendingUp className="h-5 w-5 text-gold-400" />
                <h2 className="text-xl font-bold tracking-tight text-white">
                  Trending Styles
                </h2>
                <span className="sys-label-gold">LIVE // 2026</span>
              </div>
              <TrendingPalettes />
            </motion.div>
          </div>
        </section>

        {/* ─── FEATURES SECTION ─── */}
        <section id="features" className="relative py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-starfield opacity-30" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              {...fadeInUp}
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1">
                FEATURES // SYSTEM
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Everything you need to create
              </h2>
              <p className="mt-4 text-lg text-white/50">
                Powerful AI tools designed for artists, creators, and anime
                enthusiasts.
              </p>
            </motion.div>

            <motion.div
              className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
              {...stagger}
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                const isGold = feature.accent === "gold";
                return (
                  <motion.div
                    key={feature.title}
                    variants={{
                      initial: { opacity: 0, y: 24 },
                      whileInView: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="group h-full cut-corner energy-sweep relative">
                      <CardContent className="p-6">
                        <div
                          className={cn(
                            "mb-4 flex h-12 w-12 items-center justify-center rounded-lg border",
                            isGold
                              ? "border-stroke-gold bg-[rgba(243,198,105,0.1)]"
                              : "border-stroke-cyan bg-[rgba(62,230,196,0.1)]",
                          )}
                        >
                          <Icon className={cn(
                            "h-6 w-6",
                            isGold ? "text-gold-400" : "text-cyan-400",
                          )} />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-white/40">
                          {feature.description}
                        </p>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ─── HOW IT WORKS ─── */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-cyan-400/5 via-transparent to-gold-400/5" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
              <Badge variant="primary" className="mb-4 px-3 py-1">
                <MousePointerClick className="mr-1.5 h-3.5 w-3.5" />
                HOW IT WORKS // PROTOCOL
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Create in three simple steps
              </h2>
              <p className="mt-4 text-lg text-white/50">
                From prompt to masterpiece in minutes. AI handles the hard part.
              </p>
            </motion.div>

            <div className="mt-14 grid gap-6 sm:grid-cols-3">
              {howItWorks.map((step, i) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.15, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="relative text-center"
                  >
                    {/* Step connector line */}
                    {i < howItWorks.length - 1 && (
                      <div className="hidden sm:block absolute top-12 left-[60%] w-[80%] h-[1px] bg-gradient-to-r from-stroke-gold to-transparent" />
                    )}

                    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border-2 border-stroke-gold bg-[rgba(243,198,105,0.06)] mb-6">
                      <Icon className="h-10 w-10 text-gold-400" />
                    </div>

                    <span className="sys-label-gold block mb-2">
                      STEP {step.step} // {(i + 1).toString().padStart(2, "0")}
                    </span>
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-white/40 max-w-xs mx-auto">
                      {step.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── PRICING SECTION ─── */}
        <section id="pricing" className="relative py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-starfield opacity-20" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
              <Badge variant="default" className="mb-4 px-3 py-1">
                <Star className="mr-1.5 h-3.5 w-3.5" />
                PRICING // TIER
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Choose your plan
              </h2>
              <p className="mt-4 text-lg text-white/50">
                Start free, upgrade when you need more power.
              </p>
            </motion.div>

            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-3 max-w-5xl mx-auto"
              {...stagger}
            >
              {tierEntries.map((tier) => (
                <motion.div
                  key={tier.id}
                  variants={{
                    initial: { opacity: 0, y: 24 },
                    whileInView: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <Card className={cn(
                    "relative h-full cut-corner",
                    tier.popular && "border-stroke-gold glow-gold",
                  )}>
                    {tier.popular && (
                      <>
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                          <Badge variant="default" className="px-3 py-1 text-xs">
                            MOST POPULAR
                          </Badge>
                        </div>
                        <span className="absolute top-2 right-2 h-3 w-3 border-t border-r border-stroke-gold pointer-events-none" />
                        <span className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-stroke-gold pointer-events-none" />
                      </>
                    )}
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="mb-2">
                        <span className="sys-label">{tier.id?.toUpperCase() || "FREE"} // TIER</span>
                      </div>
                      <h3 className="text-xl font-bold text-white">{tier.name}</h3>
                      <div className="mt-3 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-white">
                          {tier.price === 0 ? "Free" : `$${tier.price}`}
                        </span>
                        {tier.price > 0 && (
                          <span className="text-sm text-white/40">/month</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-white/40">
                        {tier.credits === "Unlimited"
                          ? "Unlimited generations"
                          : `${tier.credits} generations/month`}
                      </p>
                      <ul className="mt-6 space-y-3 flex-1">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-white/60">
                            <span className="mt-0.5 h-1.5 w-1.5 rounded-full bg-gold-400 shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>
                      <Button
                        variant={tier.popular ? "primary" : "outline"}
                        className="mt-6 w-full gap-2"
                      >
                        {tier.price === 0 ? "Get Started Free" : "Subscribe"}
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── CTA FINAL ─── */}
        <section className="relative py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-10" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-b from-gold-400/10 via-cyan-400/5 to-transparent blur-3xl" />

          <motion.div
            className="relative mx-auto max-w-3xl text-center px-4"
            {...fadeInUp}
          >
            <div className="glass rounded-xl p-10 sm:p-14 cut-corner">
              <Badge variant="default" className="mb-4 px-3 py-1">
                <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                GET STARTED // NODE
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to create your masterpiece?
              </h2>
              <p className="mt-4 text-lg text-white/50 max-w-xl mx-auto">
                Join thousands of creators already generating stunning anime art
                with AI. No credit card required.
              </p>
              <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/register">
                  <Button size="lg" variant="primary" className="gap-2 text-base glow-gold">
                    <Sparkles className="h-5 w-5" />
                    Start Creating Free
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="gap-2 text-base">
                    Learn More
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
