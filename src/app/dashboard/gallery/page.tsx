"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Image,
  Heart,
  Eye,
  Clock,
  Search,
  Grid3X3,
  List,
  Sparkles,
  Palette,
  Sun,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Spinner } from "@/components/ui/spinner";
import { formatNumber, timeAgo, cn } from "@/lib/utils";
import { GALLERY_CATEGORIES } from "@/lib/constants";
import { dailyArt } from "@/data/daily-art-20260727";

// Placeholder artwork data
const artworks = Array.from({ length: 12 }, (_, i) => ({
  id: `art-${i + 1}`,
  title: [
    "Neon Samurai",
    "Spirit of the Forest",
    "Starlight Dancer",
    "Mechanized Dreams",
    "Cherry Blossom Storm",
    "Cyberpunk Alley",
    "Moonlit Temple",
    "Dragon Empress",
    "Astral Wanderer",
    "Frost Witch",
    "Quantum Fox",
    "Shadow Ronin",
  ][i],
  artist: ["CyberWeeb", "MoriArt", "KiraKira", "NeonWeeb", "SakuraGen", "PixelMage", "DawnArtist", "EmberForge", "StarWeaver", "FrostByte", "QuantumArt", "ShadowCraft"][i],
  likes: Math.floor(Math.random() * 5000),
  views: Math.floor(Math.random() * 20000),
  createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
  category: GALLERY_CATEGORIES[Math.floor(Math.random() * (GALLERY_CATEGORIES.length - 1)) + 1].id,
  image: null,
}));

function ColorSwatch({ color }: { color: string }) {
  return (
    <div
      className="h-5 w-5 rounded-full border border-white/10 shadow-sm transition-transform duration-200 hover:scale-125"
      style={{ backgroundColor: color }}
      title={color}
    />
  );
}

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDailyArt, setShowDailyArt] = useState(true);

  const filtered = artworks.filter((art) => {
    const matchesCategory =
      activeCategory === "all" || art.category === activeCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.artist.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <ErrorBoundary compact message="Failed to load gallery">
    <div className="p-4 sm:p-6 lg:p-8">
      {/* ─── Daily Art Section ─── */}
      {showDailyArt && (
        <motion.section
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 sm:mb-10"
        >
          <div className="mb-4 sm:mb-6 flex items-start sm:items-center gap-3">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-[4px] bg-gradient-to-br from-amber-400 to-orange-600 shadow-lg">
              <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                Today&apos;s Daily Art
              </h2>
              <p className="sys-label text-xs text-white/30">
                CURATED // July 27, 2026
              </p>
            </div>
            <button
              onClick={() => setShowDailyArt(false)}
              className="shrink-0 text-xs text-white/20 hover:text-white/40 transition-colors duration-200"
            >
              Dismiss
            </button>
          </div>

          <div className="angled-bar mb-6 h-0.5 w-full rounded-full bg-gradient-to-r from-amber-500/40 via-amber-400/20 to-transparent" />

          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {dailyArt.map((art, i) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <Card className="group h-full diamond-indicator">
                  {/* Thumbnail placeholder with style gradient */}
                  <div className="flex aspect-[4/3] items-center justify-center rounded-t-[4px] bg-[rgba(0,0,0,0.3)] border-b border-white/5 text-white/10 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    <div className="z-20 flex flex-col items-center gap-2">
                      <Palette className="h-10 w-10 text-amber-500/60" />
                      <Badge
                        variant="secondary"
                        className="bg-black/50 text-[10px] uppercase tracking-wider text-amber-400"
                      >
                        {art.style}
                      </Badge>
                    </div>
                    {/* Color palette strip at bottom */}
                    <div className="absolute bottom-0 left-0 right-0 z-20 flex gap-0.5 p-2">
                      {art.colorPalette.slice(0, 5).map((color) => (
                        <div
                          key={color}
                          className="h-1.5 flex-1 rounded-full"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-white truncate flex items-center gap-1.5">
                          <Sparkles className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                          {art.title}
                        </h3>
                        <p className="text-xs text-white/30 mt-0.5">
                          by {art.artistAttribution}
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[10px] uppercase"
                      >
                        {art.genre}
                      </Badge>
                    </div>

                    <p className="mt-2 text-xs leading-relaxed text-white/30 line-clamp-2">
                      {art.description}
                    </p>

                    {/* Theme tag */}
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="inline-block rounded-[4px] bg-[rgba(0,0,0,0.3)] border border-white/5 px-2 py-0.5 text-[10px] text-white/30">
                        {art.theme}
                      </span>
                    </div>

                    {/* Color palette */}
                    <div className="mt-3 flex items-center gap-1.5">
                      {art.colorPalette.map((color) => (
                        <ColorSwatch key={color} color={color} />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* Header */}
      <PageHeader
        title="Gallery"
        description="COLLECTION // Browse and discover community creations"
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("grid")}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon-sm"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {/* Filters */}
      <motion.div
        className="mt-4 sm:mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Search artworks or artists..."
            className="pl-10 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {GALLERY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "rounded-[4px] px-3 py-1.5 text-xs font-medium transition-all duration-300 premium-transition",
                activeCategory === cat.id
                  ? "border border-[rgba(230,194,128,0.3)] bg-[rgba(230,194,128,0.1)] text-gold-400"
                  : "border border-white/10 bg-[rgba(0,0,0,0.2)] text-white/40 hover:border-white/20 hover:text-white/60",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Artwork Grid */}
      <motion.div
        className={cn(
          "mt-6 sm:mt-8",
          viewMode === "grid"
            ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            : "space-y-3 sm:space-y-4",
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[rgba(0,0,0,0.3)]">
              <Image className="h-7 w-7 text-white/20" />
            </div>
            <p className="mt-4 text-lg font-semibold text-white/60">
              No artworks found
            </p>
            <p className="mt-1 text-sm text-white/30">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          filtered.map((art, i) => (
            <motion.div
              key={art.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card
                className={cn(
                  "group cursor-pointer diamond-indicator",
                  viewMode === "list" && "flex items-center gap-4 p-3",
                )}
              >
                {/* Thumbnail placeholder */}
                <div
                  className={cn(
                    "flex items-center justify-center bg-[rgba(0,0,0,0.3)] text-white/10",
                    viewMode === "grid"
                      ? "aspect-[4/3] rounded-t-[4px] border-b border-white/5"
                      : "h-20 w-20 shrink-0 rounded-[4px] border border-white/5",
                  )}
                >
                  <Image className="h-8 w-8" />
                </div>

                <CardContent
                  className={cn(
                    viewMode === "grid" ? "p-4" : "flex-1 p-0",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white truncate">
                        {art.title}
                      </h3>
                      <p className="text-xs text-white/30 mt-0.5">
                        by {art.artist}
                      </p>
                    </div>
                    <Badge variant="secondary" className="shrink-0 text-[10px] uppercase">
                      {art.category}
                    </Badge>
                  </div>

                  <div className="mt-3 flex items-center gap-4 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5 text-rose-400" />
                      {formatNumber(art.likes)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {formatNumber(art.views)}
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      <Clock className="h-3.5 w-3.5" />
                      {timeAgo(art.createdAt)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
    </ErrorBoundary>
  );
}
