/**
 * AniVerse — Marketplace Seed (2026-08-05)
 *
 * Creates ACTIVE Product listings from existing PUBLIC artworks so the
 * marketplace page (/dashboard/marketplace and GET /api/marketplace)
 * renders real DB content instead of hardcoded placeholder data.
 *
 * - Idempotent: skips artworks that already have a product.
 * - Deterministic pricing: each artwork maps to a stable price via its id.
 * - No Stripe dependency: listings are catalog-only until checkout ships.
 *
 * Run: npx tsx prisma/seed-marketplace-20260805.ts
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

/** Stable price ladder — artwork id hash picks one of these. */
const PRICE_LADDER = [3.99, 5.99, 7.99, 9.99, 12.99, 14.99, 19.99, 24.99];

/** Deterministic index from a string (FNV-1a style, non-crypto). */
function hashIndex(input: string, mod: number): number {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return Math.abs(hash) % mod;
}

async function main() {
  console.log("🌱 Starting AniVerse marketplace seed (2026-08-05)...\n");

  // Existing product → artworkId map (skip artworks already listed).
  const existingProducts = await prisma.product.findMany({
    select: { artworkId: true },
  });
  const listedArtworkIds = new Set(
    existingProducts.map((p) => p.artworkId).filter(Boolean) as string[],
  );
  console.log(`📦 Found ${existingProducts.length} existing product(s).`);

  // All public artworks that could become listings.
  const artworks = await prisma.artwork.findMany({
    where: { isPublic: true },
    select: {
      id: true,
      title: true,
      prompt: true,
      imageUrl: true,
      creatorId: true,
    },
  });

  let created = 0;
  let skipped = 0;

  for (const art of artworks) {
    if (listedArtworkIds.has(art.id)) {
      skipped += 1;
      continue;
    }

    const price = PRICE_LADDER[hashIndex(art.id, PRICE_LADDER.length)];

    await prisma.product.create({
      data: {
        name: art.title,
        description: art.prompt ?? null,
        price,
        fileUrl: art.imageUrl,
        isActive: true,
        creatorId: art.creatorId,
        artworkId: art.id,
      },
    });
    created += 1;
  }

  const total = await prisma.product.count({ where: { isActive: true } });

  console.log(`\n✅ Created ${created} listing(s), skipped ${skipped} already-listed.`);
  console.log(`📊 Total active products in DB: ${total}`);
  console.log("\n🎉 Marketplace seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
