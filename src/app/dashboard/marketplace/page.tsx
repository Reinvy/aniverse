"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Store,
  Search,
  ShoppingCart,
  Image as ImageIcon,
  TrendingUp,
  Users,
  Coins,
  Package,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { FetchErrorState } from "@/components/ui/fetch-error";
import { Pagination } from "@/components/ui/pagination";
import { PageHeader } from "@/components/ui/page-header";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { formatNumber } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────

interface MarketplaceProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  createdAt: string;
  creator: {
    id: string;
    name: string | null;
    username: string | null;
    avatar: string | null;
  } | null;
  artwork: {
    id: string;
    title: string;
    imageUrl: string | null;
    style: string;
  } | null;
}

interface MarketplaceStats {
  totalListings: number;
  activeCreators: number;
  avgPrice: number;
  totalSales: number;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const SORT_OPTIONS = [
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low → High" },
  { id: "price-desc", label: "Price: High → Low" },
] as const;

type SortId = (typeof SORT_OPTIONS)[number]["id"];

// ─── Skeletons (game style) ───────────────────────────────────────

function StatBarSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="glass rounded-[4px] cut-corner p-3 sm:p-4 crosshair-mark relative overflow-hidden
            before:absolute before:inset-0 before:-translate-x-full
            before:bg-gradient-to-r before:from-transparent before:via-[rgba(230,194,128,0.06)] before:to-transparent
            before:animate-[shimmer_1.8s_infinite]"
        >
          <Skeleton className="h-3.5 w-24" />
          <Skeleton className="mt-2 h-6 w-16" />
        </div>
      ))}
    </div>
  );
}

