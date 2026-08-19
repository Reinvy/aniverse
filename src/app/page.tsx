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
  Camera,
  Users,
  ArrowRight,
  Star,
  ChevronRight,
  TrendingUp,
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
    icon: Camera,
    title: "Photo-to-Anime™",
    description:
      "Upload any photo and watch it transform into an anime-style masterpiece. Our viral AI caricature feature creates shareable anime portraits in seconds.",
    gradient: "from-sky-500 to-cyan-600",
  },
];

const tierEntries = Object.values(TIERS);

export default function HomePage() {
  return (
    <SpatialProvider>
      <SpatialViewport />
    </SpatialProvider>
  );
}
