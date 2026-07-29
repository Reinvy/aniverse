"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles, Image, Wand2, Store, Palette, Zap, Shield,
  ArrowRight, Star, ChevronRight, TrendingUp, PenLine, Share2, MousePointerClick,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { APP_NAME, TIERS, TRENDING_STYLES } from "@/lib/constants";
import { SpatialProvider, useSpatial } from "@/lib/spatial-store";
import { HUDSpatialNav } from "@/components/spatial/HUDSpatialNav";
import { ParticleBackground } from "@/components/spatial/ParticleBackground";
import Link from "next/link";

// ─── Section Data ──────────────────────────────────────────────

const features = [
  { icon: Wand2, title: "AI-Powered Generation", desc: "Create stunning anime artwork from text prompts using state-of-the-art AI models trained on millions of anime illustrations.", accent: "gold" },
  { icon: Palette, title: "Style Presets", desc: "Choose from curated anime styles — classic cel-shaded, modern, watercolor, cyberpunk, Ghibli-inspired, and more.", accent: "cyan" },
  { icon: Image, title: "High-Resolution Output", desc: "Export your creations in up to 4K resolution. Perfect for wallpapers, prints, merchandise, and digital art portfolios.", accent: "gold" },
  { icon: Store, title: "Marketplace", desc: "Buy and sell AI-generated anime art. Set your own prices and earn royalties every time your art is licensed.", accent: "cyan" },
  { icon: Zap, title: "Lightning Fast", desc: "Generate artwork in seconds with our optimized inference pipeline. No more waiting hours for renders.", accent: "gold" },
  { icon: Shield, title: "Safe & Private", desc: "Your prompts and creations are private by default. Enterprise-grade encryption and optional anonymous mode.", accent: "cyan" },
];

const tierEntries = Object.values(TIERS);

const howItWorks = [
  { step: "01", title: "Describe Your Vision", desc: "Write a prompt or pick a style preset. AI anime generation starts in seconds.", icon: PenLine },
  { step: "02", title: "AI Creates Your Art", desc: "Our models render your anime artwork in stunning detail — from character portraits to full scenes.", icon: Sparkles },
  { step: "03", title: "Share & Earn", desc: "Publish to the gallery, sell in the marketplace, or share with your community.", icon: Share2 },
];

// ─── Section Panel Wrapper ─────────────────────────────────────

