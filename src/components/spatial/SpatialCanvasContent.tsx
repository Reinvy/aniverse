"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useIsMobile } from "@/lib/use-mobile";
import { useSpatial } from "@/lib/spatial-store";
import { TIERS, TRENDING_STYLES, APP_NAME } from "@/lib/constants";
import {
  Sparkles, Image as ImageIcon, Wand2, Store, Palette, Zap, Shield,
  ChevronRight, TrendingUp,
  Users, Clock, Activity, Search, Check, Layers,
  Globe, Star, BookOpen, Trophy, UserRound, ExternalLink,
} from "lucide-react";

// ─── Shared animation variants ─────────────────────────────────

const EASE_PREMIUM: [number, number, number, number] = [0.19, 1, 0.22, 1];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
  exit: { opacity: 0, transition: { duration: 0.25 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_PREMIUM } },
};

const cardHover = "transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.1]";

// ─── Features Data ─────────────────────────────────────────────

const features = [
  { icon: Wand2, title: "AI-Powered Generation", desc: "Create stunning anime artwork from text prompts using state-of-the-art AI models.", stat: "Speed: 2.4s avg", accent: "gold" },
  { icon: Palette, title: "Style Presets", desc: "16 curated anime styles — cel-shaded, watercolor, cyberpunk, Ghibli, and more.", stat: "16 styles", accent: "cyan" },
  { icon: ImageIcon, title: "4K Resolution Output", desc: "Export creations up to 4K resolution. Perfect for prints, merch, and portfolios.", stat: "Up to 4096×4096", accent: "gold" },
  { icon: Store, title: "Marketplace", desc: "Buy and sell AI-generated anime art. Set your prices, earn royalties on every license.", stat: "2,450+ listings", accent: "cyan" },
  { icon: Zap, title: "Lightning Fast", desc: "Generate in seconds with optimized inference. No more waiting hours for renders.", stat: "300ms queue", accent: "gold" },
  { icon: Shield, title: "Safe & Private", desc: "Your prompts and creations are private by default. Enterprise-grade encryption.", stat: "AES-256", accent: "cyan" },
  { icon: Layers, title: "Batch Processing", desc: "Generate up to 50 artworks at once with batch mode. Perfect for series and storyboards.", stat: "50x parallel", accent: "gold" },
  { icon: Globe, title: "Community Hub", desc: "Connect with 12K+ creators. Share prompts, join challenges, and collaborate.", stat: "12,400 members", accent: "cyan" },
];

const tiers = Object.values(TIERS);

// ─── FAQ Data ──────────────────────────────────────────────────

const faqs = [
  { q: "What is AniVerse?", a: "AniVerse is an AI-powered creative platform for generating, sharing, and discovering anime-style artwork. It uses cutting-edge AI models to transform your ideas into stunning anime illustrations." },
  { q: "Is AniVerse free to use?", a: "Yes! AniVerse offers a free plan with 10 AI generations per month. Upgrading to Pro or Studio unlocks higher resolutions, more generations, and advanced features." },
  { q: "Can I sell the art I create?", a: "Yes. Pro and Studio plans include commercial and resale licenses. You can sell your creations on the AniVerse Marketplace or third-party platforms." },
  { q: "What style presets are available?", a: "There are 16 curated presets including Classic Anime, Modern Anime, Watercolor, Cyberpunk, Ghibli-inspired, Retro '90s, VHS Anime, Chibi, Pixel Anime, Vaporwave, and more." },
  { q: "How is my privacy protected?", a: "All prompts and creations are private by default. We use AES-256 encryption for data at rest and TLS 1.3 for transit. Anonymous mode is available on paid plans." },
  { q: "What is the Marketplace commission?", a: "AniVerse charges a 15% commission on marketplace sales. You keep 85% of every transaction. Payouts are processed monthly via Stripe." },
];

// ─── Counter Display ───────────────────────────────────────────

