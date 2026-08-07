"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  User,
  Users,
  Sparkles,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PageBackground } from "@/components/ui/page-background";

// ─── Types ────────────────────────────────────────────────────────

interface CharacterDetail {
  id: string;
  name: string;
  appearanceDesc: string | null;
  personality: string | null;
  backstory: string | null;
  referenceImages: unknown;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    name: string | null;
    avatar: string | null;
    bio: string | null;
  } | null;
  _count: { artworks: number };
}

// ─── Skeleton ─────────────────────────────────────────────────────

function CharacterDetailSkeleton() {
  return (
    <div className="max-w-3xl mx-auto">
      <Skeleton className="h-10 w-32 mb-8" />
      <Skeleton className="h-10 w-2/3 mb-4" />
      <div className="flex gap-3 mb-8">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-72 w-full mb-8 rounded-[4px]" />
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

// ─── Info Panel ───────────────────────────────────────────────────

function InfoPanel({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass rounded-[4px] cut-corner p-6 sm:p-8"
    >
      <div className="flex items-center gap-2 mb-4">
        <span className="h-1.5 w-1.5 rotate-45 bg-gold-400" />
        <h2 className="text-sm font-bold tracking-[0.2em] text-gold-300 sys-label">
          {title}
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-stroke-gold/40 to-transparent" />
      </div>
      <p className="text-white/70 leading-relaxed whitespace-pre-line">
        {children}
      </p>
    </motion.div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────

export default function CharacterDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [character, setCharacter] = useState<CharacterDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchCharacter = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/characters/${id}`);
        if (!res.ok) {
          if (res.status === 404) throw new Error("Character not found");
          throw new Error("Failed to load character");
        }
        const data = await res.json();
        setCharacter(data.character);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  // Extract first reference image
  const getFirstImage = (refImages: unknown): string | null => {
    if (Array.isArray(refImages) && refImages.length > 0) {
      return String(refImages[0]);
    }
    return null;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const image = character ? getFirstImage(character.referenceImages) : null;

  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-24 pb-16">
        {/* Background layers */}
        <PageBackground starfieldOpacity={0.3} gridOpacity={0.1} />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading ? (
            <CharacterDetailSkeleton />
          ) : error || !character ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 max-w-md mx-auto"
            >
              <Card className="p-10 cut-corner">
                <div className="text-4xl mb-4">🌀</div>
                <h2 className="text-xl font-bold text-white mb-2">
                  {error || "Character not found"}
                </h2>
                <p className="text-sm text-white/40 mb-6">
                  The character you&apos;re looking for doesn&apos;t exist or
                  has been removed.
                </p>
                <Link href="/characters">
                  <Button variant="default" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Characters
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
                <Link href="/characters">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-white/50 hover:text-gold-300"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Characters
                  </Button>
                </Link>
              </motion.div>

              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <Badge variant="default" className="mb-4 px-3 py-1">
                  <Users className="mr-1.5 h-3.5 w-3.5" />
                  CHARACTER // PROFILE
                </Badge>

                <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl leading-tight mb-4">
                  {character.name}
                </h1>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/40 mb-8">
                  {character.creator?.name && (
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {character.creator.name}
                    </span>
                  )}
                  {character.createdAt && (
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(character.createdAt)}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <ImageIcon className="h-3.5 w-3.5" />
                    {character._count.artworks} artworks
                  </span>
                </div>
              </motion.div>

              {/* Reference Image */}
              {image && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-10"
                >
                  <div className="glass rounded-[4px] cut-corner overflow-hidden relative border-holo">
                    <div className="relative h-80 sm:h-96">
                      <Image
                        src={image}
                        alt={character.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 768px"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e14] via-transparent to-transparent" />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Appearance */}
              {character.appearanceDesc && (
                <div className="mb-8">
                  <InfoPanel title="APPEARANCE // VISUAL" delay={0.25}>
                    {character.appearanceDesc}
                  </InfoPanel>
                </div>
              )}

              {/* Personality */}
              {character.personality && (
                <div className="mb-8">
                  <InfoPanel title="PERSONALITY // TRAITS" delay={0.3}>
                    {character.personality}
                  </InfoPanel>
                </div>
              )}

              {/* Backstory */}
              {character.backstory && (
                <div className="mb-8">
                  <InfoPanel title="BACKSTORY // ORIGIN" delay={0.35}>
                    {character.backstory}
                  </InfoPanel>
                </div>
              )}

              {/* Creator */}
              {character.creator?.name && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.45 }}
                  className="mb-8"
                >
                  <Card className="p-5 cut-corner">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gold-400/20 border border-stroke-gold">
                        <User className="h-5 w-5 text-gold-400" />
                      </div>
                      <div>
                        <p className="text-[10px] tracking-[0.2em] text-white/40 sys-label">
                          CREATOR
                        </p>
                        <p className="font-semibold text-white">
                          {character.creator.name}
                        </p>
                        {character.creator.bio && (
                          <p className="text-sm text-white/40">
                            {character.creator.bio}
                          </p>
                        )}
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}

              {/* Bottom CTA */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55 }}
                className="mt-10 text-center"
              >
                <div className="glass rounded-xl p-8 cut-corner max-w-lg mx-auto">
                  <Sparkles className="mx-auto h-8 w-8 text-gold-400 mb-3" />
                  <h3 className="text-lg font-bold text-white mb-2">
                    Create your own character
                  </h3>
                  <p className="text-sm text-white/40 mb-4">
                    Design original anime characters with AI. Save, share, and
                    use them in your generations.
                  </p>
                  <Link href="/register">
                    <Button variant="primary" className="gap-2">
                      Get Started Free
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Back to directory */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-8 text-center"
              >
                <Link href="/characters">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-white/50 hover:text-gold-300"
                  >
                    <Users className="h-4 w-4" />
                    Explore all characters
                  </Button>
                </Link>
              </motion.div>
            </article>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
