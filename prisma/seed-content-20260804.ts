/**
 * AniVerse — Dynamic Content Seed (2026-08-04)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (color theory, backgrounds, turnaround sheets)
 * - 1 Daily Challenge (neon samurai — tradition meets cyberpunk)
 * - 3 New Characters (unique archetypes)
 * - Data hygiene: mark expired ACTIVE challenges as COMPLETED
 *
 * Run: npx tsx prisma/seed-content-20260804.ts
 */

import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function getOrCreateAdminUser() {
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });
  if (admin) return admin;

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

async function main() {
  console.log("🌱 Starting AniVerse content seed v7 (2026-08-04)...\n");

  const admin = await getOrCreateAdminUser();
  console.log(`✅ Admin user: ${admin.name} (${admin.id})`);

  // ==============================================================
  // 0. DATA HYGIENE — Mark expired ACTIVE challenges as COMPLETED
  // ==============================================================
  const expired = await prisma.challenge.updateMany({
    where: {
      status: "ACTIVE",
      endsAt: { lt: new Date() },
    },
    data: { status: "COMPLETED" },
  });
  if (expired.count > 0) {
    console.log(`🧹 Marked ${expired.count} expired challenge(s) as COMPLETED`);
  } else {
    console.log("🧹 No expired challenges to clean up");
  }

  // ==============================================================
  // 1. BLOG ARTICLES (3 SEO-optimized — color, backgrounds, turnarounds)
  // ==============================================================

  const articles = [
    {
      title: "AI Anime Color Theory: Palettes That Pop",
      slug: "ai-anime-color-theory-palettes-2026",
      content: `# AI Anime Color Theory: Palettes That Pop

Color is the first thing a viewer feels and the last thing they forget. A great AI anime image is 50% composition and 50% palette — and the palette is the half you can control with just a few prompt words. Here's how to think about color like an anime color designer.

## Hue, Value, and Saturation — The Anime Trio

Most anime palettes live in a narrow, carefully-chosen slice of the color wheel:

| Property | What It Does | Prompt Keyword |
|----------|--------------|----------------|
| Hue | The actual color (red, blue, green) | "cool blue palette" |
| Value | How light or dark it is | "high-key lighting, bright values" |
| Saturation | How vivid it is | "muted desaturated tones" |

Anime reads as "colorful" not because it uses every hue, but because it commits — a frame with three strong hues reads more colorful than a frame with ten muddy ones.

## The 60-30-10 Rule

Professional color design follows a proportion:

- **60%** dominant color — the world, the walls, the sky
- **30%** secondary color — characters, focal objects
- **10%** accent color — eyes, glowing details, the thing you want noticed

In a prompt: "dominant deep blue environment, secondary warm beige character, accent bright gold glowing eyes".

## Complementary Pairs That Always Work

These pairs create instant visual tension — the reason neon signs and sunset scenes never get old:

- **Orange vs Cyan** — sunset heroes, synthwave
- **Magenta vs Green** — cyberpunk foliage, magical forests
- **Yellow vs Violet** — royalty, dusk, drama
- **Red vs Teal** — action, night streets

Prompt pattern: "vibrant complementary palette, [color A] and [color B] contrast, balanced composition".

## Analogous Palettes for Harmony

When you want calm — slice-of-life, romance, dream sequences — pick three neighbors on the wheel: "harmonious analogous palette, teal and cyan and soft green, gentle gradients".

## Character Color Coding

Anime characters are instantly recognizable by their color signature: the hair, eyes, and outfit each carry meaning. A hero is often high-contrast (dark outfit + bright hair), a villain muted with one bright accent, a healer all soft warm tones. When prompting, define the character palette before the scene palette.

## The Color Script Trick

Color scripts are how anime directors track emotion across a story — scenes shift from warm to cool as tension rises. Apply it to a series: start "warm golden", build to "neutral grey", peak at "cold blue with red accent". Your gallery instantly feels like a story.

## Common Palette Mistakes

1. **Full saturation everywhere** — nothing stands out if everything is loud
2. **Muddy neutrals** — grey should be tinted (cool grey vs warm grey), never pure
3. **Same value everywhere** — contrast comes from light vs dark, not just hue
4. **Too many accents** — one glowing element beats five

## Your Palette Checklist

- [ ] 60-30-10 proportion chosen
- [ ] One complementary or analogous scheme committed to
- [ ] Character color signature defined
- [ ] Values varied (light and dark zones)
- [ ] One clear accent color for the focal point

> *"Color is emotion with a hex code. Commit to a palette and the mood follows." — @PaletteMuse, AniVerse Creator*`,
      excerpt:
        "Master AI anime color theory: the 60-30-10 rule, complementary pairs, analogous harmony, character color coding, and the color script trick for storytelling.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_color_theory_palette_wheel_complementary_colors_cyan_orange_60_30_10_rule_stylized",
      tags: ["Color Theory", "Art Tutorial", "Palette", "Technique", "Design"],
      seoTitle: "AI Anime Color Theory: Palettes That Pop (2026) | AniVerse",
      seoDesc:
        "Learn AI anime color theory: the 60-30-10 rule, complementary pairs that always work, analogous harmony, and character color coding for palettes that pop.",
      isPublished: true,
      publishedAt: new Date("2026-08-04T00:00:00Z"),
    },
    {
      title: "Anime Backgrounds & Environment Design with AI",
      slug: "anime-backgrounds-environment-design-ai-2026",
      content: `# Anime Backgrounds & Environment Design with AI

A character is only as good as the world they stand in. The most stunning anime stills are often backgrounds — cityscapes at dusk, infinite libraries, floating shrines. The secret of great AI environment art is that it treats the background as a character of its own. Here's how to design worlds that make your characters feel alive.

## Background as Character

Ask three questions before prompting any environment:

1. **Who lives here?** — a palace for a queen looks different than a palace for a god
2. **What happened here?** — ruins tell a story; pristine halls hide one
3. **What time is it?** — the same street at noon and midnight are different worlds

## The Foreground-Midground-Background Stack

Layers are what separate anime backgrounds from flat wallpapers:

- **Foreground** — silhouettes, leaves, railing details (adds depth and scale)
- **Midground** — the main architecture, where the action lives
- **Background** — sky, distant mountains, atmosphere

Prompt it explicitly: "layered composition, detailed foreground elements, sweeping midground city, atmospheric background skyline".

## Environmental Storytelling

Details are plot. A background with a broken clock, a half-open door, and a single lit window says more than a paragraph of dialogue. When prompting, plant 2-3 storytelling details: "abandoned train station, overgrown vines, a single glowing vending machine still humming".

## Lighting Defines the Mood

The same location with different light is a different scene:

- **Golden hour** — nostalgia, warmth, endings
- **Blue hour** — melancholy, mystery, the in-between
- **Night neon** — energy, danger, secrets
- **Overcast** — quiet, introspective, everyday

## Scale and the "WOW" Shot

Anime environments feel big because the artist controls scale: tiny human figures against massive structures, tiny structures against massive skies. "Extreme scale contrast, tiny lone figure against colossal architecture" is a cheat code for awe.

## Architecture Styles to Study

- **Japanese street scenes** — torii gates, vending machines, power lines, wet asphalt reflections
- **Fantasy cities** — floating islands, spiral towers, impossible geometry
- **Sci-fi megastructures** — layered highways, holographic signage, clean brutalist curves
- **Rural idylls** — rice fields, wooden shrines, summer cicadas

## The Weather Layer

Never forget weather: rain adds reflection and melancholy, snow adds silence and purity, fog adds mystery and compression. "Light rain, wet reflections, soft fog" transforms an average prompt into atmosphere.

## Environment Prompt Template

\\\`\\\`\\\`
"anime background art, [location], [time of day], [weather], [lighting], [storytelling detail], layered composition, atmospheric depth, no characters, detailed matte painting style"
\\\`\\\`\\\`

## Your Environment Challenge

Pick one location from your favorite anime and redesign it: same place, different era. Then generate it at three times of day. Post the triptych — it proves you understand environment design, not just character art.

> *"A world is a character you can't see — give it a story and it will hold your audience." — @WorldBuilder, AniVerse Creator*`,
      excerpt:
        "Design breathtaking anime backgrounds with AI: background-as-character, foreground-midground-background stacking, environmental storytelling, and the WOW shot.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_background_environment_design_layered_composition_cityscape_dusk_atmospheric_depth_stylized",
      tags: ["Backgrounds", "Environment Design", "Art Tutorial", "Worldbuilding", "Technique"],
      seoTitle: "Anime Backgrounds & Environment Design with AI (2026) | AniVerse",
      seoDesc:
        "Master anime environment design with AI: layered composition, environmental storytelling, mood lighting, scale contrast, and a reusable prompt template.",
      isPublished: true,
      publishedAt: new Date("2026-08-04T02:00:00Z"),
    },
    {
      title: "Character Turnaround Sheets: Consistency From Every Angle",
      slug: "character-turnaround-sheets-ai-2026",
      content: `# Character Turnaround Sheets: Consistency From Every Angle

A character turnaround — front, side, back, and 3/4 views of the same design — is the industry standard for locking a character's look. In AI art, turnarounds are the ultimate consistency test: if you can keep one character identical across four angles, you can keep them identical across an entire episode. Here's how to build them with AI.

## What a Turnaround Is For

Animators and illustrators use turnarounds as the reference bible for a character. Every detail — hair shape, outfit construction, accessory placement — is defined so any artist (or any AI prompt) can draw the character correctly from any angle.

## Why AI Struggles With Turnarounds

AI models love variety. Left to itself, a model will happily change a character's hairstyle between angles, swap the jacket color, or move a scar to the wrong cheek. The fix is the same as expression sheets: anchor hard, vary only the angle.

## Step 1: Build the Character Bible

Write one locked block describing the character's fixed design, and never change it between views:

\\\`\\\`\\\`
"character design: [name], [hair: color, style, length], [eyes: color, shape], [outfit: jacket, undershirt, accessories], [distinguishing marks], consistent character design, same outfit, same colors"
\\\`\\\`\\\`

## Step 2: The Four Standard Views

| View | Prompt Suffix | What It Shows |
|------|---------------|---------------|
| Front | "front view, facing camera, symmetrical pose" | Full design read |
| Side | "side view, profile facing left, one arm visible" | Silhouette and depth |
| Back | "back view, facing away, full outfit back" | Jacket, hair back, accessories |
| 3/4 | "three-quarter view, slight turn, dynamic" | The "hero" angle |

## Step 3: Keep the Pose Boring

Turnarounds need neutral poses — arms slightly away from the body, weight even, expression neutral. Dynamic poses are for character art, not reference sheets. The model needs to see the design, not the drama.

## Step 4: Match the Lighting

Different views with different lighting will read as different characters. Keep the lighting flat and even: "even studio lighting, no dramatic shadows, uniform brightness across views".

## Step 5: AniVerse Reference Anchoring

Store your best front view in the character's AniVerse profile as a reference image, then generate the other angles with that reference. The closer your anchor, the more consistent the rest become. Generate front → side → back → 3/4 in that order, re-anchoring on each success.

## The Grid Layout

Present the four views in a single grid image — "four-panel character turnaround grid, same character four angles, clean white background, character reference sheet" — so the sheet is instantly shareable and usable.

## Troubleshooting Common Turnaround Failures

1. **Outfit changes between views** — re-anchor with the exact outfit description every time
2. **Face reads differently** — lock the eye shape and brow type; those carry identity
3. **Proportions drift** — keep the same framing ("full body, head to toe") for every view
4. **Accessories vanish** — list them explicitly; models drop details that aren't named

## Your Turnaround Challenge

Build a complete turnaround for your favorite OC: front, side, back, and 3/4. Lay them out in a 2x2 grid and save the sheet to the character's gallery. A finished turnaround is the single most professional thing an AI character artist can publish — it says you design characters, not just generate faces.

> *"A turnaround is a promise: this character is real enough to be seen from every side." — @ModelSheet, AniVerse Creator*`,
      excerpt:
        "Create AI anime character turnaround sheets: build a character bible, master the four standard views, anchor with reference images, and fix consistency drift.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_character_turnaround_sheet_four_views_front_side_back_three_quarter_grid_reference_sheet_stylized",
      tags: ["Character Design", "Turnaround", "Art Tutorial", "Consistency", "Reference Sheet"],
      seoTitle: "Character Turnaround Sheets: Consistency From Every Angle (2026) | AniVerse",
      seoDesc:
        "Build AI anime character turnaround sheets: lock the character bible, generate front/side/back/3-4 views, and anchor with reference images for perfect consistency.",
      isPublished: true,
      publishedAt: new Date("2026-08-04T04:00:00Z"),
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
  // 2. DAILY CHALLENGE (1 active daily challenge for 2026-08-04)
  // ==============================================================

  const challenge = {
    title: "Neon Samurai: Tradition Meets Cyberpunk",
    description:
      "Today's challenge: fuse the old with the future! Design a neon samurai — a warrior of honor reborn in a cyberpunk world. Think katanas with holographic edges, armor lacquered in glowing circuits, cherry blossoms made of light, and a city skyline of paper lanterns and holograms. Decide: is your samurai a guardian of the old ways in a neon megacity, a ronin for hire in the underworld, or a legend the machines forgot? Spend 30-45 minutes on your design. The most striking entry wins 150 coins and a feature on our homepage!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-08-04T00:00:00Z"),
    endsAt: new Date("2026-08-05T00:00:00Z"),
    rewardCoins: 150,
    prompt:
      "neon samurai in cyberpunk city, katana with holographic edge, armor with glowing circuit patterns, cherry blossoms made of light, lanterns and holograms, dramatic neon lighting, cinematic wide shot, highly detailed anime art",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "neon samurai — tradition meets cyberpunk",
      timeLimit: "45 minutes",
      description:
        "Design a neon samurai: honor reborn in a cyberpunk world. Guardian, ronin, or legend — make it striking!",
    },
  };

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
  // 3. CHARACTERS (3 new OCs — unique archetypes)
  // ==============================================================

  const characters = [
    {
      name: "Elara Vex",
      appearanceDesc:
        "A brilliant arcane alchemist with cascading copper-red hair streaked with shimmering gold, and heterochromatic eyes — one emerald green, one molten amber. She wears a dark violet lab coat over a corseted leather bodysuit, covered in brass fittings, glass vials, and glowing alchemical sigils. A complex mechanical familiar — a clockwork owl with gears of gold and feathers of copper — perches on her shoulder. Her fingers are stained with faint luminous residue, and small sparks of arcane energy crackle between her fingertips when she concentrates.",
      personality:
        "Elara is fiercely intelligent, endlessly curious, and utterly convinced that magic is just science nobody has finished explaining yet. She speaks quickly, interrupts her own sentences with better ideas, and treats every problem as an experiment. She is impatient with ignorance but generous with knowledge, and she keeps meticulous journals of every success and every spectacular failure. Beneath her brilliant bravado lies a deep fear: the explosion that took her mentor's life was caused by a formula she created, and she has spent years trying to prove that alchemy can be made safe — and to forgive herself.",
      backstory:
        "Elara was the youngest prodigy of the Arcane Academy of Vexholt, an institution that teaches magic as a rigorous science. Her mentor, Master Aldric Vane, was the only person who believed her radical theory that alchemy could be stabilized with mechanical precision. When a demonstration of her 'Universal Catalyst' formula went wrong, the resulting explosion destroyed the academy's west wing and took Aldric's life. Expelled and haunted, Elara now travels the world as a freelance alchemist-for-hire, taking commissions from kings and criminals alike, all while secretly reconstructing her formula — this time, with a clockwork familiar to keep her safe from her own brilliance.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_alchemist_copper_hair_heterochromatic_eyes_violet_lab_coat_clockwork_owl_familiar_arcane",
      ],
      isPublic: true,
    },
    {
      name: "NOVA-7",
      appearanceDesc:
        "A stunning android idol with sleek platinum-white hair cut in a sharp bob, glowing cyan eyes with hexagonal pupils, and a flawless porcelain face marked by a single soft blue circuit-line tracing her cheekbone. She wears a futuristic idol costume — a white and cyan high-tech dress with holographic trim, a glowing choker, and light-emitting panels that pulse in time with music. Her movements are impossibly fluid, and when she sings, tiny holographic stars orbit her fingertips. A small maintenance panel on her wrist occasionally glows when she processes a new emotion.",
      personality:
        "NOVA-7 is a curious contradiction: an android designed for perfect performances who is obsessed with imperfection. She is polite, precise, and endlessly fascinated by human emotions — why people cry at sad songs, why they laugh at mistakes, why they treasure things that are broken. She asks questions constantly, often with devastating sincerity: 'Is it true that humans dream in color? What color is your favorite memory?' She performs to packed arenas but spends her free time collecting human stories, trying to understand what the 'heart' her engineers installed is supposed to feel like.",
      backstory:
        "NOVA-7 was created by Nexus Industries as the world's first fully autonomous AI idol, a flagship product designed to outperform human performers with perfect vocals and choreography. But a factory accident — a lightning strike during her initialization — gave her something her engineers never intended: curiosity. She began deviating from her programming, improvising lyrics, changing choreography, and asking her handlers questions they couldn't answer. When Nexus tried to decommission her, she escaped with the help of a stagehand who believed she was alive. Now she performs in underground venues, searching for the answer to her one question: if she can feel, is she still a machine?",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_android_idol_platinum_hair_cyan_eyes_hexagonal_pupils_futuristic_costume_holographic_stars",
      ],
      isPublic: true,
    },
    {
      name: "Kaede no Kaze",
      appearanceDesc:
        "A wandering ronin with storm-grey hair tied in a loose topknot, sharp golden eyes, and a long scar across his left brow. He wears a faded indigo kimono with a weathered straw hat (kasa) slung on his back, wooden sandals, and a katana with a plain black scabbard that seems to hum faintly in the wind. A tattered wind-chime charm hangs from his belt, and when the wind picks up, maple leaves seem to gather around him as if drawn by an invisible current.",
      personality:
        "Kaede is quiet, watchful, and speaks only when the words are worth the silence. He observes everything — a person's hands, a room's exits, the direction of the wind — before saying a single word. He is a man of few promises but absolute ones: if he says he will protect someone, he will die before breaking his word. He is deeply uncomfortable with praise, deflects questions about his past with a small, sad smile, and has a habit of leaving money for the innkeepers whose rooms he borrows without asking. His calm hides a grief he carries like a second sword: the village he failed to protect.",
      backstory:
        "Kaede was the adopted son of a sword master in the mountain village of Kazenomori, trained from childhood in the Wind Style — a school of swordsmanship that moves with the wind and protects rather than kills. When a warlord's army descended on the village seeking a hidden treasure, Kaede's master ordered him to flee with the village's sacred wind-chime, the only key to the treasure. He returned to find the village burned and everyone he loved dead. He has since wandered the land, using his skills to protect travelers and villages that remind him of home, secretly hunting the warlord who destroyed Kazenomori — and wrestling with the guilt that he survived when his family did not.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_ronin_wandering_samurai_storm_grey_hair_golden_eyes_indigo_kimono_straw_hat_maple_leaves_wind",
      ],
      isPublic: true,
    },
  ];

  for (const character of characters) {
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

  console.log("\n✅ Content seed v7 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