function ListingCardSkeleton() {
  return (
    <div className="glass rounded-[4px] cut-corner overflow-hidden relative
      before:absolute before:inset-0 before:-translate-x-full
      before:bg-gradient-to-r before:from-transparent before:via-[rgba(230,194,128,0.06)] before:to-transparent
      before:animate-[shimmer_1.8s_infinite]">
      <Skeleton className="aspect-[4/3] w-full rounded-none" />
      <div className="p-4 space-y-2.5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-3.5 w-1/2" />
        <div className="flex items-center justify-between pt-1">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-8 w-24 rounded-[4px]" />
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────

export default function MarketplacePage() {
  const [products, setProducts] = useState<MarketplaceProduct[]>([]);
  const [stats, setStats] = useState<MarketplaceStats | null>(null);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sort, setSort] = useState<SortId>("newest");
  const [page, setPage] = useState(1);

  const fetchMarketplace = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        page: String(page),
        limit: "12",
        sort,
      });
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/marketplace?${params}`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setProducts(data.products || []);
      setStats(data.stats || null);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error("Failed to fetch marketplace:", err);
      setError(err instanceof Error ? err.message : "Failed to load marketplace");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [page, sort, searchQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchMarketplace();
  }, [fetchMarketplace]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMarketplace();
  };

  const handleComingSoon = () => {
    toast({
      title: "Coming soon",
      description: "Checkout will open after Stripe integration.",
      variant: "warning",
    });
  };

  const statItems = stats
    ? [
        {
          label: "Total Listings",
          value: formatNumber(stats.totalListings),
          icon: Package,
          accent: "text-gold-400",
          sysNode: "SYS.01",
        },
        {
          label: "Active Creators",
          value: formatNumber(stats.activeCreators),
          icon: Users,
          accent: "text-cyan-400",
          sysNode: "SYS.02",
        },
        {
          label: "Avg. Price",
          value: `$${stats.avgPrice.toFixed(2)}`,
          icon: Coins,
          accent: "text-emerald-400",
          sysNode: "SYS.03",
        },
        {
          label: "Total Sales",
          value: `$${formatNumber(stats.totalSales)}`,
          icon: TrendingUp,
          accent: "text-violet-400",
          sysNode: "SYS.04",
        },
      ]
    : [];

  return (
    <ErrorBoundary compact message="Failed to load marketplace">
      <div className="p-4 sm:p-6 lg:p-8">
        {/* Header */}
        <PageHeader
          title="Marketplace"
          description="BUY // SELL — AI-generated anime art marketplace"
          actions={
            <Button
              variant="primary"
              className="w-full sm:w-auto gap-2 glow-gold"
              onClick={handleComingSoon}
            >
              <Store className="h-4 w-4" />
              List Your Art
            </Button>
          }
        />

        {/* Stats bar */}
        {loading && !stats ? (
          <div className="mt-6">
            <StatBarSkeleton />
          </div>
        ) : stats ? (
          <motion.div
            className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            {statItems.map((stat) => {
              const StatIcon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="glass rounded-[4px] cut-corner p-3 sm:p-4 crosshair-mark group/stat"
                >
                  <div className="flex items-center gap-2">
                    <StatIcon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${stat.accent}`} />
                    <span className="sys-label">{stat.label}</span>
                  </div>
                  <p className="mt-1.5 sm:mt-2 text-lg sm:text-xl font-bold text-white">
                    {stat.value}
                  </p>
                  <span className="sys-node mt-1 block text-white/20">{stat.sysNode}</span>
                </div>
              );
            })}
          </motion.div>
        ) : null}

        {/* Filters */}
        <motion.div
          className="mt-4 sm:mt-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <form onSubmit={handleSearch} className="relative flex-1 max-w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/30" />
            <Input
              placeholder="Search marketplace..."
              className="pl-10 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          <div className="flex items-center gap-2">
            <label htmlFor="marketplace-sort" className="sr-only">
              Sort listings
            </label>
            <Select
              id="marketplace-sort"
              aria-label="Sort listings"
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortId);
                setPage(1);
              }}
              className="w-auto min-w-[190px]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={opt.id}
                  value={opt.id}
                  className="bg-[#0b0e14] text-white"
                >
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>
        </motion.div>

        {/* Listings grid */}
        <div className="mt-6 sm:mt-8">
          {loading ? (
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ListingCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto"
            >
              <FetchErrorState
                title="Could not load marketplace"
                message={error}
                onRetry={() => fetchMarketplace()}
              />
            </motion.div>
          ) : products.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto"
            >
              <EmptyState
                icon={Store}
                title="No listings found"
                description={
                  searchQuery
                    ? "Try different keywords or clear the search."
                    : "Be the first to list an artwork on the marketplace."
                }
                action={
                  <Button variant="outline" size="sm" className="mt-1" onClick={handleComingSoon}>
                    <Store className="h-3.5 w-3.5" />
                    List Your Art
                  </Button>
                }
              />
            </motion.div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              >
                {products.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05, duration: 0.3 }}
                  >
                    <Card className="group diamond-indicator overflow-hidden h-full flex flex-col">
                      {/* Thumbnail */}
                      <div className="relative aspect-[4/3] flex items-center justify-center bg-[rgba(0,0,0,0.3)] text-white/10 border-b border-white/5 overflow-hidden">
                        {item.artwork?.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.artwork.imageUrl}
                            alt={item.name}
                            loading="lazy"
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <ImageIcon className="h-10 w-10" />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent opacity-60" />
                        {item.artwork?.style && (
                          <Badge
                            variant="secondary"
                            className="absolute top-2 right-2 text-[10px] uppercase backdrop-blur-sm"
                          >
                            {item.artwork.style}
                          </Badge>
                        )}
                      </div>

                      <CardContent className="p-4 flex flex-col flex-1">
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-white truncate group-hover:text-gold-300 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-xs text-white/30 mt-0.5 truncate">
                            by {item.creator?.name ?? item.creator?.username ?? "AniVerse"}
                          </p>
                          {item.description && (
                            <p className="mt-2 text-xs leading-relaxed text-white/30 line-clamp-2">
                              {item.description}
                            </p>
                          )}
                        </div>

                        {/* Pricing + CTA */}
                        <div className="mt-3 flex items-center justify-between gap-2">
                          <span className="text-lg font-bold text-white">
                            ${item.price.toFixed(2)}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            className="gap-1.5 text-xs"
                            onClick={handleComingSoon}
                          >
                            <ShoppingCart className="h-3.5 w-3.5" />
                            Buy
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <Pagination
                  page={pagination.page}
                  totalPages={pagination.totalPages}
                  totalItems={pagination.total}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </div>

        {/* Decorative market footer strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.4 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <span className="sys-label text-white/25">MARKETPLACE // LIVE CATALOG</span>
          <span className="lang-label" data-en="MARKETPLACE" data-ja="マーケットプレイス" />
          <span className="flex items-center gap-1 text-[10px] text-emerald-400/80">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            DB SYNCED
          </span>
        </motion.div>
      </div>
    </ErrorBoundary>
  );
}