function SectionPanel({ id, children, className = "" }: { id: string; children: React.ReactNode; className?: string }) {
  const { activeSection } = useSpatial();
  const isActive = activeSection === id;

  return (
    <div
      className={`
        absolute inset-0 flex items-center justify-center
        transition-all duration-700 pointer-events-none
        ${isActive ? "pointer-events-auto opacity-100" : "opacity-0"}
      `}
      style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}
    >
      <div className={`w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        {children}
      </div>
    </div>
  );
}

// ─── Main Spatial Scene ────────────────────────────────────────

function SpatialScene() {
  const { cameraStyle } = useSpatial();

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#05080F]">
      {/* Particles */}
      <ParticleBackground />

      {/* Camera layer — moves between sections */}
      <div className="absolute inset-0" style={cameraStyle}>
        {/* Grid overlay */}
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-[0.03]" />

        {/* Hero Section */}
        <SectionPanel id="hero" className="text-center">
          <HeroContent />
        </SectionPanel>

        {/* Features Section */}
        <SectionPanel id="features">
          <FeaturesContent />
        </SectionPanel>

        {/* Showcase Section */}
        <SectionPanel id="showcase">
          <ShowcaseContent />
        </SectionPanel>

        {/* Pricing Section */}
        <SectionPanel id="pricing">
          <PricingContent />
        </SectionPanel>

        {/* Docs/About Section */}
        <SectionPanel id="docs">
          <DocsContent />
        </SectionPanel>
      </div>

      {/* HUD Navigation (always on top) */}
      <HUDSpatialNav />
    </div>
  );
}

// ─── Hero Content ───────────────────────────────────────────────

function HeroContent() {
  const s = useSpatial();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1], delay: 0.2 }}
      className="max-w-4xl mx-auto"
    >
      {/* Badge + sys tag */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm border border-[rgba(229,197,135,0.2)] bg-[rgba(229,197,135,0.04)]">
          <Sparkles className="h-3.5 w-3.5 text-[#E5C587]" />
          <span className="text-[11px] font-mono tracking-widest text-[#E5C587]/70">NOW IN OPEN BETA // v2.4</span>
        </div>
        <span className="text-[10px] font-mono tracking-wider text-white/15">[SYS.00]</span>
      </div>

      {/* Heading */}
      <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-none">
        <span className="text-white/90">Where AI Meets</span>
        <br />
        <span className="bg-gradient-to-r from-[#E5C587] via-[#F1F5F9] to-[#94A3B8] bg-clip-text text-transparent">
          Anime Art
        </span>
      </h1>

      <p className="mt-6 text-lg leading-relaxed text-white/40 sm:text-xl max-w-2xl mx-auto font-light tracking-wide">
        {APP_NAME} is the creative platform for generating, sharing, and
        discovering AI-powered anime artwork. No prompts? No problem.
      </p>

      {/* CTAs */}
      <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
        <Link href="/register">
          <Button size="lg" variant="primary" className="gap-2 text-base">
            <Sparkles className="h-5 w-5" />
            Start Creating Free
          </Button>
        </Link>
        <button
          onClick={() => s.navigateTo("features")}
          className="group inline-flex items-center gap-2 px-6 py-3 rounded-sm border border-white/10 text-white/50 hover:text-white/70 hover:border-white/20 transition-all duration-300 text-sm tracking-wider uppercase bg-black/20 backdrop-blur-sm"
        >
          See Features
          <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* Status line */}
      <div className="mt-8 flex items-center justify-center gap-4 text-[10px] font-mono tracking-widest text-white/15">
        <span>FREE PLAN: 10 GENERATIONS/MONTH</span>
        <span className="w-px h-3 bg-white/10" />
        <span>NO CREDIT CARD REQUIRED</span>
      </div>
    </motion.div>
  );
}

// ─── Features Content ───────────────────────────────────────────

function FeaturesContent() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="text-center mb-12"
      >
        <span className="text-[10px] font-mono tracking-widest text-white/20">FEATURES // 特徴</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
          Everything you need to create
        </h2>
        <p className="mt-3 text-white/40 max-w-xl mx-auto">
          Powerful AI tools designed for artists, creators, and anime enthusiasts.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => {
          const Icon = f.icon;
          const isGold = f.accent === "gold";
          return (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
              className="group p-5 rounded-sm border border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08] transition-all duration-500"
            >
              <div className={`flex h-10 w-10 items-center justify-center rounded-sm border text-sm mb-3 ${
                isGold ? "border-[rgba(229,197,135,0.2)] text-[#E5C587]" : "border-[rgba(45,212,191,0.2)] text-[#2DD4BF]"
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-white/90">{f.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-white/35">{f.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Showcase Content ───────────────────────────────────────────

function ShowcaseContent() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="text-center mb-12"
      >
        <span className="text-[10px] font-mono tracking-widest text-white/20">SHOWCASE // ショーケース</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
          From prompt to masterpiece
        </h2>
        <p className="mt-3 text-white/40 max-w-xl mx-auto">
          See what our AI can do. Each piece generated in seconds.
        </p>
      </motion.div>

      {/* Terminal-style preview */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="max-w-3xl mx-auto border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden"
      >
        {/* Terminal bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/[0.06]">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-sm bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-sm bg-green-500/40" />
          </div>
          <span className="ml-3 text-[10px] font-mono tracking-wider text-white/15">aniverse/create // NODE//01</span>
          <span className="ml-auto text-[9px] font-mono text-white/10">[SYS.01]</span>
        </div>

        {/* Preview grid */}
        <div className="grid grid-cols-2 gap-3 p-4">
          {[
            { label: "samurai neon city, cyberpunk anime", icon: Palette, color: "#E5C587" },
            { label: "Your creation appears here", icon: Image, color: "#2DD4BF" },
          ].map((item, i) => (
            <div key={i} className="aspect-square rounded-sm border border-white/[0.04] bg-white/[0.01] flex items-center justify-center p-6">
              <div className="text-center">
                <item.icon className="mx-auto h-8 w-8" style={{ color: `${item.color}40` }} />
                <p className="mt-2 text-xs text-white/25 font-mono tracking-wide">{item.label}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Trending */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="mt-8 max-w-3xl mx-auto"
      >
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-3.5 w-3.5 text-[#E5C587]/50" />
          <span className="text-[11px] font-mono tracking-widest text-white/30">TRENDING STYLES</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {TRENDING_STYLES.slice(0, 4).map((style) => (
            <span key={style.id} className="px-3 py-1.5 text-[10px] font-mono tracking-wider rounded-sm border border-white/[0.06] bg-white/[0.02] text-white/30 hover:text-white/60 hover:border-white/[0.12] transition-all duration-300 cursor-default">
              {style.label}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// ─── Pricing Content ────────────────────────────────────────────

function PricingContent() {
  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="text-center mb-12"
      >
        <span className="text-[10px] font-mono tracking-widest text-white/20">SUPPLY PASS // 供給パス</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
          Choose your plan
        </h2>
        <p className="mt-3 text-white/40 max-w-xl mx-auto">
          Start free, upgrade when you need more power.
        </p>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-3 max-w-5xl mx-auto">
        {tierEntries.map((tier, i) => (
          <motion.div
            key={tier.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.08, duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className={`relative p-6 rounded-sm border transition-all duration-500 ${
              tier.popular
                ? "border-[rgba(229,197,135,0.2)] bg-[rgba(229,197,135,0.03)]"
                : "border-white/[0.06] bg-white/[0.02] hover:border-white/[0.1]"
            }`}
          >
            {tier.popular && (
              <>
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-[#E5C587]/10 border border-[rgba(229,197,135,0.25)] rounded-sm">
                  <span className="text-[9px] font-mono tracking-widest text-[#E5C587]/70">MOST POPULAR</span>
                </div>
                <span className="absolute top-3 right-3 text-[8px] text-[#E5C587]/30">✦</span>
              </>
            )}
            <span className="text-[10px] font-mono tracking-widest text-white/20">{tier.id?.toUpperCase() || "FREE"} // TIER</span>
            <h3 className="text-xl font-bold text-white mt-1">{tier.name}</h3>
            <div className="mt-3 flex items-baseline gap-1">
              <span className="text-3xl font-bold text-white/90">{tier.price === 0 ? "Free" : `$${tier.price}`}</span>
              {tier.price > 0 && <span className="text-xs text-white/30">/month</span>}
            </div>
            <p className="mt-1 text-xs text-white/30 font-mono tracking-wide">
              {tier.credits === "Unlimited" ? "Unlimited generations" : `${tier.credits} generations/month`}
            </p>
            <ul className="mt-6 space-y-2.5">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-xs text-white/40">
                  <span className="mt-0.5 text-[#E5C587]/60 text-[8px]">✦</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              className={`mt-6 w-full py-2.5 px-4 text-xs font-semibold tracking-wider uppercase rounded-sm transition-all duration-300 ${
                tier.popular
                  ? "bg-[rgba(229,197,135,0.12)] border border-[rgba(229,197,135,0.25)] text-[#E5C587] hover:bg-[rgba(229,197,135,0.18)]"
                  : "border border-white/10 text-white/50 hover:text-white/70 hover:border-white/20"
              }`}
            >
              {tier.price === 0 ? "Get Started Free" : "Subscribe"}
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ─── Docs / About Content ───────────────────────────────────────

function DocsContent() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
      >
        <span className="text-[10px] font-mono tracking-widest text-white/20">ABOUT // 概要</span>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-2">
          Ready to create your masterpiece?
        </h2>
        <p className="mt-4 text-white/40 max-w-xl mx-auto leading-relaxed">
          Join thousands of creators already generating stunning anime art
          with AI. No credit card required.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        className="mt-10 max-w-xl mx-auto p-8 rounded-sm border border-white/[0.06] bg-white/[0.02]"
      >
        <div className="flex items-center justify-center gap-2 mb-4">
          <Sparkles className="h-5 w-5 text-[#E5C587]/60" />
          <span className="text-xl font-bold tracking-tight text-white/80">{APP_NAME}</span>
        </div>
        <p className="text-sm text-white/35 leading-relaxed">
          AniVerse is a creative platform for generating, sharing, and discovering
          AI-powered anime artwork. Built for artists, creators, and anime enthusiasts.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/register">
            <button className="px-6 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-sm bg-[rgba(229,197,135,0.12)] border border-[rgba(229,197,135,0.25)] text-[#E5C587] hover:bg-[rgba(229,197,135,0.18)] transition-all duration-300">
              <Sparkles className="inline h-3.5 w-3.5 mr-2" />
              Start Creating Free
            </button>
          </Link>
          <Link href="/login">
            <button className="px-6 py-2.5 text-xs font-semibold tracking-wider uppercase rounded-sm border border-white/10 text-white/50 hover:text-white/70 hover:border-white/20 transition-all duration-300">
              Sign In
            </button>
          </Link>
        </div>
      </motion.div>

      {/* Footer links */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-8 flex items-center justify-center gap-6 text-[10px] font-mono tracking-wider text-white/15"
      >
        <span>&copy; 2026 ANIVERSE</span>
        <span className="w-px h-3 bg-white/10" />
        <span>DOCS</span>
        <span className="w-px h-3 bg-white/10" />
        <span>TERMS</span>
        <span className="w-px h-3 bg-white/10" />
        <span>PRIVACY</span>
      </motion.div>
    </div>
  );
}

// ─── Page Export ────────────────────────────────────────────────

export default function HomePage() {
  return (
    <SpatialProvider>
      <SpatialScene />
    </SpatialProvider>
  );
}
