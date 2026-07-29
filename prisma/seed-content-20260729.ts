/**
 * AniVerse — Dynamic Content Seed (2026-07-29)
 *
 * Seeds the database with:
 * - 3 SEO-optimized BlogArticles
 * - 1 Active Challenge
 * - 3 Public Characters
 *
 * Run: npx tsx prisma/seed-content-20260729.ts
 *
 * Environment: DATABASE_URL must be set.
 */

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

// ─── Helper: Get or create a system/admin user ───────────────
async function getOrCreateAdminUser() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (admin) return admin;

  // If no admin exists, create one
  return prisma.user.create({
    data: {
      name: "AniVerse System",
      email: "system@aniverse.app",
      role: "ADMIN",
      premiumTier: "ULTIMATE",
      username: "aniverse",
      bio: "Official AniVerse system account for automated content.",
      coinBalance: 999999,
    },
  });
}

// ─── Main Seed ───────────────────────────────────────────────
async function main() {
  console.log("🌱 Starting AniVerse content seed...\n");

  const admin = await getOrCreateAdminUser();
  console.log(`✅ Admin user: ${admin.name} (${admin.id})`);

  // ==============================================================
  // 1. BLOG ARTICLES (3 SEO-optimized posts)
  // ==============================================================

  const articles = [
    {
      title: "How to Create Stunning AI Anime Art: A Beginner's Guide (2026)",
      slug: "how-to-create-ai-anime-art-beginners-guide-2026",
      content: `# How to Create Stunning AI Anime Art: A Beginner's Guide

Welcome to the world of AI-powered anime creation! Whether you're a seasoned artist looking to expand your toolkit or a complete beginner with no drawing experience, AI anime generators have made it easier than ever to bring your characters to life.

## What You'll Need

Before diving in, make sure you have:
- A modern web browser (Chrome, Firefox, Safari, or Edge)
- A stable internet connection
- A creative mindset!

## Step 1: Understand Your Prompt

The key to great AI anime art lies in your prompt. Think of it as giving directions to an incredibly talented artist who can draw anything — but needs clear instructions.

**Good prompt structure:**
- Subject (character, scene, object)
- Style (anime, manga, chibi, watercolor)
- Mood (mysterious, cheerful, epic)
- Colors (neon, pastel, monochrome)
- Details (lighting, effects, background)

**Example:**
> "A solitary samurai standing in a neon-lit cyberpunk city, rain falling on their armored shoulder, glowing cherry blossom petals floating in the wind, cel-shaded anime style, dramatic lighting, cinematic composition"

## Step 2: Choose Your Style

AniVerse supports multiple anime art styles:

| Style | Best For |
|-------|----------|
| Anime | Classic anime aesthetic with bold lines |
| Manga | Black-and-white comic book style |
| Chibi | Cute, exaggerated characters |
| Realistic | Semi-realistic anime portraits |
| Watercolor | Soft, painterly illustrations |
| Pixel Art | Retro 8-bit/16-bit game sprites |

## Step 3: Refine and Iterate

Don't expect perfection on the first try! The best AI art comes from iteration:
1. Generate an initial image
2. Analyze what you like and don't like
3. Adjust your prompt accordingly
4. Generate again with refinements

## Pro Tips

- **Use negative prompts** to exclude unwanted elements
- **Add style modifiers** like "studio ghibli inspired" or "akira style"
- **Specify aspect ratio** for different use cases (wallpaper, portrait, banner)
- **Experiment with seed values** for controlled variations

## Start Creating Today

Ready to begin? Head over to AniVerse and start generating your first AI anime masterpiece. The free plan includes 10 generations per month — no credit card required!`,
      excerpt: "Learn how to create breathtaking AI-generated anime art with our comprehensive beginner's guide. Master prompts, styles, and techniques in 2026.",
      coverImage: "https://image.pollinations.ai/prompt/anime_art_creation_workspace_digital_tablet_stylized",
      tags: ["AI Anime", "Beginner Guide", "Tutorial", "Prompt Engineering", "Digital Art"],
      seoTitle: "How to Create AI Anime Art: Complete Beginner's Guide (2026) | AniVerse",
      seoDesc: "Master AI anime art creation with AniVerse. Learn prompt engineering, style selection, and pro tips for generating stunning anime artwork with artificial intelligence.",
      isPublished: true,
      publishedAt: new Date("2026-07-29T00:00:00Z"),
    },
    {
      title: "Top 10 Anime Art Styles You Can Generate with AI in 2026",
      slug: "top-10-anime-art-styles-ai-2026",
      content: `# Top 10 Anime Art Styles You Can Generate with AI in 2026

The landscape of AI-generated anime art has exploded with possibilities. From classic cel-shaded looks to cutting-edge painterly styles, here are the top 10 anime art styles you can create with AniVerse right now.

## 1. Classic Cel-Shaded Anime

The gold standard of anime aesthetics. Bold outlines, flat colors with simple shading, and that unmistakable Saturday-morning-cartoon charm.

**Best for:** Character portraits, action scenes, manga-style comics

## 2. Ghibli-Inspired Fantasy

Soft watercolor backgrounds, warm earthy tones, and whimsical character designs reminiscent of Studio Ghibli's masterpieces.

**Best for:** Fantasy landscapes, slice-of-life scenes, nostalgic artwork

## 3. Cyberpunk Neon

High-contrast neon colors, rain-slicked streets, holographic displays, and futuristic cityscapes with a distinctly Japanese aesthetic.

**Best for:** Sci-fi characters, urban landscapes, album covers

## 4. Dark Fantasy / Gothic

Moody atmospheres, ornate armor and clothing, dramatic shadows, and rich jewel-tone colors with a dark edge.

**Best for:** RPG character designs, fantasy illustrations, book covers

## 5. Chibi / Super-Deformed

Cute, exaggerated proportions with oversized heads and expressive faces. Perfect for emotes, stickers, and social media avatars.

**Best for:** Profile pictures, merchandise, social media content

## 6. Watercolor Painting

Soft, flowing colors with organic edges that mimic traditional watercolor paintings. Gives artwork a dreamy, ethereal quality.

**Best for:** Romantic scenes, fantasy illustrations, fine art prints

## 7. Ukiyo-e Inspired

Traditional Japanese woodblock print style with bold outlines, flat colors, and decorative patterns. A timeless aesthetic.

**Best for:** Historical themes, decorative art, cultural projects

## 8. Mecha / Sci-Fi Anime

Sharp geometric shapes, metallic textures, glowing energy cores, and dynamic action poses for robot and sci-fi enthusiasts.

**Best for:** Mecha designs, sci-fi characters, game concept art

## 9. Shoujo / Romantic

Soft pastel colors, sparkling effects, delicate linework, and dreamy atmospheres. The hallmark of romantic manga and anime.

**Best for:** Romance stories, fashion illustrations, decorative art

## 10. Pixel Art / Retro

Blocky 8-bit and 16-bit aesthetics that capture the nostalgia of classic JRPGs and retro games.

**Best for:** Game sprites, retro-style artwork, nostalgic pieces

## Try Them All

The best way to find your style is to experiment! Each AniVerse plan gives you generations to explore different aesthetics. Upgrade to Pro or Studio for unlimited style exploration.`,
      excerpt: "Discover the top 10 anime art styles you can generate with AI in 2026. From cel-shaded classics to Ghibli-inspired fantasy, find your perfect aesthetic.",
      coverImage: "https://image.pollinations.ai/prompt/collage_of_anime_art_styles_grid_showcase",
      tags: ["Anime Styles", "AI Art", "Style Guide", "Inspiration", "Tutorial"],
      seoTitle: "Top 10 Anime Art Styles You Can Generate with AI (2026) | AniVerse",
      seoDesc: "Explore 10 stunning anime art styles you can create with AI: cel-shaded, Ghibli-inspired, cyberpunk, chibi, watercolor, and more. Find your perfect look with AniVerse.",
      isPublished: true,
      publishedAt: new Date("2026-07-29T01:00:00Z"),
    },
    {
      title: "AI Anime Character Design: From Concept to Complete OC",
      slug: "ai-anime-character-design-guide-2026",
      content: `# AI Anime Character Design: From Concept to Complete OC

Creating original characters (OCs) is at the heart of anime culture. With AI, you can go from a vague concept to a fully-realized character design in minutes. Here's how.

## Step 1: Define Your Character Concept

Before generating anything, establish the fundamentals:
- **Name and role:** Who are they? Hero, villain, sidekick, mentor?
- **Personality traits:** Brave, shy, mischievous, stoic?
- **Backstory:** What shaped them? What are their goals?
- **Visual archetype:** What's their general look?

## Step 2: Build a Detailed Prompt

Translate your concept into an AI-friendly prompt:

**Basic formula:**
> [Character type] with [hair style/color] and [eye color], wearing [outfit], in [pose/action], [style modifier], [mood/atmosphere]

**Example for a fire mage:**
> "A confident young female fire mage with flowing crimson hair and amber eyes, wearing an ornate golden and black mage robe with flame embroidery, casting a fire spell in one hand, anime style, dynamic action pose, glowing magical effects, cinematic lighting"

## Step 3: Iterate on Specific Elements

Generate multiple variations focusing on different aspects:
1. **First pass:** Full body concept
2. **Second pass:** Facial close-up with expression variations
3. **Third pass:** Outfit detail and color palette refinement
4. **Fourth pass:** Action poses and special effects

## Step 4: Build a Character Sheet

Combine your best generations into a character reference sheet with:
- Front and back views
- Expression variations (happy, angry, sad, surprised)
- Key accessories or weapons
- Color palette swatches

## Step 5: Add Your Character to AniVerse

Once you're happy with your OC:
1. Save your character with a name and description
2. Add personality traits and backstory
3. Use your character in future generations
4. Share with the AniVerse community

## Character Design Tips

- **Silhouette test:** A great character is recognizable by silhouette alone
- **Color harmony:** Limit your palette to 3-4 main colors
- **Accessories tell a story:** Choose items that reflect background/personality
- **Expression range:** Design with expressive features for storytelling

## Start Building Your OC Today

Every great anime story starts with memorable characters. Whether you're designing for a comic, game, or personal project, AniVerse gives you the tools to bring your vision to life.`,
      excerpt: "Master AI-powered anime character design with our comprehensive guide. Learn to create original characters from concept to complete OC with AniVerse.",
      coverImage: "https://image.pollinations.ai/prompt/anime_character_design_concept_sheet_sketches",
      tags: ["Character Design", "OC Creation", "AI Art", "Tutorial", "Anime Characters"],
      seoTitle: "AI Anime Character Design Guide: Create Original OCs (2026) | AniVerse",
      seoDesc: "Learn to design stunning original anime characters with AI. From concept to complete OC, master prompt engineering for character creation with AniVerse.",
      isPublished: true,
      publishedAt: new Date("2026-07-29T02:00:00Z"),
    },
  ];

  for (const article of articles) {
    await prisma.blogArticle.upsert({
      where: { slug: article.slug },
      update: article,
      create: {
        ...article,
        authorId: admin.id,
      },
    });
    console.log(`📝 Blog article: "${article.title}"`);
  }

  // ==============================================================
  // 2. CHALLENGE (1 Active weekly challenge)
  // ==============================================================

  const challenge = {
    title: "Summer Fantasy: Create Your Dream Anime World",
    description:
      "This week's challenge is to design a breathtaking fantasy world inspired by summer! Generate an anime-style landscape that captures the essence of summer — whether it's a sun-drenched beach town, a magical forest in bloom, or a floating island paradise. Use vibrant colors, warm lighting, and fantastical elements to bring your dream summer world to life. The most creative entries will be featured on our homepage and win 500 AniVerse coins!",
    type: "WEEKLY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-07-28T00:00:00Z"),
    endsAt: new Date("2026-08-04T00:00:00Z"),
    rewardCoins: 500,
    prompt:
      "breathtaking fantasy summer world, anime style, vibrant colors, warm golden hour lighting, magical atmosphere, studio ghibli inspired, highly detailed, cinematic composition",
    requirements: {
      minWidth: 1024,
      minHeight: 768,
      style: "ANIME",
      theme: "fantasy summer",
      description:
        "Generate an anime-style fantasy summer landscape. Must be original creation through AniVerse.",
    },
  };

  // Check if challenge already exists by title uniqueness within active period
  const existingChallenge = await prisma.challenge.findFirst({
    where: {
      title: challenge.title,
      status: "ACTIVE",
    },
  });

  if (!existingChallenge) {
    await prisma.challenge.create({ data: challenge });
    console.log(`🏆 Challenge: "${challenge.title}" (${challenge.rewardCoins} coins reward)`);
  } else {
    console.log(`🏆 Challenge already exists: "${challenge.title}"`);
  }

  // ==============================================================
  // 3. CHARACTERS (3 public OCs)
  // ==============================================================

  const characters = [
    {
      name: "Yuki Hoshizora",
      appearanceDesc:
        "A tall, ethereal young woman with long, flowing silver-white hair that shimmers like starlight. Her eyes are a deep amethyst purple with faint star-like specks. She wears a flowing midnight-blue mage robe embroidered with golden constellation patterns, with a crescent moon brooch at her collar. A translucent, starry cape flows behind her, and she carries a staff crowned with a glowing crystal orb.",
      personality:
        "Yuki is calm, wise, and deeply introspective. She speaks in measured tones and often seems to be contemplating mysteries beyond mortal understanding. Despite her serene exterior, she carries a deep sense of wonder and childlike curiosity about the world. She is fiercely protective of her friends and will unleash devastating cosmic power when those she loves are threatened.",
      backstory:
        "Yuki was discovered as an infant beneath a meteor shower, wrapped in fabric woven from what appeared to be solidified starlight. Raised by the sages of the Celestial Academy, she learned to harness the cosmic energy that flows through her veins. Now she travels the world seeking answers about her origins, and the constellation-shaped mark on her back that seems to shift with the seasons.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/ethereal_female_anime_mage_silver_hair_starlight_midnight_blue_robe_constellation_patterns_crystal_staff",
      ],
      isPublic: true,
    },
    {
      name: "Kenji Takashi",
      appearanceDesc:
        "A muscular young man in his early 20s with spiky dark crimson hair and sharp golden eyes. He wears a worn leather jacket over a black tank top, cargo pants, and combat boots with steel toes. His right arm is covered in intricate tribal-style tattoos that glow faintly red when he uses his powers. He has a noticeable scar running diagonally across his left cheek and a perpetual smirk.",
      personality:
        "Kenji is brash, confident, and lives by his own code. He's the type to rush headfirst into danger with a grin, trusting his instincts and his fists. Beneath the tough exterior, he has a strong sense of justice and a soft spot for underdogs. He hates seeing bullies get away with things and will pick a fight with anyone who preys on the weak. His loyalty, once earned, is unshakeable.",
      backstory:
        "Kenji grew up on the streets of Neo-Tokyo's lower districts, surviving through street fights and small-time hustling. He discovered his fire-manipulation abilities during a gang confrontation, accidentally incinerating half a block. On the run, he was found by a retired hero who trained him to control his temper and his powers. Now he works as a freelance 'problem solver,' taking jobs that let him punch bad guys and earn enough to keep his foster siblings fed.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_bad_boy_with_crimson_spiky_hair_golden_eyes_leather_jacket_tribal_tattoos_scar_confident_smirk",
      ],
      isPublic: true,
    },
    {
      name: "Miyu-chan",
      appearanceDesc:
        "A tiny, adorable chibi-style fox girl with fluffy orange-and-white fur, oversized pointed ears with tufts, and a massive bushy tail. She has big, sparkling emerald green eyes that seem to take up half her face. She wears a little red shrine maiden outfit with a tiny bell collar, and always carries a giant rice cracker or a magical acorn. She stands barely three feet tall.",
      personality:
        "Miyu-chan is endlessly cheerful, curious, and mischievous. She speaks in short, excited bursts and has a habit of tilting her head like a curious puppy. She loves exploring, making new friends, and finding snacks. Despite her cute appearance, she is a powerful forest spirit guardian who can summon nature's fury when the forest is threatened. She just prefers solving problems with kindness and treats.",
      backstory:
        "Miyu-chan is a kitsune (fox spirit) who was born from the first cherry blossom tree planted at a centuries-old shrine. For most of her long life, she guarded the forest and played pranks on travelers. When development threatened her sacred grove, she emerged from the spirit world to protect it — but quickly discovered that modern humans respond better to cuteness than curses. Now she acts as a bridge between the spirit world and AniVerse, helping users create nature-themed art infused with genuine magical essence.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/chibi_fox_girl_kitsune_orange_white_fur_big_emerald_eyes_red_shrine_maiden_outfit_fluffy_tail_cute_anime",
      ],
      isPublic: true,
    },
  ];

  for (const character of characters) {
    // Check if character already exists
    const existing = await prisma.character.findFirst({
      where: { name: character.name, creatorId: admin.id },
    });

    if (!existing) {
      await prisma.character.create({
        data: {
          ...character,
          creatorId: admin.id,
        },
      });
      console.log(`👤 Character: "${character.name}"`);
    } else {
      console.log(`👤 Character already exists: "${character.name}"`);
    }
  }

  console.log("\n✅ Content seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
