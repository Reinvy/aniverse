"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  Heart,
  Eye,
  Clock,
  Search,
  Grid3X3,
  List,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { FetchErrorState } from "@/components/ui/fetch-error";
import { FilterChips } from "@/components/ui/filter-chips";
import { formatNumber, timeAgo, cn } from "@/lib/utils";
import { GALLERY_CATEGORIES } from "@/lib/constants";

// ─── Types ────────────────────────────────────────────────────────

interface GalleryArtwork {
  id: string;
  title: string;
  style: string;
  imageUrl: string | null;
  prompt: string | null;
  width: number | null;
  height: number | null;
  createdAt: string;
  creator: {
    id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
  } | null;
  _count?: { products?: number };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// Category → ArtworkStyle filter mapping (gallery chips → API param)
const STYLE_BY_CATEGORY: Record<string, string | undefined> = {
  portraits: "SEMI_REALISTIC",
  landscapes: "WATERCOLOR",
  fantasy: "ANIME",
  "sci-fi": "REALISTIC",
  chibi: "CHIBI",
  cyberpunk: "OTHER",
};

// ─── Skeleton ─────────────────────────────────────────────────────

function GallerySkeleton() {
  return (
    <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="glass rounded-[4px] cut-corner overflow-hidden">
          <Skeleton className="aspect-[4/3] w-full rounded-none" />
          <div className="p-4 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────

export default function GalleryPage() {
  const [artworks, setArtworks] = useState<GalleryArtwork[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);

  const fetchGallery = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "12" });
      if (searchQuery.trim()) params.set("search", searchQuery.trim());
      const style = STYLE_BY_CATEGORY[activeCategory];
      if (style) params.set("style", style);

      const res = await fetch(`/api/gallery?${params}`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setArtworks(data.artworks || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error("Failed to fetch gallery:", err);
      setError(err instanceof Error ? err.message : "Failed to load gallery");
      setArtworks([]);
    } finally {
      setLoading(false);
    }
  }, [page, activeCategory, searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchGallery();
  }, [fetchGallery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchGallery();
  };

  return (
    <ErrorBoundary compact message="Failed to load gallery">
      <div className="p-4 sm:p-6 lg:p-8">
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
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon-sm"
                onClick={() => setViewMode("list")}
                aria-label="List view"
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
          <form onSubmit={handleSearch} className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search artworks or prompts..."
              className="pl-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <FilterChips
            options={GALLERY_CATEGORIES}
            value={activeCategory}
            onChange={(v) => {
              setActiveCategory(v);
              setPage(1);
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="mt-6 sm:mt-8">
          {error ? (
            <FetchErrorState
              message={error}
              onRetry={() => {
                setPage(1);
                fetchGallery();
              }}
            />
          ) : loading ? (
            <GallerySkeleton />
          ) : artworks.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="No artworks found"
              description="Try adjusting your search or filters."
              className="max-w-md mx-auto"
            />
          ) : (
            <>
              <motion.div
                className={cn(
                  viewMode === "grid"
                    ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-3 sm:space-y-4",
                )}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                {artworks.map((art, i) => (
                  <motion.div
                    key={art.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Card
                      className={cn(
                        "group cursor-pointer diamond-indicator overflow-hidden",
                        viewMode === "list" && "flex items-center gap-4 p-3",
                      )}
                    >
                      {/* Thumbnail */}
                      <div
                        className={cn(
                          "relative flex items-center justify-center bg-[rgba(0,0,0,0.3)] text-white/10",
                          viewMode === "grid"
                            ? "aspect-[4/3] rounded-t-[4px] border-b border-white/5"
                            : "h-20 w-20 shrink-0 rounded-[4px] border border-white/5",
                        )}
                      >
                        {art.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={art.imageUrl}
                            alt={art.title}
                            className={cn(
                              "object-cover",
                              viewMode === "grid" ? "absolute inset-0 h-full w-full" : "h-full w-full",
                            )}
                            loading="lazy"
                          />
                        ) : (
                          <ImageIcon className="h-8 w-8" />
                        )}
                      </div>

                      <CardContent
                        className={cn(
                          viewMode === "grid" ? "p-4" : "flex-1 p-0",
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-white truncate flex items-center gap-1.5">
                              <Sparkles className="h-3.5 w-3.5 text-gold-400 shrink-0" />
                              {art.title}
                            </h3>
                            <p className="text-xs text-white/30 mt-0.5 truncate">
                              by {art.creator?.name ?? art.creator?.username ?? "AniVerse"}
                            </p>
                          </div>
                          <Badge variant="secondary" className="shrink-0 text-[10px] uppercase">
                            {art.style}
                          </Badge>
                        </div>

                        {art.prompt && viewMode === "grid" && (
                          <p className="mt-2 text-xs leading-relaxed text-white/30 line-clamp-2">
                            {art.prompt}
                          </p>
                        )}

                        <div className="mt-3 flex items-center gap-4 text-xs text-white/30">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3.5 w-3.5 text-rose-400" />
                            {formatNumber(art._count?.products ?? 0)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            {art.width ?? 0}×{art.height ?? 0}
                          </span>
                          <span className="flex items-center gap-1 ml-auto">
                            <Clock className="h-3.5 w-3.5" />
                            {timeAgo(new Date(art.createdAt))}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    onPageChange={setPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
