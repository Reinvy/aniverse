"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Sparkles,
  Search,
  Palette,
  Clock,
  ArrowRight,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn, timeAgo } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────

interface Character {
  id: string;
  name: string;
  appearanceDesc: string | null;
  personality: string | null;
  referenceImages: unknown;
  createdAt: string;
  creator: {
    id: string;
    name: string | null;
    avatar: string | null;
  } | null;
  _count: { artworks: number };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Skeleton ─────────────────────────────────────────────────────

function CharacterSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="glass rounded-[4px] cut-corner p-5">
          <Skeleton className="h-8 w-20 mb-3" />
          <Skeleton className="h-5 w-3/4 mb-3" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-5/6 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const fetchCharacters = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "24", sort: "createdAt", order: "desc" });
      if (search) params.set("search", search);

      const res = await fetch(`/api/characters?${params}`);
      const data = await res.json();
      setCharacters(data.characters || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error("Failed to fetch characters:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCharacters();
  }, [page]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchCharacters();
  };

  // Extract first reference image
  const getFirstImage = (refImages: unknown): string | null => {
    if (Array.isArray(refImages) && refImages.length > 0) {
      return String(refImages[0]);
    }
    return null;
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24 pb-16">
        {/* Background layers */}
        <div className="pointer-events-none fixed inset-0 bg-eclipse" />
        <div className="pointer-events-none fixed inset-0 bg-starfield opacity-40" />
        <div className="pointer-events-none fixed inset-0 bg-grid opacity-15" />
        <div className="pointer-events-none fixed inset-0 scanline" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <Badge variant="secondary" className="mb-4 px-3 py-1">
              <Users className="mr-1.5 h-3.5 w-3.5" />
              CHARACTERS // OC DIRECTORY
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Discover Original Characters
            </h1>
            <p className="mt-3 text-lg text-white/50 max-w-2xl mx-auto">
              Explore a growing collection of original anime characters created
              by the AniVerse community. Get inspired for your next creation!
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="mb-8"
          >
            <form onSubmit={handleSearch} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search characters..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="default" size="icon" className="shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </form>
          </motion.div>

          {/* Characters Grid */}
          {loading ? (
            <CharacterSkeleton />
          ) : characters.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="glass rounded-xl p-10 max-w-md mx-auto cut-corner">
                <Users className="mx-auto h-12 w-12 text-white/20 mb-4" />
                <p className="text-white/40 text-sm">
                  {search
                    ? "No characters match your search. Try different keywords."
                    : "No characters have been created yet. Be the first!"}
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {characters.map((character, i) => {
                const image = getFirstImage(character.referenceImages);
                return (
                  <motion.div
                    key={character.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03, duration: 0.4 }}
                  >
                    <Card className="group h-full cut-corner energy-sweep relative overflow-hidden">
                      {/* Reference Image */}
                      {image ? (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={image}
                            alt={character.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent" />
                        </div>
                      ) : (
                        <div className="h-48 flex items-center justify-center bg-navy-800">
                          <Palette className="h-10 w-10 text-white/20" />
                        </div>
                      )}

                      <CardContent className={cn("p-5", !image && "pt-5")}>
                        {/* Name */}
                        <h3 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors mb-2 truncate">
                          {character.name}
                        </h3>

                        {/* Personality snippet */}
                        {character.personality && (
                          <p className="text-sm text-white/40 line-clamp-2 mb-3">
                            {character.personality}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="flex items-center justify-between text-xs text-white/30">
                          <span className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" />
                            {character._count.artworks} artworks
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {timeAgo(character.createdAt)}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-10 flex items-center justify-center gap-3"
            >
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <span className="sys-label text-white/40">
                PAGE {pagination.page} OF {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= pagination.totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
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
                Create your own character
              </h3>
              <p className="text-sm text-white/40 mb-4">
                Design original anime characters with AI. Save, share, and use
                them in your generations.
              </p>
              <Link href="/register">
                <Button variant="primary" className="gap-2">
                  Start Creating
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