function StatCounter({ value, label, icon: Icon }: { value: string; label: string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-sm border border-white/[0.04] bg-white/[0.02]">
      <Icon className="h-3.5 w-3.5 text-[#E5C587]/60" />
      <div>
        <span className="text-sm font-bold text-white/90 tabular-nums">{value}</span>
        <span className="ml-1.5 text-[9px] font-mono tracking-wider text-white/25">{label}</span>
      </div>
    </div>
  );
}

// ─── ─── 1. HERO NODE ──────────────────────────────────────────

function HeroNode() {
  const { navigateTo } = useSpatial();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-5xl mx-auto text-center px-4 sm:px-6 pt-8 md:pt-0"
    >
      {/* Badge */}
      <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-4 md:mb-6">
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm border border-[rgba(229,197,135,0.15)] bg-[rgba(229,197,135,0.04)]">
          <Sparkles className="h-3 w-3 text-[#E5C587]" />
          <span className="text-[9px] md:text-[11px] font-mono tracking-widest text-[#E5C587]/70">
            NOW IN OPEN BETA // v2.4
          </span>
        </div>
        <span className="text-[8px] md:text-[10px] font-mono tracking-wider text-white/10 hidden md:inline">
          [SYS.00]
        </span>
      </motion.div>

      {/* Heading */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none"
      >
        <span className="text-white/90">Where AI Meets</span>
        <br />
        <span className="bg-gradient-to-r from-[#E5C587] via-[#F1F5F9] to-[#94A3B8] bg-clip-text text-transparent">
          Anime Art
        </span>
      </motion.h1>

      {/* Sub */}
      <motion.p
        variants={itemVariants}
        className="mt-3 md:mt-5 text-sm md:text-lg leading-relaxed text-white/40 max-w-2xl mx-auto font-light tracking-wide"
      >
        {APP_NAME} is the creative platform for generating, sharing, and
        discovering AI-powered anime artwork. No prompts? No problem.
      </motion.p>

      {/* CTA buttons */}
      <motion.div variants={itemVariants} className="mt-6 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
        <a
          href="/register"
          className="group relative inline-flex items-center gap-2 px-5 md:px-7 py-2.5 md:py-3 rounded-sm bg-[rgba(229,197,135,0.12)] border border-[rgba(229,197,135,0.3)] text-[#E5C587] hover:bg-[rgba(229,197,135,0.18)] transition-all duration-300 text-sm md:text-base font-semibold tracking-wider uppercase overflow-hidden"
        >
          <Sparkles className="h-4 w-4 md:h-5 md:w-5" />
          <span>Start Creating Free</span>
          {/* Sweep effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </a>
        <button
          onClick={() => navigateTo("features")}
          className="group inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 rounded-sm border border-white/10 text-white/40 hover:text-white/60 hover:border-white/20 transition-all duration-300 text-xs md:text-sm tracking-wider uppercase bg-black/30 backdrop-blur-sm"
        >
          See Features
          <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
        </button>
      </motion.div>

      {/* Live stats row */}
      <motion.div variants={itemVariants} className="mt-6 md:mt-10 flex flex-wrap items-center justify-center gap-2 md:gap-3">
        <StatCounter value="84,720" label="creations today" icon={Activity} />
        <StatCounter value="12.4K" label="active creators" icon={Users} />
        <StatCounter value="2.3s" label="avg generation" icon={Clock} />
      </motion.div>

      {/* Status line */}
      <motion.div
        variants={itemVariants}
        className="mt-4 md:mt-6 flex items-center justify-center gap-3 text-[8px] md:text-[10px] font-mono tracking-widest text-white/12"
      >
        <span>FREE PLAN: 10 GENERATIONS/MONTH</span>
        <span className="w-px h-3 bg-white/10" />
        <span>NO CREDIT CARD REQUIRED</span>
        <span className="w-px h-3 bg-white/10 hidden sm:inline" />
        <span className="hidden sm:inline">UP TO 4K EXPORT</span>
      </motion.div>
    </motion.div>
  );
}

// ─── ─── 2. FEATURES NODE ──────────────────────────────────────

