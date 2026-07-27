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
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Palette,
    title: "Style Presets",
    description:
      "Choose from curated anime styles — classic cel-shaded, modern, watercolor, cyberpunk, Ghibli-inspired, and more.",
    gradient: "from-fuchsia-500 to-pink-600",
  },
  {
    icon: Image,
    title: "High-Resolution Output",
    description:
      "Export your creations in up to 4K resolution. Perfect for wallpapers, prints, merchandise, and digital art portfolios.",
    gradient: "from-blue-500 to-indigo-600",
  },
  {
    icon: Store,
    title: "Marketplace",
    description:
      "Buy and sell AI-generated anime art. Set your own prices and earn royalties every time your art is licensed.",
    gradient: "from-amber-500 to-orange-600",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description:
      "Generate artwork in seconds with our optimized inference pipeline. No more waiting hours for renders.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Shield,
    title: "Safe & Private",
    description:
      "Your prompts and creations are private by default. Enterprise-grade encryption and optional anonymous mode.",
    gradient: "from-rose-500 to-red-600",
  },
];

const tierEntries = Object.values(TIERS);

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        {/* ─── Hero Section ─── */}
        <section className="relative overflow-hidden pt-24 pb-20 sm:pt-32 sm:pb-28">
          {/* Background effects */}
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-violet-600/15 via-fuchsia-600/10 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute right-0 top-40 w-[400px] h-[400px] bg-gradient-to-bl from-fuchsia-600/10 to-transparent blur-3xl" />
          <div className="pointer-events-none absolute left-0 top-60 w-[300px] h-[300px] bg-gradient-to-tr from-violet-600/10 to-transparent blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mx-auto max-w-3xl text-center"
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <Badge variant="default" className="mb-6 px-4 py-1.5 text-sm">
                  <Sparkles className="mr-1.5 h-3.5 w-3.5" />
                  Now in Open Beta
                </Badge>
              </motion.div>

              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                <span className="text-white">Where AI Meets</span>
                <br />
                <span className="gradient-text">Anime Art</span>
              </h1>

              <p className="mt-6 text-lg leading-8 text-zinc-400 sm:text-xl max-w-2xl mx-auto">
                {APP_NAME} is the creative platform for generating, sharing, and
                discovering AI-powered anime artwork. No prompts? No problem.
              </p>

              <motion.div
                className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.4 }}
              >
                <Link href="/register">
                  <Button size="lg" className="gap-2 text-base shadow-xl shadow-violet-600/25">
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
                className="mt-6 text-sm text-zinc-600"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                Free plan includes 10 generations/month &middot; No credit card required
              </motion.p>
            </motion.div>

            {/* Hero mockup */}
            <motion.div
              className="relative mx-auto mt-16 max-w-5xl"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-900 to-zinc-950 shadow-2xl shadow-violet-600/10">
                <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3">
                  <div className="flex gap-1.5">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <div className="ml-4 flex gap-1 text-xs text-zinc-600">
                    <span className="rounded bg-zinc-800 px-2 py-0.5">aniverse</span>
                    <span className="text-zinc-700">/</span>
                    <span className="text-zinc-400">create</span>
                  </div>
                </div>
                <div className="p-6 sm:p-10">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl bg-zinc-800/50 p-4 aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <Palette className="mx-auto h-12 w-12 text-violet-400" />
                        <p className="mt-3 text-sm text-zinc-500">
                          &ldquo;samurai neon city, cyberpunk anime&rdquo;
                        </p>
                      </div>
                    </div>
                    <div className="rounded-xl bg-zinc-800/50 p-4 aspect-square flex items-center justify-center">
                      <div className="text-center">
                        <Image className="mx-auto h-12 w-12 text-fuchsia-400" />
                        <p className="mt-3 text-sm text-zinc-500">
                          Your creation appears here
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ─── Features Section ─── */}
        <section id="features" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              {...fadeInUp}
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1">
                Features
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Everything you need to create
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Powerful AI tools designed for artists, creators, and anime
                enthusiasts.
              </p>
            </motion.div>

            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              {...stagger}
            >
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.title}
                    variants={{
                      initial: { opacity: 0, y: 24 },
                      whileInView: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="group h-full border-zinc-800/60 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-violet-600/5">
                      <CardContent className="p-6">
                        <div
                          className={cn(
                            "mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-lg",
                            feature.gradient,
                          )}
                        >
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {feature.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
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

        {/* ─── How It Works Section ─── */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-emerald-600/5 via-transparent to-violet-600/5" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
              <Badge variant="secondary" className="mb-4 px-3 py-1">
                <MousePointerClick className="mr-1.5 h-3.5 w-3.5" />
                How It Works
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Create in three simple steps
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                No complex software needed. Just your imagination and a few clicks.
              </p>
            </motion.div>

            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-3"
              {...stagger}
            >
              {[
                {
                  step: "01",
                  icon: Palette,
                  title: "Choose Your Style",
                  description:
                    "Browse our curated collection of trending anime styles — from Ghibli-inspired warmth to cyberpunk neon, retro 90s, and viral AI caricature.",
                  gradient: "from-violet-500 to-purple-600",
                },
                {
                  step: "02",
                  icon: PenLine,
                  title: "Describe Your Vision",
                  description:
                    "Write a text prompt or use our quick-suggestion templates. Our AI understands anime art terminology — character archetypes, color palettes, and scene composition.",
                  gradient: "from-fuchsia-500 to-pink-600",
                },
                {
                  step: "03",
                  icon: Share2,
                  title: "Generate & Share",
                  description:
                    "Get your artwork in seconds at up to 4K resolution. Share with the community, sell in the marketplace, or export for your next creative project.",
                  gradient: "from-emerald-500 to-teal-600",
                },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    variants={{
                      initial: { opacity: 0, y: 24 },
                      whileInView: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4 }}
                    className="group relative"
                  >
                    <Card className="h-full border-zinc-800/60 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-violet-600/5">
                      <CardContent className="p-6 text-center">
                        <div className="mb-2 text-4xl font-bold text-zinc-800 select-none">
                          {item.step}
                        </div>
                        <div
                          className={cn(
                            "mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-300 group-hover:scale-110",
                            item.gradient,
                          )}
                        >
                          <ItemIcon className="h-7 w-7 text-white" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                    {/* Connector arrow (hidden on mobile) */}
                    {item.step !== "03" && (
                      <div className="absolute -right-3 top-1/2 hidden -translate-y-1/2 text-zinc-700 sm:block">
                        <ChevronRight className="h-6 w-6" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* ─── Trending Styles Section (from Market Research) ─── */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-violet-600/5 via-transparent to-fuchsia-600/5" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
              <Badge variant="secondary" className="mb-4 px-3 py-1">
                <TrendingUp className="mr-1.5 h-3.5 w-3.5" />
                Trending Now
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Anime Art Styles in Demand
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Our AI is trained on the latest trends. Here&rsquo;s what&rsquo;s
                taking over the anime art world right now.
              </p>
            </motion.div>

            <motion.div
              className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
              {...stagger}
            >
              {TRENDING_STYLES.map((style) => (
                <motion.div
                  key={style.id}
                  variants={{
                    initial: { opacity: 0, y: 24 },
                    whileInView: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.4 }}
                  className="group relative"
                >
                  <Card className="h-full overflow-hidden border-zinc-800/60 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-violet-600/5">
                    {/* Gradient header bar */}
                    <div
                      className={cn(
                        "h-2 w-full bg-gradient-to-r",
                        style.gradient,
                      )}
                    />
                    <CardContent className="p-5">
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-white">
                          {style.label}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] uppercase tracking-wider",
                            style.badge === "HOT" &&
                              "border-rose-700/50 text-rose-400",
                            style.badge === "TRENDING" &&
                              "border-emerald-700/50 text-emerald-400",
                            style.badge === "NEW" &&
                              "border-amber-700/50 text-amber-400",
                          )}
                        >
                          {style.badge}
                        </Badge>
                      </div>
                      <p className="text-sm leading-relaxed text-zinc-400">
                        {style.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            <motion.div className="mt-10 text-center" {...fadeInUp}>
              <Link href="/dashboard/create">
                <Button variant="outline" size="lg" className="gap-2">
                  Try These Styles
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>

        <TrendingPalettes />

        {/* ─── Stats Section ─── */}
        <section className="border-y border-zinc-800/60 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {[
                { label: "Artworks Generated", value: "2.4M+", icon: Image },
                { label: "Active Creators", value: "48K+", icon: Users },
                { label: "Styles Available", value: "150+", icon: Palette },
                { label: "Avg. Rating", value: "4.9★", icon: Star },
              ].map((stat) => {
                const StatIcon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    className="text-center"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                  >
                    <StatIcon className="mx-auto h-6 w-6 text-violet-400" />
                    <p className="mt-3 text-2xl font-bold text-white sm:text-3xl">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ─── Pricing Section ─── */}
        <section id="pricing" className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              {...fadeInUp}
            >
              <Badge variant="secondary" className="mb-4 px-3 py-1">
                Pricing
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Simple, transparent pricing
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Start free, upgrade as you grow. All plans include access to our
                AI generation engine.
              </p>
            </motion.div>

            <motion.div
              className="mt-14 grid gap-8 lg:grid-cols-3"
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
                  className="relative"
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-1 text-xs font-semibold shadow-lg shadow-violet-600/30">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <Card
                    className={cn(
                      "relative h-full border-zinc-800/60 transition-all duration-300",
                      tier.popular
                        ? "border-violet-700/50 shadow-xl shadow-violet-600/10"
                        : "hover:border-zinc-700",
                    )}
                  >
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white">
                        {tier.name}
                      </h3>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-4xl font-extrabold text-white">
                          {tier.price === 0 ? "Free" : `$${tier.price}`}
                        </span>
                        {tier.price > 0 && (
                          <span className="text-sm text-zinc-500">/mo</span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-zinc-500">
                        {tier.credits} generations per month
                      </p>
                      <ul className="mt-6 space-y-3">
                        {tier.features.map((feature) => (
                          <li
                            key={feature}
                            className="flex items-start gap-2 text-sm text-zinc-300"
                          >
                            <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-violet-400" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={tier.price === 0 ? "/register" : "/register?plan=" + tier.id}
                        className="mt-8 block"
                      >
                        <Button
                          variant={tier.popular ? "default" : "outline"}
                          className="w-full gap-2"
                          size="lg"
                        >
                          {tier.price === 0 ? "Get Started Free" : "Subscribe"}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ─── CTA Section ─── */}
        <section className="relative overflow-hidden py-20 sm:py-28">
          <div className="pointer-events-none absolute inset-0 bg-grid-pattern" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-violet-600/20 via-fuchsia-600/20 to-violet-600/20 blur-3xl" />

          <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
            <motion.div {...fadeInUp}>
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to bring your anime characters to life?
              </h2>
              <p className="mt-4 text-lg text-zinc-400">
                Join thousands of creators already using {APP_NAME} to generate
                stunning anime artwork.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link href="/register">
                  <Button size="lg" className="gap-2 text-base shadow-xl shadow-violet-600/25">
                    <Sparkles className="h-5 w-5" />
                    Start Creating Free
                  </Button>
                </Link>
                <Link href="/gallery">
                  <Button variant="outline" size="lg" className="gap-2 text-base">
                    Browse Gallery
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
