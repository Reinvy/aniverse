"use client";

import { motion } from "framer-motion";
import { Palette } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

interface PaletteSwatch {
  name: string;
  description: string;
  colors: string[];
  mood: string;
  genres: string[];
}

const PALETTES: PaletteSwatch[] = [
  {
    name: "Dusty Pastels",
    description:
      "Frieren-inspired muted warm tones — soft lavenders, dusty roses, sage greens, and warm beiges. Dominating fantasy and romance anime in 2026.",
    colors: ["#d4b5c0", "#c9a9b0", "#a8b5a0", "#d6c5b3", "#e8d5c4"],
    mood: "Warm, nostalgic, gentle",
    genres: ["Fantasy", "Romance", "Slice-of-Life"],
  },
  {
    name: "Digital Neon",
    description:
      "High-saturation electric blues, cyber pinks, and vivid purples on dark backgrounds. The signature palette for cyberpunk and sci-fi anime.",
    colors: ["#00f0ff", "#ff2d78", "#b200ff", "#120458", "#ff6b35"],
    mood: "Energetic, futuristic, intense",
    genres: ["Sci-Fi", "Cyberpunk", "Action"],
  },
  {
    name: "'90s Hi-Contrast",
    description:
      "Bold, unapologetic colors inspired by the 1990s anime golden age — vibrant reds, electric yellows, deep blues — the Science SARU revival aesthetic.",
    colors: ["#ff1744", "#ffea00", "#2979ff", "#00e676", "#d500f9"],
    mood: "Nostalgic, bold, playful",
    genres: ["Action", "Adventure", "Retro"],
  },
  {
    name: "Pastel Goth",
    description:
      "Dark romance meets soft pastels — muted blacks and charcoals paired with blush pinks, lavender, and mint. Rising trend in character design.",
    colors: ["#2d2a32", "#cbaacb", "#e8b4c8", "#a8d8b9", "#f0e6ef"],
    mood: "Moody, romantic, edgy",
    genres: ["Dark Fantasy", "Romance", "Horror"],
  },
];

function PaletteCard({ palette }: { palette: PaletteSwatch }) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 24 },
        whileInView: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.4 }}
      className="group"
    >
      <div className="h-full rounded-xl border border-zinc-800/60 bg-zinc-900/50 p-5 transition-all duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-violet-600/5">
        {/* Color swatches */}
        <div className="mb-4 flex gap-1.5 overflow-hidden rounded-lg">
          {palette.colors.map((color, i) => (
            <div
              key={i}
              className="h-12 flex-1 rounded-md transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>

        <h3 className="text-base font-semibold text-white">
          {palette.name}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
          {palette.description}
        </p>

        <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500">
          <span className="rounded-md bg-zinc-800 px-2 py-0.5">
            {palette.mood}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap gap-1.5">
          {palette.genres.map((genre) => (
            <Badge
              key={genre}
              variant="outline"
              className="border-zinc-700/50 text-[10px] uppercase tracking-wider text-zinc-500"
            >
              {genre}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function TrendingPalettes() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-28">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-fuchsia-600/5 via-transparent to-amber-600/5" />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div className="mx-auto max-w-2xl text-center" {...fadeInUp}>
          <Badge variant="secondary" className="mb-4 px-3 py-1">
            <Palette className="mr-1.5 h-3.5 w-3.5" />
            Color Trends 2026
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Trending Color Palettes
          </h2>
          <p className="mt-4 text-lg text-zinc-400">
            Each season brings new color stories. Our AI is tuned to the
            palettes defining anime art right now — from Frieren&rsquo;s dusty
            pastels to cyberpunk neons.
          </p>
        </motion.div>

        <motion.div
          className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          {...stagger}
        >
          {PALETTES.map((palette) => (
            <PaletteCard key={palette.name} palette={palette} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