function FeaturesNode() {
  const isMobile = useIsMobile();
  const gridCols = isMobile ? "grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-6 md:mb-10">
        <span className="text-[8px] md:text-[10px] font-mono tracking-widest text-white/20">
          FEATURES // 特徴
        </span>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mt-1 md:mt-2">
          Everything you need to create
        </h2>
        <p className="mt-2 text-sm md:text-base text-white/35 max-w-xl mx-auto">
          Powerful AI tools designed for artists, creators, and anime enthusiasts.
        </p>
      </motion.div>

      {/* Feature grid */}
      <motion.div variants={itemVariants} className={`grid ${gridCols} gap-2.5 md:gap-3`}>
        {features.map((f, i) => {
          const Icon = f.icon;
          const isGold = f.accent === "gold";
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.04, duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className={`group p-3.5 md:p-4 rounded-sm border border-white/[0.04] bg-white/[0.015] ${cardHover} relative overflow-hidden`}
            >
              {/* Energy sweep on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

              <div className="flex items-start justify-between">
                <div className={`flex h-8 w-8 md:h-10 md:w-10 items-center justify-center rounded-sm border text-sm ${
                  isGold ? "border-[rgba(229,197,135,0.2)] text-[#E5C587]" : "border-[rgba(45,212,191,0.2)] text-[#2DD4BF]"
                }`}>
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </div>
                {/* Stat badge */}
                {f.stat && (
                  <span className={`text-[7px] md:text-[8px] font-mono tracking-wider px-1.5 py-0.5 rounded-sm border ${
                    isGold ? "border-[rgba(229,197,135,0.1)] text-[#E5C587]/50" : "border-[rgba(45,212,191,0.1)] text-[#2DD4BF]/50"
                  }`}>
                    {f.stat}
                  </span>
                )}
              </div>
              <h3 className="mt-2.5 text-xs md:text-sm font-semibold text-white/85">{f.title}</h3>
              <p className="mt-1 text-[10px] md:text-xs leading-relaxed text-white/30">{f.desc}</p>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}

// ─── ─── 3. SHOWCASE NODE ──────────────────────────────────────

const showcaseItems = [
  { label: "samurai neon city", prompt: "cyberpunk anime, neon lights, katana, rain", likes: "1.2K" },
  { label: "spirit of the forest", prompt: "ghibli-inspired, glowing spirits, moss", likes: "982" },
  { label: "starlight dancer", prompt: "magical girl, starry sky, flowing ribbons", likes: "2.1K" },
  { label: "mechanized dreams", prompt: "mecha anime, cybernetic, sunset", likes: "745" },
];

function ShowcaseNode() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-6 md:mb-10">
        <span className="text-[8px] md:text-[10px] font-mono tracking-widest text-white/20">
          SHOWCASE // ショーケース
        </span>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mt-1 md:mt-2">
          From prompt to masterpiece
        </h2>
        <p className="mt-2 text-sm md:text-base text-white/35 max-w-xl mx-auto">
          See what our AI can create. Each piece generated in seconds.
        </p>
      </motion.div>

      {/* Gallery grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3 max-w-4xl mx-auto">
        {showcaseItems.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
            className={`group relative aspect-[3/4] rounded-sm border border-white/[0.04] bg-white/[0.015] overflow-hidden ${cardHover}`}
          >
            {/* Placeholder artwork area */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-3">
                <ImageIcon className="mx-auto h-6 w-6 md:h-8 md:w-8 text-white/10" />
                <p className="mt-1.5 text-[8px] md:text-[10px] text-white/20 font-mono tracking-wide leading-tight">{item.label}</p>
                <p className="text-[7px] md:text-[8px] text-white/12 font-mono mt-0.5">{item.prompt}</p>
              </div>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex items-end p-2.5 md:p-3">
              <div className="flex items-center gap-1.5 text-[10px] text-white/60">
                <Star className="h-3 w-3 text-[#E5C587]" />
                {item.likes}
              </div>
            </div>
            {/* Gold accent corner */}
            <div className="absolute top-0 right-0 w-4 h-4 md:w-6 md:h-6 border-t-2 border-r-2 border-[rgba(229,197,135,0.08)] group-hover:border-[rgba(229,197,135,0.25)] transition-colors duration-400" />
          </motion.div>
        ))}
      </motion.div>

      {/* Trending Styles */}
      <motion.div variants={itemVariants} className="mt-6 md:mt-10 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <TrendingUp className="h-3 w-3 md:h-3.5 md:w-3.5 text-[#E5C587]/50" />
          <span className="text-[9px] md:text-[11px] font-mono tracking-widest text-white/25">TRENDING STYLES</span>
        </div>
        <div className="flex flex-wrap gap-1.5 md:gap-2">
          {TRENDING_STYLES.slice(0, 6).map((style) => (
            <span
              key={style.id}
              className="px-2 md:px-3 py-1 md:py-1.5 text-[8px] md:text-[10px] font-mono tracking-wider rounded-sm border border-white/[0.06] bg-white/[0.02] text-white/25 hover:text-white/50 hover:border-white/[0.12] transition-all duration-300 cursor-default"
            >
              {style.label}
              {style.badge && (
                <span className="ml-1.5 text-[7px] px-1 py-0.5 rounded-sm bg-[rgba(229,197,135,0.1)] text-[#E5C587]/60">
                  {style.badge}
                </span>
              )}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── ─── 4. PRICING NODE ───────────────────────────────────────

function PricingNode() {
  const [annual, setAnnual] = useState(false);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-6 md:mb-10">
        <span className="text-[8px] md:text-[10px] font-mono tracking-widest text-white/20">
          SUPPLY PASS // 供給パス
        </span>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mt-1 md:mt-2">
          Choose your plan
        </h2>
        <p className="mt-2 text-sm md:text-base text-white/35 max-w-xl mx-auto">
          Start free, upgrade when you need more power.
        </p>
      </motion.div>

      {/* Toggle */}
      <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 mb-8">
        <span className={`text-[10px] md:text-xs font-mono tracking-wider ${!annual ? "text-white/60" : "text-white/25"}`}>MONTHLY</span>
        <button
          onClick={() => setAnnual(!annual)}
          className={`relative w-12 h-6 rounded-sm border transition-all duration-300 ${
            annual ? "border-[rgba(229,197,135,0.3)] bg-[rgba(229,197,135,0.08)]" : "border-white/10 bg-white/[0.04]"
          }`}
          aria-label="Toggle annual pricing"
        >
          <span
            className={`absolute top-0.5 w-5 h-5 rounded-sm transition-all duration-300 ${
              annual ? "left-[calc(100%-22px)] bg-[#E5C587]" : "left-0.5 bg-white/30"
            }`}
          />
        </button>
        <span className={`text-[10px] md:text-xs font-mono tracking-wider ${annual ? "text-white/60" : "text-white/25"}`}>
          ANNUAL
          <span className="ml-1 text-[#E5C587]/60">(Save 20%)</span>
        </span>
      </motion.div>

      {/* Tier cards */}
      <motion.div variants={itemVariants} className="grid gap-3 md:gap-4 sm:grid-cols-3 max-w-5xl mx-auto">
        {tiers.map((tier, i) => {
          const price = annual && tier.price > 0
            ? Math.round(tier.price * 12 * 0.8 / 12 * 100) / 100
            : tier.price;
          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 + i * 0.08, duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
              className={`relative p-4 md:p-6 rounded-sm border transition-all duration-500 ${
                tier.popular
                  ? "border-[rgba(229,197,135,0.2)] bg-[rgba(229,197,135,0.03)] shadow-[0_0_30px_rgba(229,197,135,0.05)]"
                  : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[rgba(229,197,135,0.1)] border border-[rgba(229,197,135,0.25)] rounded-sm">
                  <span className="text-[7px] md:text-[9px] font-mono tracking-widest text-[#E5C587]/70">MOST POPULAR</span>
                </div>
              )}
              <span className="text-[8px] md:text-[10px] font-mono tracking-widest text-white/20">{tier.id?.toUpperCase()}{" //"} TIER</span>
              <h3 className="text-lg md:text-xl font-bold text-white mt-1">{tier.name}</h3>
              <div className="mt-2 md:mt-3 flex items-baseline gap-1">
                <span className="text-2xl md:text-3xl font-bold text-white/90">
                  {price === 0 ? "Free" : `$${price}`}
                </span>
                {price > 0 && <span className="text-[10px] md:text-xs text-white/30">/month</span>}
              </div>
              <p className="mt-0.5 text-[10px] md:text-xs text-white/25 font-mono tracking-wide">
                {tier.credits === "Unlimited" ? "Unlimited generations" : `${tier.credits} generations/mo`}
              </p>
              <ul className="mt-4 md:mt-5 space-y-2">
                {tier.features.map((f: string) => (
                  <li key={f} className="flex items-start gap-1.5 md:gap-2 text-[10px] md:text-xs text-white/35">
                    <Check className="mt-0.5 h-3 w-3 flex-shrink-0 text-[#E5C587]/50" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-4 md:mt-6 w-full py-2 md:py-2.5 text-[10px] md:text-xs font-semibold tracking-wider uppercase rounded-sm transition-all duration-300 ${
                  tier.popular
                    ? "bg-[rgba(229,197,135,0.12)] border border-[rgba(229,197,135,0.25)] text-[#E5C587] hover:bg-[rgba(229,197,135,0.18)]"
                    : "border border-white/10 text-white/40 hover:text-white/60 hover:border-white/20"
                }`}
              >
                {price === 0 ? "Get Started Free" : "Subscribe"}
              </button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Social proof */}
      <motion.div variants={itemVariants} className="mt-6 text-center">
        <p className="text-[9px] md:text-[11px] font-mono tracking-wider text-white/15">
          JOIN <span className="text-white/30">12,400+</span> CREATORS ALREADY BUILDING WITH ANIVERSE
        </p>
      </motion.div>
    </motion.div>
  );
}

// ─── ─── 5. FAQ / ABOUT NODE ───────────────────────────────────

function FAQNode() {
  const [search, setSearch] = useState("");
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const filtered = faqs.filter(
    (f) => f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center mb-6">
        <span className="text-[8px] md:text-[10px] font-mono tracking-widest text-white/20">
          FAQ // 概要
        </span>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight text-white mt-1 md:mt-2">
          Questions? We&apos;ve got answers
        </h2>
        <p className="mt-2 text-sm md:text-base text-white/35">
          Everything you need to know about {APP_NAME}.
        </p>
      </motion.div>

      {/* Search terminal */}
      <motion.div variants={itemVariants} className="mb-4 md:mb-6">
        <div className="flex items-center gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-sm border border-white/[0.06] bg-white/[0.02] focus-within:border-[rgba(229,197,135,0.2)] focus-within:bg-white/[0.04] transition-all duration-300">
          <Search className="h-3.5 w-3.5 md:h-4 md:w-4 text-white/20" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search FAQ..."
            className="flex-1 bg-transparent outline-none text-[11px] md:text-sm text-white/60 placeholder:text-white/15 font-mono tracking-wide"
          />
          <span className="text-[7px] md:text-[9px] font-mono tracking-wider text-white/15">[?]</span>
        </div>
      </motion.div>

      {/* FAQ accordion */}
      <motion.div variants={itemVariants} className="space-y-1.5 md:space-y-2">
        {filtered.map((faq, idx) => (
          <motion.div
            key={faq.q}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05, duration: 0.3 }}
            className={`rounded-sm border transition-all duration-300 ${
              openIdx === idx
                ? "border-[rgba(229,197,135,0.15)] bg-[rgba(229,197,135,0.03)]"
                : "border-white/[0.05] bg-white/[0.015] hover:border-white/[0.1]"
            }`}
          >
            <button
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full flex items-center justify-between px-3 py-2.5 md:px-4 md:py-3 text-left"
            >
              <span className="text-[11px] md:text-sm font-medium text-white/70 tracking-wide pr-2">{faq.q}</span>
              <span className={`flex-shrink-0 w-4 h-4 md:w-5 md:h-5 flex items-center justify-center rounded-sm border transition-all duration-300 ${
                openIdx === idx ? "border-[rgba(229,197,135,0.3)] bg-[rgba(229,197,135,0.08)] text-[#E5C587]" : "border-white/10 text-white/20"
              }`}>
                <span className={`text-[10px] md:text-xs transition-transform duration-300 ${openIdx === idx ? "rotate-45" : ""}`}>+</span>
              </span>
            </button>
            {openIdx === idx && (
              <div className="px-3 md:px-4 pb-3 md:pb-4">
                <p className="text-[10px] md:text-sm text-white/35 leading-relaxed border-t border-white/[0.04] pt-2.5 md:pt-3">
                  {faq.a}
                </p>
              </div>
            )}
          </motion.div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-6 md:py-8">
            <p className="text-xs md:text-sm text-white/20 font-mono tracking-wide">
              No results found for &ldquo;{search}&rdquo;
            </p>
          </div>
        )}
      </motion.div>

      {/* Explore — discoverability links */}
      <motion.div variants={itemVariants} className="mt-8">
        <div className="flex items-center gap-2 mb-4">
          <ExternalLink className="h-3.5 w-3.5 text-[#E5C587]/50" />
          <span className="text-[9px] md:text-[11px] font-mono tracking-widest text-white/25">EXPLORE // QUICK LINKS</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 md:gap-3">
          {[
            { href: "/blog", icon: BookOpen, label: "Blog", desc: "News & guides" },
            { href: "/characters", icon: UserRound, label: "OC Characters", desc: "Browse the roster" },
            { href: "/challenges", icon: Trophy, label: "Challenges", desc: "Win coin rewards" },
            { href: "/dashboard/gallery", icon: ImageIcon, label: "Gallery", desc: "Community artwork" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="group flex flex-col items-start gap-1.5 p-3.5 md:p-4 rounded-sm border border-white/[0.05] bg-white/[0.015] hover:bg-white/[0.04] hover:border-[rgba(229,197,135,0.2)] transition-all duration-500 relative overflow-hidden"
              >
                <span className="absolute top-0 right-0 w-3 h-3 md:w-4 md:h-4 border-t border-r border-[rgba(229,197,135,0.1)] group-hover:border-[rgba(229,197,135,0.3)] transition-colors duration-500" />
                <Icon className="h-4 w-4 md:h-5 md:w-5 text-[#E5C587]/60 group-hover:text-[#E5C587] transition-colors duration-300" />
                <span className="text-[11px] md:text-sm font-semibold text-white/70 group-hover:text-white transition-colors duration-300">
                  {item.label}
                </span>
                <span className="text-[8px] md:text-[10px] font-mono tracking-wider text-white/25">{item.desc}</span>
              </a>
            );
          })}
        </div>
      </motion.div>

      {/* Footer */}
      <motion.div variants={itemVariants} className="mt-6 md:mt-8 flex items-center justify-center gap-4 md:gap-6 text-[8px] md:text-[10px] font-mono tracking-wider text-white/12">
        <span>&copy; 2026 ANIVERSE</span>
        <span className="w-px h-3 bg-white/10" />
        <Link href="/blog" className="hover:text-white/30 transition-colors">BLOG</Link>
        <span className="w-px h-3 bg-white/10" />
        <Link href="/challenges" className="hover:text-white/30 transition-colors">CHALLENGES</Link>
        <span className="w-px h-3 bg-white/10" />
        <Link href="/characters" className="hover:text-white/30 transition-colors">CHARACTERS</Link>
        <span className="w-px h-3 bg-white/10 hidden sm:inline" />
        <Link href="/register" className="hidden sm:inline hover:text-white/30 transition-colors">SIGN UP</Link>
      </motion.div>
    </motion.div>
  );
}

// ─── Export Map ─────────────────────────────────────────────────

export const SectionComponents: Record<string, React.FC> = {
  hero: HeroNode,
  features: FeaturesNode,
  showcase: ShowcaseNode,
  pricing: PricingNode,
  faq: FAQNode,
};
