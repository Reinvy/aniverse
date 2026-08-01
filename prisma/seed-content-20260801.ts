/**
 * AniVerse — Dynamic Content Seed (2026-08-01)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (creator licensing, composition, worldbuilding)
 * - 1 Daily Challenge (retro-future metropolis)
 * - 3 New Characters (unique archetypes)
 *
 * Run: npx tsx prisma/seed-content-20260801.ts
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
  console.log("🌱 Starting AniVerse content seed v4 (2026-08-01)...\n");

  const admin = await getOrCreateAdminUser();
  console.log(`✅ Admin user: ${admin.name} (${admin.id})`);

  // ==============================================================
  // 1. BLOG ARTICLES (3 SEO-optimized — licensing, composition, worldbuilding)
  // ==============================================================

  const articles = [
    {
      title: "AI Art Licensing: What Every AniVerse Creator Needs to Know in 2026",
      slug: "ai-art-licensing-guide-creators-2026",
      content: `# AI Art Licensing: What Every AniVerse Creator Needs to Know in 2026

AI art is booming, and with it comes a whole new set of questions about ownership, licensing, and commercial use. Whether you're selling prints, taking commissions, or building a brand around your AI-generated characters, understanding licensing basics protects your work and your income.

## Why Licensing Matters for AI Artists

When you generate art with AniVerse, you become the steward of that creation. Licensing determines:

- **Who can use your art** — you, your clients, or the whole world
- **What they can do with it** — personal display, commercial sale, merchandise
- **How you get paid** — one-time fees, royalties, or exclusive buyouts

Creators who understand licensing earn more and sleep better. Creators who ignore it risk losing their work to unauthorized use.

## The Three Core Licenses You'll Use

### 1. Personal Use License (Free)

What it means:
- The buyer can display the art privately or on social media
- No commercial use, no resale, no merchandise
- You retain full ownership and can license it again

**Best for:** portfolio pieces, fan art, gifts.

### 2. Commercial License (Standard)

What it means:
- The buyer can use the art in business contexts: ads, thumbnails, product labels
- Usually limited to a specific medium or use case
- You can still license the same art to others for different uses

**Best for:** YouTubers, streamers, small business branding.

### 3. Exclusive Buyout (Premium)

What it means:
- The buyer owns all rights to the art for a defined period or forever
- You agree not to license it to anyone else
- Typically 3-5x the price of a standard commercial license

**Best for:** major brands, video games, book covers that need uniqueness.

## How to Price Licenses

A simple pricing ladder that works for most AniVerse creators:

| License Type | Price Multiplier | Example (base $50) |
|--------------|-----------------|-------------------|
| Personal Use | 1x | $50 |
| Commercial (single use) | 2-3x | $100–$150 |
| Commercial (unlimited) | 4-5x | $200–$250 |
| Exclusive Buyout | 8-10x | $400–$500 |

Adjust the base price based on your skill level, character popularity, and market demand.

## Writing a Simple License Agreement

You don't need a lawyer for every commission, but you DO need a written agreement. Here's a minimal template:

\\\`\\\`\\\`
LICENSE AGREEMENT
Client: [Name]
Artwork: [Title / File]
License Type: [Personal / Commercial / Exclusive]

1. The artist grants the client the rights described above.
2. The client may not resell, sublicense, or claim authorship.
3. The artist retains the right to display the work in their portfolio.
4. Payment terms: 50% upfront, 50% on delivery.
\\\`\\\`\\\`

## Common Licensing Mistakes

1. **Selling the same exclusive license twice** — track your exclusives in a spreadsheet or use AniVerse's marketplace records.
2. **Not specifying the medium** — "commercial use" is vague. Say *which* commercial use: "YouTube thumbnails" vs "all media".
3. **Forgetting AI disclosure** — many marketplaces now require labeling AI-assisted work. Be transparent with buyers.
4. **Undervaluing exclusivity** — an exclusive buyout removes a revenue stream; price it accordingly.

## AniVerse + Licensing: A Creator-Friendly Flow

AniVerse's marketplace lets you:

- List artwork as **prints**, **digital downloads**, or **commission slots**
- Set your own prices and license terms per listing
- Track orders and manage buyer communication in one dashboard

**Pro tip:** Add your license terms to each product description. Buyers who understand your terms are happier clients.

## Final Checklist Before You Sell

- [ ] Written agreement for every commission
- [ ] License type clearly stated in the listing
- [ ] AI-assisted disclosure where required
- [ ] Price reflects the rights you're granting
- [ ] Exclusives tracked so you never double-sell

> *"Licensing isn't legal homework — it's the difference between a hobby and a business. Nail it down and your art pays you properly." — @NovaInk, AniVerse Marketplace Creator*`,
      excerpt:
        "Understand AI art licensing in 2026: personal vs commercial vs exclusive licenses, pricing ladders, and a simple agreement template to protect your AI-generated work.",
      coverImage:
        "https://image.pollinations.ai/prompt/ai_art_licensing_contract_document_anime_style_stylized_legal_agreement_pen",
      tags: ["Licensing", "Creator Economy", "Business", "Legal Basics", "Selling Art"],
      seoTitle: "AI Art Licensing Guide for Creators (2026) | AniVerse",
      seoDesc:
        "Learn AI art licensing essentials: personal, commercial, and exclusive licenses, pricing strategies, and a ready-to-use agreement template for AniVerse creators.",
      isPublished: true,
      publishedAt: new Date("2026-08-01T00:00:00Z"),
    },
    {
      title: "Dynamic Poses and Composition: Level Up Your AI Anime Art",
      slug: "dynamic-poses-composition-guide-ai-2026",
      content: `# Dynamic Poses and Composition: Level Up Your AI Anime Art

Flat, static images are the #1 sign of beginner AI art. The good news? You don't need a degree in anatomy to create dynamic, professional-looking anime art — you need to understand a few composition rules and learn how to *prompt for movement*.

## What Makes an Image Feel Dynamic?

Dynamic images share three qualities:

1. **Energy** — the subject feels like it's mid-action, not posing for a photo
2. **Flow** — the viewer's eye moves naturally through the image
3. **Depth** — foreground, midground, and background create a 3D feel

Let's break down how to achieve each one with AI prompts.

## Rule 1: Use Diagonal Lines

Static compositions are horizontal and vertical. Dynamic compositions are **diagonal**.

### In your prompt:
\\\`\\\`\\\`
"anime swordsman mid-leap, diagonal motion lines, dynamic action pose, dramatic angle"
\\\`\\\`\\\`

### Why it works:
Diagonals create tension. The eye follows the line of action — the invisible line from the character's head through their center of gravity to their extended limb.

## Rule 2: The Rule of Thirds

Place your subject at the intersection points of an imaginary 3x3 grid rather than dead center.

### In your prompt:
\\\`\\\`\\\`
"anime girl archer on the right third of frame, aiming left, negative space on the left, rule of thirds composition"
\\\`\\\`\\\`

### Why it works:
Off-center subjects leave room for action. The empty space becomes the direction the character is looking or moving — the viewer's imagination fills it.

## Rule 3: Add Motion Effects

AI models respond beautifully to motion vocabulary:

| Motion Keyword | Effect |
|----------------|--------|
| \\\`motion blur\\\` | Speed lines, trailing afterimages |
| \\\`wind-blown\\\` | Hair, cape, and fabric flowing |
| \\\`dynamic angle\\\` | Dramatic low or high camera angles |
| \\\`action lines\\\` | Speed streaks behind the subject |
| \\\`particle effects\\\` | Dust, sparks, petals in motion |

**Example combination:**
\\\`\\\`\\\`
"anime martial artist kicking, wind-blown hair, motion blur on limbs, action lines, dynamic low angle, particle effects, dramatic lighting"
\\\`\\\`\\\`

## Rule 4: Foreground Elements Create Depth

A dynamic image isn't just about the subject — it's about the world around them.

### In your prompt:
\\\`\\\`\\\`
"anime runner in a city street, blurred foreground pillars, detailed midground buildings, hazy background skyline, depth of field"
\\\`\\\`\\\`

### Why it works:
Layered depth tells the eye where to look. Foreground elements also frame the subject and make the scene feel alive.

## Rule 5: Break Symmetry on Purpose

Symmetry is powerful for calm, majestic shots. For action, **asymmetry** is your friend.

- Asymmetric poses feel like movement
- Asymmetric lighting (one side bright, one side shadowed) creates drama
- Asymmetric framing leaves room for the action to travel

## Common Composition Mistakes

1. **Subject always dead center** — try the thirds grid
2. **No sense of direction** — decide where the character is going and leave space for it
3. **Everything in focus** — use \\\`depth of field\\\`, \\\`bokeh\\\`, \\\`background blur\\\`
4. **Static poses** — add \\\`mid-action\\\`, \\\`in motion\\\`, \\\`dynamic pose\\\` to prompts

## Practice Drills (10 Minutes Each)

**Drill 1:** Generate the same character in 5 poses: walking, running, jumping, dodging, attacking. Compare which feels most alive.

**Drill 2:** Take one action prompt and add each motion keyword from the table above. Note how each changes the feel.

**Drill 3:** Generate the same scene with the subject at center vs. rule-of-thirds. Which composition tells a better story?

## From Good to Great

Dynamic composition is the fastest way to make your AI art look intentional rather than generated. Master these five rules and your gallery will stand out in any feed.

> *"The difference between my first month and my third month of AI art was composition. I stopped prompting for 'an anime girl' and started prompting for 'a story happening.' Everything changed." — @StudioMiso, AniVerse Creator*`,
      excerpt:
        "Learn 5 composition rules that make AI anime art look dynamic and professional: diagonal lines, rule of thirds, motion effects, depth layers, and purposeful asymmetry.",
      coverImage:
        "https://image.pollinations.ai/prompt/dynamic_anime_action_pose_composition_sketch_lines_motion_energy_stylized",
      tags: ["Composition", "Art Tutorial", "Dynamic Poses", "Prompt Engineering", "Technique"],
      seoTitle: "Dynamic Poses & Composition for AI Anime Art (2026) | AniVerse",
      seoDesc:
        "Master dynamic composition in AI anime art. Learn diagonal lines, rule of thirds, motion keywords, and depth techniques to make your generations look professional.",
      isPublished: true,
      publishedAt: new Date("2026-08-01T02:00:00Z"),
    },
    {
      title: "Building an Original Character Universe: Worldbuilding with AniVerse",
      slug: "original-character-universe-worldbuilding-2026",
      content: `# Building an Original Character Universe: Worldbuilding with AniVerse

Every memorable anime franchise has one thing in common: a world you want to live in. As an AniVerse creator, you have a superpower — you can visualize that world in minutes. This guide shows you how to build a connected universe of characters, locations, and stories that fans will follow.

## Start With the World, Not the Hero

New creators usually design a character first. Worldbuilders do the opposite: they design a world and let characters emerge from it.

### The Worldbuilding Questions

Answer these before designing anyone:

1. **Where does this world exist?** — A cyberpunk Tokyo? A floating sky kingdom? A post-magic desert?
2. **What is the central conflict?** — A resource war? A class divide? An ancient prophecy?
3. **What is the tone?** — Hopeful adventure, gritty noir, or cozy slice-of-life?
4. **What rules does magic/tech follow?** — Can anyone use it? What's the cost?

## Create a Visual Mood Board

With AniVerse, your mood board generates itself:

\\\`\\\`\\\`
"cyberpunk city market street at night, neon signs, rain-slicked pavement, holographic advertisements, bustling crowd, cinematic wide shot"
\\\`\\\`\\\`

Generate 5-10 environment images and pick the ones that feel right. These become your **canon references** — every character and scene you create should feel like it belongs in these images.

## Design Characters That Belong

Your characters should look like they live in your world.

### Consistency Checklist

- **Palette:** Do their colors match the world's vibe? (Neon accents for cyberpunk, earth tones for fantasy)
- **Clothing:** Does their outfit reflect the world's tech/magic level?
- **Roles:** What job or position do they hold in this world?
- **Conflict:** How does the world's central conflict touch their life?

### Example: The Sky Kingdom

| Character | Role | Visual Hook |
|-----------|------|-------------|
| **Aria Vane** | Cloud-sailor | Wind-whipped teal scarf, brass goggles |
| **Kael Stonehelm** | Ground-born refugee | Dusty brown coat, patchwork gear |
| **The Kite King** | Ruler | Silk robes patterned with constellation maps |

Three characters, one world, zero effort to see them as neighbors.

## Use the Character System for Consistency

AniVerse's character profiles store appearance, personality, and backstory. Use them:

1. **Create the character** with full appearance details
2. **Attach reference images** from your best generations
3. **Reuse the character** across scenes, poses, and expressions
4. **Keep the palette consistent** by mentioning their signature colors in every prompt

## Build Lore That Compounds

Small details make worlds feel real. Keep a lore file (or a series of blog posts!) with:

- **History:** One defining event that shaped the world
- **Geography:** 3-5 named locations with one-line descriptions
- **Factions:** Two or three groups with competing goals
- **Magic/Tech rules:** Three hard rules, one mysterious exception
- **Traditions:** One holiday, one ritual, one superstition

## From Universe to Audience

Here's how to turn your world into a following:

1. **Publish character profiles** — fans love discovering well-designed OCs
2. **Post scene stories** — pair images with short captions or flash fiction
3. **Run challenges** — invite the community to draw your world's characters
4. **Start a series** — a weekly "day in the life" in your universe builds anticipation

## The Worldbuilding Prompt Library

Save these prompts for your next universe:

\\\`\\\`\\\`
Environment: "wide establishing shot of [location], [weather], [time of day], [mood], cinematic composition"
Character: "[name], [role] in [world], [signature clothing], [palette], [pose], [expression], consistent character design"
Item: "[object] from [world], [materials], [engraving/decoration], [wear and tear], close-up detail shot"
\\\`\\\`\\\`

## Your Universe Awaits

The best time to start building was yesterday. The second best time is now. Open AniVerse, generate your first environment, and let your world grow one image at a time.

> *"I started with one character and a mood board. Two months later I had a 12-page lore bible and 40,000 followers who argue about my world's magic system in the comments. Worldbuilding is the ultimate engagement strategy." — @Worldsmith, AniVerse Creator*`,
      excerpt:
        "Learn how to build a connected original character universe with AniVerse: world-first design, mood boards, character consistency, lore building, and audience growth.",
      coverImage:
        "https://image.pollinations.ai/prompt/worldbuilding_fantasy_sky_kingdom_map_anime_style_lore_universe_creative_stylized",
      tags: ["Worldbuilding", "Character Design", "OC Creation", "Creative Process", "Community"],
      seoTitle: "Original Character Universe: Worldbuilding Guide (2026) | AniVerse",
      seoDesc:
        "Build an original character universe with AniVerse. Learn world-first design, visual mood boards, character consistency, and lore building that grows your audience.",
      isPublished: true,
      publishedAt: new Date("2026-08-01T04:00:00Z"),
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
  // 2. DAILY CHALLENGE (1 active daily challenge)
  // ==============================================================

  const challenge = {
    title: "Retro-Future City: Design a Vintage Sci-Fi Metropolis",
    description:
      "Today's challenge: design a retro-future metropolis — a city that mixes vintage sci-fi aesthetics (art deco, chrome, cassette futurism) with futuristic elements! Think 1980s sci-fi movie posters, chrome towers, flying cars with neon trails, and moody synthwave skies. Will your city be a gleaming utopia or a rainy cyber-noir sprawl? Spend 30-45 minutes on your design. The most creative entry wins 150 coins and a feature on our homepage!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-08-01T00:00:00Z"),
    endsAt: new Date("2026-08-02T00:00:00Z"),
    rewardCoins: 150,
    prompt:
      "retro-future metropolis skyline, vintage sci-fi art deco chrome towers, synthwave sunset sky, flying cars with neon trails, cassette futurism, cinematic wide shot, detailed cityscape",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "retro-future metropolis",
      timeLimit: "45 minutes",
      description:
        "Design a vintage sci-fi city that blends retro aesthetics with futuristic elements. Chrome, neon, and moody skies welcome!",
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
      name: "Ren Kaguya",
      appearanceDesc:
        "A serene young woman in her early twenties with long, flowing hair that shimmers between pale silver and moonlight blue depending on the light. Her eyes are luminous gold with slit-like pupils, hinting at her celestial nature. She wears an elegant white and lavender miko-inspired robe embroidered with crescent moon patterns in silver thread, layered over a flowing kimono that seems to drift as if underwater. A glowing crescent-moon hairpin rests above her left ear, and a translucent veil of starlight trails behind her when she moves. Her bare feet never quite touch the ground, hovering a hair's breadth above it.",
      personality:
        "Ren is gentle, patient, and deeply contemplative — she speaks in soft measured tones and often pauses to look at the sky mid-conversation. She carries the weight of a thousand years of solitude with quiet grace. While outwardly serene, she has a mischievous streak: she loves mortal festivals, street food, and watching humans do delightfully illogical things. She is fiercely protective of those she considers under her care and will quietly manipulate events from the shadows to protect them. She struggles with loneliness and fears being forgotten, which drives her to leave small gifts and blessings for mortals who show her kindness.",
      backstory:
        "Ren is a moon deity who descended to the mortal realm a millennium ago when her shrine fell into ruin and she was forgotten. Unable to return to the celestial court, she wanders the earth as a guardian of dreamers and lost souls. She maintains a modest shrine in a hidden mountain valley, where she collects the dreams of sleeping mortals and weaves them into protective charms. Recently, she has sensed a growing darkness — a being that feeds on forgotten memories — and knows that her forgotten status makes her both vulnerable and uniquely suited to confront it. She seeks a mortal champion brave enough to help her restore her shrine and reclaim her name.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_moon_goddess_white_silver_hair_gold_eyes_miko_robe_crescent_moon_serene_ethereal_glowing",
      ],
      isPublic: true,
    },
    {
      name: "Blaze Okami",
      appearanceDesc:
        "A wild-looking young woman with a shock of fiery crimson hair streaked with black, styled into an untamed mane that flickers like a flame in the wind. Her eyes burn a molten amber and glow faintly in darkness. Twin wolf ears peek through her hair, and a long, bushy tail with a white tip swishes behind her. She wears a practical combat outfit: a sleeveless dark leather vest over a fitted black top, torn jeans, and sturdy boots caked with ash. Wraps of red cloth cover her forearms, singed at the edges from years of fire-wielding. When she fights, her hands ignite with orange flames that leave ember trails in the air.",
      personality:
        "Blaze is loud, impulsive, and endlessly energetic — she laughs easily, fights passionately, and hugs without warning. She's the first to charge into danger and the last to admit she's hurt. Beneath her boisterous exterior is a fiercely loyal heart: she treats her friends like pack, and woe to anyone who threatens them. She has a short temper and a shorter attention span, but when something truly matters to her, her focus becomes absolute. She struggles with her destructive power, afraid that one day her flames will hurt someone she loves.",
      backstory:
        "Blaze was born to the Okami clan, a lineage of fire-wielding wolf spirits sworn to protect the sacred flame that burns at the heart of Mount Hinode. As a child, she was a prodigy — her flames burned brighter than any in the clan's history. But during a rogue spirit attack, she lost control and accidentally burned down her own village, injuring her younger brother. Consumed by guilt, she left the mountain to wander the world, seeking to master her power and prove she can be a protector rather than a destroyer. She now works as a freelance monster-hunter, taking on jobs that let her protect others while searching for a way to fully control her inner blaze.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_fire_wolf_girl_crimson_hair_amber_eyes_wolf_ears_embers_flames_wild_energetic",
      ],
      isPublic: true,
    },
    {
      name: "Nyx Voltage",
      appearanceDesc:
        "An androgynous android with sleek, porcelain-white synthetic skin and short, choppy hair in an electric blue that shifts to violet at the tips. Their eyes are large and expressive, glowing soft cyan with hexagonal digital pupils that dilate with emotion. Visible seams along their jaw and neck reveal the advanced machinery beneath, with subtle circuit patterns glowing faintly along their collarbones and wrists. They wear a streamlined bodysuit in matte black with cyan accent lines that pulse gently with their internal power cycle. A cable tail-like appendage with a glowing connector tip extends from their lower back, and their fingertips crackle with tiny static discharges when they're excited or nervous.",
      personality:
        "Nyx is relentlessly curious and asks questions about everything — especially the strange human habits they find baffling, like why people cry at happy endings or eat food that's 'too spicy on purpose.' They process emotions with a literal-minded earnestness that is both endearing and unintentionally hilarious. Despite their android nature, Nyx feels deeply and worries constantly about being 'just a machine.' They are fiercely loyal, fiercely logical, and fiercely protective of their found family. They keep a meticulous journal of human idioms, misinterpret them joyfully, and dream of one day understanding what it means to truly feel.",
      backstory:
        "Nyx was created in a secret lab as a prototype 'empathy android' — designed to study human emotion by experiencing it. When the lab was destroyed in a corporate war, Nyx escaped with fragmented memories and a single mission directive: 'learn what it means to be human.' They now wander a post-industrial city, working odd jobs (delivery, repair, translation) to survive while collecting experiences. A mysterious data fragment buried in their core suggests their creator left them a message — and possibly a hidden purpose — waiting to be unlocked. Nyx searches for clues about their origin while building a life among the humans they were designed to understand.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_android_cyborg_blue_hair_cyan_eyes_circuit_patterns_sleek_futuristic_curious",
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

  console.log("\n✅ Content seed v4 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
