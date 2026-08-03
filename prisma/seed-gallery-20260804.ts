/**
 * AniVerse — Public Gallery Seed (2026-08-04)
 *
 * Seeds a diverse set of PUBLIC artworks into the Artwork table so the
 * community gallery page (/dashboard/gallery and GET /api/gallery) renders
 * real DB content instead of hardcoded placeholder data.
 *
 * - Creates (or reuses) a system CREATOR user.
 * - Upserts 12 artworks across all ArtworkStyle variants.
 * - Idempotent: safe to run multiple times (skips existing titles).
 *
 * Run: npx tsx prisma/seed-gallery-20260804.ts
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import {
  PrismaClient,
  ArtworkStyle,
} from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const ARTWORKS: Array<{
  title: string;
  prompt: string;
  style: ArtworkStyle;
  width: number;
  height: number;
}> = [
  {
    title: "Neon Samurai",
    prompt:
      "A stoic samurai standing in a rain-soaked neon alley, magenta and cyan signs reflecting off wet pavement, cel-shaded bold outlines, high contrast lighting, cinematic composition, 4K",
    style: "ANIME",
    width: 1024,
    height: 1024,
  },
  {
    title: "Spirit of the Forest",
    prompt:
      "A mystical forest spirit with glowing antlers surrounded by bioluminescent flora, soft watercolor textures, warm earthy palette with magical teal accents, Ghibli-inspired",
    style: "WATERCOLOR",
    width: 1024,
    height: 1024,
  },
  {
    title: "Starlight Dancer",
    prompt:
      "An elegant dancer twirling under a starry night sky, flowing ribbons of light, semi-realistic anime style, deep blues and gold highlights, ethereal atmosphere",
    style: "SEMI_REALISTIC",
    width: 1024,
    height: 1024,
  },
  {
    title: "Mechanized Dreams",
    prompt:
      "A cybernetic android girl with glowing circuits waking from a dream, detailed mechanical parts, chrome and teal color scheme, futuristic sci-fi anime style",
    style: "REALISTIC",
    width: 1024,
    height: 1024,
  },
  {
    title: "Cherry Blossom Storm",
    prompt:
      "A fierce anime heroine unleashing a tornado of cherry blossom petals, dynamic action pose, vibrant pinks and whites, manga speed lines, dramatic manga style",
    style: "MANGA",
    width: 1024,
    height: 1024,
  },
  {
    title: "Tiny Dragon Empress",
    prompt:
      "An adorable chibi dragon empress with a tiny golden crown, big sparkling eyes, soft rounded proportions, pastel colors, kawaii chibi style",
    style: "CHIBI",
    width: 1024,
    height: 1024,
  },
  {
    title: "Pixel Fox Spirit",
    prompt:
      "A nine-tailed fox spirit rendered as a retro pixel art sprite, vibrant 16-bit palette, glowing mystical aura, classic SNES-era pixel art style",
    style: "PIXEL_ART",
    width: 1024,
    height: 1024,
  },
  {
    title: "Moonlit Temple",
    prompt:
      "A serene Japanese temple under a full moon, cherry blossoms drifting in the wind, night sky with stars, painterly anime background art",
    style: "ANIME",
    width: 1024,
    height: 1024,
  },
  {
    title: "Dragon Empress",
    prompt:
      "A commanding empress with dragon horns and a flowing imperial robe, golden accents, fantasy anime style, majestic throne room background",
    style: "REALISTIC",
    width: 1024,
    height: 1024,
  },
  {
    title: "Astral Wanderer",
    prompt:
      "A lone traveler crossing a cosmic bridge of stars, purple and gold nebula sky, semi-realistic painting style, sense of scale and wonder",
    style: "SEMI_REALISTIC",
    width: 1024,
    height: 1024,
  },
  {
    title: "Frost Witch",
    prompt:
      "A powerful ice witch conjuring a blizzard, crystalline magic swirling around her, cool blues and whites, dynamic fantasy anime style",
    style: "ANIME",
    width: 1024,
    height: 1024,
  },
  {
    title: "Quantum Fox",
    prompt:
      "A cyberpunk fox spirit made of holographic light, glitch effects, neon purple and cyan, futuristic vaporwave aesthetic",
    style: "OTHER",
    width: 1024,
    height: 1024,
  },
];

async function getOrCreateGalleryCreator() {
  const existing = await prisma.user.findFirst({
    where: { username: "aniverse-gallery" },
  });
  if (existing) return existing;

  return prisma.user.create({
    data: {
      name: "AniVerse Gallery",
      email: "gallery@aniverse.app",
      username: "aniverse-gallery",
      role: "CREATOR",
      premiumTier: "ULTIMATE",
      bio: "Curated community artwork showcase.",
      avatar:
        "https://image.pollinations.ai/prompt/anime%20avatar%20golden%20sparkles?width=256&height=256&seed=42&nologo=true",
      coinBalance: 0,
    },
  });
}

async function main() {
  console.log("🌱 Starting AniVerse gallery seed (2026-08-04)...\n");

  const creator = await getOrCreateGalleryCreator();
  console.log(`✅ Gallery creator ready: ${creator.name} (${creator.id})`);

  let created = 0;
  let skipped = 0;

  for (const art of ARTWORKS) {
    const existing = await prisma.artwork.findFirst({
      where: { title: art.title, creatorId: creator.id },
      select: { id: true },
    });

    if (existing) {
      skipped += 1;
      continue;
    }

    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      art.prompt,
    )}?width=${art.width}&height=${art.height}&seed=${Math.floor(
      Math.random() * 99999,
    )}&nologo=true`;

    await prisma.artwork.create({
      data: {
        title: art.title,
        prompt: art.prompt,
        style: art.style,
        imageUrl,
        width: art.width,
        height: art.height,
        isPublic: true,
        creatorId: creator.id,
      },
    });
    created += 1;
  }

  const total = await prisma.artwork.count({
    where: { isPublic: true },
  });

  console.log(`\n✅ Created ${created} artwork(s), skipped ${skipped} existing.`);
  console.log(`📊 Total public artworks in DB: ${total}`);
  console.log("\n🎉 Gallery seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
