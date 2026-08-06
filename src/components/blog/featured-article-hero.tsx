"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, timeAgo } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────

export interface FeaturedArticle {
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

// ─── Component ────────────────────────────────────────────────────

/**
 * FeaturedArticleHero — curated hero card for the blog landing page.
 *
 * Anime Game UI v2: obsidian glass panel, cut corners, holographic border,
 * gold corner brackets, ambient gold light bleed, [SYS] tracking label,
 * hexagonal gold CTA and EN//日本語 micro-label.
 */
export function FeaturedArticleHero({ article }: { article: FeaturedArticle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.5 }}
      className="mb-10"
    >
      <Link href={`/blog/${article.slug}`} className="group block">
        <div className="relative overflow-hidden glass rounded-[4px] cut-corner border-holo">
          {/* ambient gold bleed + decorative corner brackets */}
          <div className="pointer-events-none absolute inset-0 glow-ambient" />
          <div className="pointer-events-none absolute top-0 left-0 h-8 w-8 bracket-corner" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-8 w-8 bracket-corner-br" />

          <div className="relative grid gap-0 md:grid-cols-[2fr_3fr]">
            {/* Cover */}
            {article.coverImage && (
              <div className="relative h-56 md:h-full min-h-[14rem] overflow-hidden">
                <Image
                  src={article.coverImage}
                  alt={article.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent md:bg-gradient-to-r" />
                {/* Featured stamp */}
                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-[4px] border border-stroke-gold/50 bg-[#0b0e14]/70 px-2.5 py-1 backdrop-blur-sm">
                  <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gold-300">
                    Featured
                  </span>
                </div>
              </div>
            )}

            {/* Copy */}
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="sys-label text-gold-300/90">
                  [SYS.01] // FEATURED ARTICLE
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-gold-300 transition-colors mb-2 line-clamp-2">
                {article.title}
              </h2>

              {article.excerpt && (
                <p className="text-sm text-white/50 leading-relaxed mb-4 line-clamp-3 max-w-2xl">
                  {article.excerpt}
                </p>
              )}

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {article.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-[10px] px-2 py-0.5">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Meta + CTA */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {article.publishedAt
                      ? timeAgo(article.publishedAt)
                      : timeAgo(article.createdAt)}
                  </span>
                  {article.author?.name && (
                    <span className={cn("font-medium text-white/60")}>{article.author.name}</span>
                  )}
                </div>

                <span className="btn-hex-gold inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold">
                  Read Article
                  <ArrowRight className="h-4 w-4" />
                </span>
              </div>

              <span
                className="lang-label mt-4 block"
                data-en="READ // FEATURED"
                data-ja="注目記事"
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
