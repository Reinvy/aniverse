"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Search,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FetchErrorState } from "@/components/ui/fetch-error";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { cn, timeAgo } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  publishedAt: string | null;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    avatar: string | null;
  } | null;
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Skeleton ─────────────────────────────────────────────────────

function BlogSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="glass rounded-[4px] cut-corner p-5">
          <Skeleton className="h-48 w-full mb-4 rounded-[4px]" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3 mb-4" />
          <div className="flex gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────

export default function BlogPage() {
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const fetchArticles = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: "20" });
      if (search) params.set("search", search);
      if (activeTag) params.set("tag", activeTag);

      const res = await fetch(`/api/blog?${params}`);
      if (!res.ok) throw new Error(`Request failed (${res.status})`);
      const data = await res.json();
      setArticles(data.articles || []);
      setTags(data.tags || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error("Failed to fetch articles:", err);
      setError(err instanceof Error ? err.message : "Failed to load articles");
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchArticles();
  }, [page, activeTag]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchArticles();
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24 pb-16">
        {/* Starfield + grid background */}
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
              <BookOpen className="mr-1.5 h-3.5 w-3.5" />
              BLOG // ARTICLES
            </Badge>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              AniVerse Blog
            </h1>
            <p className="mt-3 text-lg text-white/50 max-w-2xl mx-auto">
              Tutorials, guides, and updates from the AniVerse team. Learn AI
              anime art creation tips and stay up to date with new features.
            </p>
          </motion.div>

          {/* Search + Tag Filter */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="mb-8 space-y-4"
          >
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-md mx-auto">
              <Input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" variant="default" size="icon" className="shrink-0">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => { setActiveTag(null); setPage(1); }}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs transition-all duration-200",
                    !activeTag
                      ? "bg-gold-400/20 text-gold-300 border border-stroke-gold"
                      : "bg-glass-300 text-white/50 border border-transparent hover:border-stroke-gold hover:text-gold-300",
                  )}
                >
                  All
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => { setActiveTag(tag === activeTag ? null : tag); setPage(1); }}
                    className={cn(
                      "px-3 py-1 rounded-full text-xs transition-all duration-200",
                      activeTag === tag
                        ? "bg-gold-400/20 text-gold-300 border border-stroke-gold"
                        : "bg-glass-300 text-white/50 border border-transparent hover:border-stroke-gold hover:text-gold-300",
                    )}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Articles Grid */}
          {loading ? (
            <BlogSkeleton />
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-md mx-auto"
            >
              <FetchErrorState
                title="Could not load articles"
                message={error}
                onRetry={() => fetchArticles()}
              />
            </motion.div>
          ) : articles.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="glass rounded-xl p-10 max-w-md mx-auto cut-corner">
                <BookOpen className="mx-auto h-12 w-12 text-white/20 mb-4" />
                <p className="text-white/40 text-sm">
                  No articles found. Try a different search or check back later.
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {articles.map((article, i) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                >
                  <Link href={`/blog/${article.slug}`}>
                    <Card className="group h-full cut-corner energy-sweep relative overflow-hidden">
                      {/* Cover Image */}
                      {article.coverImage && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.coverImage}
                            alt={article.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent" />
                        </div>
                      )}

                      <CardContent className={cn("p-5", !article.coverImage && "pt-5")}>
                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {article.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-[10px] px-1.5 py-0.5">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {/* Title */}
                        <h3 className="text-base font-bold text-white group-hover:text-gold-300 transition-colors line-clamp-2 mb-2">
                          {article.title}
                        </h3>

                        {/* Excerpt */}
                        {article.excerpt && (
                          <p className="text-sm text-white/40 line-clamp-2 mb-4">
                            {article.excerpt}
                          </p>
                        )}

                        {/* Meta */}
                        <div className="flex items-center justify-between text-xs text-white/30">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {article.publishedAt
                              ? timeAgo(article.publishedAt)
                              : timeAgo(article.createdAt)}
                          </span>
                          {article.author?.name && (
                            <span>{article.author.name}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
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
                Want to create your own anime art?
              </h3>
              <p className="text-sm text-white/40 mb-4">
                Generate stunning AI anime artwork with AniVerse. Free plan
                available.
              </p>
              <Link href="/register">
                <Button variant="primary" className="gap-2">
                  Start Creating Free
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
