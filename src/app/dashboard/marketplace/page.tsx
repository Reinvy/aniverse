"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Search,
  ShoppingCart,
  Heart,
  Star,
  Image,
  TrendingUp,
  Clock,
  Filter,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/lib/utils";

const categories = [
  { id: "all", label: "All" },
  { id: "portraits", label: "Portraits" },
  { id: "landscapes", label: "Landscapes" },
  { id: "characters", label: "Characters" },
  { id: "sfw", label: "SFW" },
  { id: "premium", label: "Premium" },
];

const listings = Array.from({ length: 8 }, (_, i) => ({
  id: `listing-${i + 1}`,
  title: [
    "Neon Samurai v2",
    "Dragon Empress - Gold Edition",
    "Cyberpunk Alley Collection",
    "Spirit of the Forest - 4K",
    "Starlight Dancer Series",
    "Mechanized Dreams Bundle",
    "Cherry Blossom Storm Print",
    "Moonlit Temple - Limited",
  ][i],
  creator: ["CyberWeeb", "EmberForge", "PixelMage", "MoriArt", "KiraKira", "NeonWeeb", "SakuraGen", "DawnArtist"][i],
  price: [4.99, 14.99, 8.99, 9.99, 6.49, 19.99, 3.99, 12.99][i],
  originalPrice: [null, 29.99, null, null, 12.99, null, null, 24.99][i],
  likes: Math.floor(Math.random() * 500),
  rating: (3.5 + Math.random() * 1.5).toFixed(1),
  sales: Math.floor(Math.random() * 200),
  category: categories[Math.floor(Math.random() * (categories.length - 1)) + 1].id,
}));

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = listings.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
              Marketplace
            </h1>
            <p className="mt-0.5 text-sm text-white/40 sys-label">
              BUY // SELL — AI-generated anime art marketplace
            </p>
          </div>
          <Button variant="primary" className="w-full sm:w-auto gap-2 glow-gold">
            <Store className="h-4 w-4" />
            List Your Art
          </Button>
        </div>
      </motion.div>

      {/* Stats bar */}
      <motion.div
        className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        {[
          { label: "Total Listings", value: "1,247", icon: Store },
          { label: "Active Creators", value: "342", icon: TrendingUp },
          { label: "Avg. Price", value: "$8.50", icon: ShoppingCart },
          { label: "Total Sales", value: "$48.2K", icon: ArrowUpRight },
        ].map((stat) => {
          const StatIcon = stat.icon;
          return (
            <div
              key={stat.label}
              className="glass rounded-[4px] cut-corner p-3 sm:p-4 crosshair-mark"
            >
              <div className="flex items-center gap-2">
                <StatIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-white/30" />
                <span className="sys-label">{stat.label}</span>
              </div>
              <p className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold text-white">{stat.value}</p>
            </div>
          );
        })}
      </motion.div>

      {/* Filters */}
      <motion.div
        className="mt-4 sm:mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
          <Input
            placeholder="Search marketplace..."
            className="pl-10 text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`rounded-[4px] px-3 py-1.5 text-xs font-medium transition-all duration-300 premium-transition ${
                activeCategory === cat.id
                  ? "border border-[rgba(230,194,128,0.3)] bg-[rgba(230,194,128,0.1)] text-gold-400"
                  : "border border-white/10 bg-[rgba(0,0,0,0.2)] text-white/40 hover:border-white/20 hover:text-white/60"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Listings grid */}
      <motion.div
        className="mt-6 sm:mt-8 grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        {filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/10 bg-[rgba(0,0,0,0.3)]">
              <Store className="h-7 w-7 text-white/20" />
            </div>
            <p className="mt-4 text-lg font-semibold text-white/60">
              No listings found
            </p>
            <p className="mt-1 text-sm text-white/30">
              Try adjusting your search or filters.
            </p>
          </div>
        ) : (
          filtered.map((item, i) => (
            <motion.div
              key={item.id}
              className="energy-sweep"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Card className="group cursor-pointer diamond-indicator overflow-hidden">
                {/* Thumbnail */}
                <div className="aspect-[4/3] flex items-center justify-center bg-[rgba(0,0,0,0.3)] text-white/10 border-b border-white/5">
                  <Image className="h-10 w-10" />
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-white truncate">
                        {item.title}
                      </h3>
                      <p className="text-xs text-white/30 mt-0.5">
                        by {item.creator}
                      </p>
                    </div>
                    <button className="shrink-0 text-white/20 hover:text-rose-400 transition-colors duration-200">
                      <Heart className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Pricing */}
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-lg font-bold text-white">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.originalPrice && (
                      <span className="text-sm text-white/20 line-through">
                        ${item.originalPrice.toFixed(2)}
                      </span>
                    )}
                    {item.originalPrice && (
                      <Badge variant="destructive" className="text-[10px] ml-auto">
                        -
                        {Math.round(
                          (1 - item.price / item.originalPrice) * 100,
                        )}
                        %
                      </Badge>
                    )}
                  </div>

                  {/* Meta */}
                  <div className="mt-3 flex items-center gap-3 text-xs text-white/30">
                    <span className="flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-gold-400 fill-gold-400" />
                      {item.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <ShoppingCart className="h-3.5 w-3.5" />
                      {item.sales} sold
                    </span>
                    <span className="flex items-center gap-1 ml-auto">
                      {formatNumber(item.likes)} likes
                    </span>
                  </div>

                  <Button variant="outline" className="mt-4 w-full gap-2 text-xs">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Add to Cart
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </motion.div>
    </div>
  );
}
