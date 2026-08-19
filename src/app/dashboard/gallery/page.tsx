"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Image as ImageIcon,
  ShoppingCart,
  Eye,
  Clock,
  Grid3X3,
  List,
  Sparkles,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { MediaGridSkeleton } from "@/components/ui/skeleton";
import { StaggerGroup, StaggerItem } from "@/components/ui/reveal";
import { ArtworkImage } from "@/components/ui/artwork-image";
import { SearchBar } from "@/components/ui/search-bar";
import { Pagination } from "@/components/ui/pagination";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
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

  const filtered = artworks.filter((art) => {
    const matchesCategory =
      activeCategory === "all" || art.category === activeCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !query ||
      art.title.toLowerCase().includes(query) ||
      art.artist.toLowerCase().includes(query) ||
      ("description" in art &&
        typeof (art as any).description === "string" &&
        (art as any).description.toLowerCase().includes(query)) ||
      ("style" in art &&
        typeof (art as any).style === "string" &&
        (art as any).style.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

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
                size="icon"
                className="sm:h-8 sm:w-8"
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="icon"
                className="sm:h-8 sm:w-8"
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
          <SearchBar
            placeholder="Search artworks or prompts..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSubmit={handleSearch}
            maxWidth="max-w-full sm:max-w-md"
            className="flex-1"
          />
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
            <MediaGridSkeleton count={8} />
          ) : artworks.length === 0 ? (
            <EmptyState
              icon={ImageIcon}
              title="No artworks found"
              description="Try adjusting your search or filters."
              className="max-w-md mx-auto"
            />
          ) : (
            <>
              <StaggerGroup
                id="results-top"
                stagger={0.05}
                className={cn(
                  "scroll-mt-28",
                  viewMode === "grid"
                    ? "grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "space-y-3 sm:space-y-4",
                )}
              >
                {artworks.map((art) => (
                  <StaggerItem key={art.id}>
                    <Card
                      className={cn(
                        "group cursor-pointer diamond-indicator overflow-hidden",
                        "transition-all duration-300 premium-transition",
                        viewMode === "grid"
                          ? "hover:scale-[1.02] hover:border-[rgba(229,197,135,0.35)] hover:shadow-[0_0_24px_rgba(229,197,135,0.12)]"
                          : "hover:border-white/20 hover:bg-white/[0.04]",
                        viewMode === "list" && "flex items-center gap-4 p-3",
                      )}
                    >
                      {/* Thumbnail */}
                      <ArtworkImage
                        src={art.imageUrl}
                        alt={art.title}
                        wrapperClassName={cn(
                          viewMode === "grid"
                            ? "aspect-[4/3] rounded-t-[4px] border-b border-white/5"
                            : "h-20 w-20 shrink-0 rounded-[4px] border border-white/5",
                        )}
                        className={cn(
                          "object-cover",
                          viewMode === "grid" ? "absolute inset-0 h-full w-full" : "h-full w-full",
                        )}
                      />

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
                          {(art._count?.products ?? 0) > 0 && (
                            <span className="flex items-center gap-1" title="Marketplace listings">
                              <ShoppingCart className="h-3.5 w-3.5 text-gold-400" />
                              {formatNumber(art._count?.products ?? 0)}
                            </span>
                          )}
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
                  </StaggerItem>
                ))}
              </StaggerGroup>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={pagination.page}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.total}
                    onPageChange={setPage}
                    scrollTargetId="results-top"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <ScrollToTop />
    </ErrorBoundary>
  );
}
