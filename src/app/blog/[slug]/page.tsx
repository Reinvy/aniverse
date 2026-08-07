"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Tag,
  Sparkles,
  BookOpen,
  Share2,
  Copy,
  Check,
  Link2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Modal } from "@/components/ui/modal";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageBackground } from "@/components/ui/page-background";
import { APP_NAME, APP_URL } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";

// ─── Types ────────────────────────────────────────────────────────

interface BlogArticle {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  coverImage: string | null;
  tags: string[];
  seoTitle: string | null;
  seoDesc: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string | null;
    avatar: string | null;
    bio: string | null;
  } | null;
}

interface RelatedArticle {
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

// ─── Skeleton ─────────────────────────────────────────────────────

function ArticleSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      <Skeleton className="h-10 w-24 mb-8" />
      <Skeleton className="h-10 w-3/4 mb-4" />
      <div className="flex gap-3 mb-6">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-64 w-full mb-8 rounded-[4px]" />
      <div className="space-y-3">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-4/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

// ─── Related Articles ─────────────────────────────────────────────

function RelatedArticles({ articles }: { articles: RelatedArticle[] }) {
  if (articles.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7, duration: 0.5 }}
      className="mt-12"
    >
      <div className="flex items-center gap-2 mb-6">
        <BookOpen className="h-5 w-5 text-gold-400" />
        <h2 className="text-xl font-bold text-white sys-label">
          RELATED ARTICLES
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-stroke-gold/40 to-transparent" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((item) => (
          <Link key={item.id} href={`/blog/${item.slug}`} className="group">
            <div className="glass rounded-[4px] cut-corner overflow-hidden h-full transition-all duration-300 group-hover:scale-[1.02] group-hover:border-stroke-gold/50 group-hover:shadow-[0_0_24px_rgba(229,197,135,0.12)]">
              {item.coverImage && (
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={item.coverImage}
                    alt={item.title}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-obsidian/80 to-transparent" />
                </div>
              )}
              <div className="p-5">
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {(item.tags || []).slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-2 py-0.5 text-[10px]">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h3 className="text-sm font-semibold text-white leading-snug mb-2 line-clamp-2 group-hover:text-gold-300 transition-colors">
                  {item.title}
                </h3>
                {item.excerpt && (
                  <p className="text-xs text-white/40 line-clamp-2 mb-3">
                    {item.excerpt}
                  </p>
                )}
                <div className="flex items-center gap-1.5 text-[11px] text-white/30">
                  {item.author?.name && (
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {item.author.name}
                    </span>
                  )}
                  {item.publishedAt && (
                    <span className="flex items-center gap-1 ml-auto">
                      <Calendar className="h-3 w-3" />
                      {new Date(item.publishedAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.section>
  );
}

// ─── Main Page ────────────────────────────────────────────────────

export default function BlogArticlePage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [article, setArticle] = useState<BlogArticle | null>(null);
  const [related, setRelated] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shareOpen, setShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Share URL for the current article (built client-side to stay SSR-safe)
  const shareUrl =
    typeof window !== "undefined"
      ? window.location.href
      : `${APP_URL}/blog/${slug}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Article link copied to clipboard.",
        variant: "success",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Copy failed",
        description: "Please copy the link manually.",
        variant: "error",
      });
    }
  };

  useEffect(() => {
    if (!slug) return;

    const fetchArticle = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/blog/${slug}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Article not found");
          throw new Error("Failed to load article");
        }
        const data = await res.json();
        setArticle(data.article);
        setRelated(data.related || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [slug]);

  // Format date
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Estimate read time (rough: 200 words per minute)
  const estimateReadTime = (content: string): string => {
    const words = content.split(/\s+/).length;
    const minutes = Math.max(1, Math.ceil(words / 200));
    return `${minutes} min read`;
  };

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24 pb-16">
        {/* Background layers */}
        <PageBackground starfieldOpacity={0.3} gridOpacity={0.1} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <ArticleSkeleton />
          ) : error || !article ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 max-w-md mx-auto"
            >
              <Card className="p-10 cut-corner">
                <div className="text-4xl mb-4">📝</div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {error || "Article not found"}
                </h2>
                <p className="text-sm text-white/40 mb-6">
                  The article you&apos;re looking for doesn&apos;t exist or
                  has been removed.
                </p>
                <Link href="/blog">
                  <Button variant="default" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ) : (
            <article className="max-w-3xl mx-auto">
              {/* Back link */}
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-8"
              >
                <Link href="/blog">
                  <Button variant="ghost" size="sm" className="gap-2 text-white/50 hover:text-gold-300">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Blog
                  </Button>
                </Link>
              </motion.div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="px-2.5 py-1">
                      <Tag className="mr-1 h-3 w-3" />
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight mb-4">
                  {article.title}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-8">
                  {article.author?.name && (
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {article.author.name}
                    </span>
                  )}
                  {article.publishedAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(article.publishedAt)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    {estimateReadTime(article.content)}
                  </span>
                  <button
                    type="button"
                    onClick={() => setShareOpen(true)}
                    className="ml-auto flex items-center gap-1.5 rounded-[4px] border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-white/50 transition-all duration-300 hover:scale-105 hover:border-[rgba(229,197,135,0.3)] hover:text-gold-300"
                    aria-label="Share this article"
                  >
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </button>
                </div>
              </motion.div>

              {/* Cover Image */}
              {article.coverImage && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-10"
                >
                  <div className="glass rounded-[4px] cut-corner overflow-hidden relative">
                    <Image
                      src={article.coverImage}
                      alt={article.title}
                      width={1200}
                      height={675}
                      className="w-full h-auto max-h-[400px] object-cover"
                    />
                  </div>
                </motion.div>
              )}

              {/* Article Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
                className="glass rounded-[4px] cut-corner p-6 sm:p-10"
              >
                <div className="prose prose-invert prose-sm sm:prose-base max-w-none
                  prose-headings:text-white prose-headings:font-bold
                  prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4 prose-h2:border-b prose-h2:border-stroke-gold/30 prose-h2:pb-2
                  prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3
                  prose-p:text-white/70 prose-p:leading-relaxed
                  prose-a:text-gold-400 prose-a:no-underline hover:prose-a:underline
                  prose-strong:text-white
                  prose-code:text-cyan-400 prose-code:bg-glass-300 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-[3px] prose-code:text-sm
                  prose-pre:bg-navy-800 prose-pre:border prose-pre:border-stroke-white/20 prose-pre:rounded-[4px]
                  prose-li:text-white/70
                  prose-blockquote:border-l-gold-400 prose-blockquote:text-white/50 prose-blockquote:italic
                  prose-table:w-full prose-table:border-collapse
                  prose-th:bg-glass-300 prose-th:text-white prose-th:px-4 prose-th:py-2 prose-th:text-left
                  prose-td:border prose-td:border-stroke-white/10 prose-td:px-4 prose-td:py-2 prose-td:text-white/70
                  prose-hr:border-stroke-white/20"
                  dangerouslySetInnerHTML={{
                    __html: article.content
                      .replace(/^### (.*$)/gm, '<h3>$1</h3>')
                      .replace(/^## (.*$)/gm, '<h2>$1</h2>')
                      .replace(/^# (.*$)/gm, '<h1>$1</h1>')
                      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/\n/g, '<br />')
                      .replace(/^<p><\/p>/m, '')
                      .replace(/<p><br \/><\/p>/g, '')
                      .replace(/\|(.+?)\|/g, (match) => {
                        // Simple markdown table to HTML conversion
                        if (match.includes('---')) return '';
                        const cells = match.split('|').filter(c => c.trim());
                        if (cells.length === 0) return match;
                        const cellHtml = cells.map(c => `<td>${c.trim()}</td>`).join('');
                        return `<tr>${cellHtml}</tr>`;
                      }),
                  }}
                />
              </motion.div>

              {/* Author Bio */}
              {article.author?.bio && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8"
                >
                  <Card className="p-5 cut-corner">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/20 border border-stroke-gold">
                        <User className="h-5 w-5 text-gold-400" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {article.author.name || "AniVerse Team"}
                        </p>
                        <p className="text-sm text-white/40">
                          {article.author.bio}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-10 text-center"
              >
                <div className="glass rounded-xl p-8 cut-corner max-w-lg mx-auto">
                  <Sparkles className="mx-auto h-8 w-8 text-gold-400 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    Start creating with {APP_NAME}
                  </h3>
                  <p className="text-sm text-white/40 mb-4">
                    Generate stunning AI anime artwork today. Free plan
                    available — no credit card required.
                  </p>
                  <Link href="/register">
                    <Button variant="primary" className="gap-2">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Related Articles */}
              <RelatedArticles articles={related} />

              {/* Share Modal */}
              <Modal
                open={shareOpen}
                onClose={() => setShareOpen(false)}
                title="Share this article"
                microLabel={{ en: "SHARE // LINK", ja: "シェア" }}
                size="sm"
                footer={
                  <>
                    <Button variant="ghost" size="sm" onClick={() => setShareOpen(false)}>
                      Close
                    </Button>
                    <Button size="sm" className="gap-2" onClick={handleCopyLink}>
                      {copied ? (
                        <>
                          <Check className="h-4 w-4" />
                          Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copy Link
                        </>
                      )}
                    </Button>
                  </>
                }
              >
                <div className="space-y-4">
                  <p className="text-sm text-white/50">
                    Share this article with your community. Anyone with the
                    link can read it.
                  </p>
                  <div className="flex items-center gap-2 rounded-[4px] border border-white/10 bg-[rgba(0,0,0,0.4)] p-2.5">
                    <Link2 className="h-4 w-4 shrink-0 text-gold-400" />
                    <span className="truncate text-xs text-white/40">
                      {shareUrl}
                    </span>
                  </div>
                </div>
              </Modal>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
