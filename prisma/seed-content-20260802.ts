/**
 * AniVerse — Dynamic Content Seed (2026-08-02)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (color theory, prompt chaining, creator branding)
 * - 1 Daily Challenge (midnight train neon voyage)
 * - 3 New Characters (unique archetypes)
 *
 * Run: npx tsx prisma/seed-content-20260802.ts
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
  console.log("🌱 Starting AniVerse content seed v5 (2026-08-02)...\n");

  const admin = await getOrCreateAdminUser();
  console.log(`✅ Admin user: ${admin.name} (${admin.id})`);

  // ==============================================================
  // 1. BLOG ARTICLES (3 SEO-optimized — color theory, prompt chaining, branding)
  // ==============================================================

  const articles = [
    {
      title: "Color Theory for AI Anime Art: Palettes That Pop in 2026",
      slug: "color-theory-ai-anime-art-palettes-2026",
      content: `# Color Theory for AI Anime Art: Palettes That Pop in 2026

The fastest way to make AI anime art look *expensive* is color. Two artists can generate the same character, and the one who understands palettes will win every engagement metric. Here's the color framework AniVerse's top creators use.

## Why Color Matters More Than Linework

In anime, color carries emotion before the viewer reads a single line of the story. A warm sunset palette says *nostalgia*. A cold blue-teal scheme says *isolation*. The AI already knows this — your job is to point it in the right direction.

## The 60-30-10 Rule for Anime Scenes

| Proportion | Role | Example |
|------------|------|---------|
| 60% | Dominant base color | Sky, walls, large surfaces |
| 30% | Secondary tone | Hair, clothing, props |
| 10% | Accent pop | Eyes, glowing elements, highlights |

In your prompt, state the dominant palette first, then the accent:

\`\`\`
"anime city rooftop at dusk, dominant indigo and violet palette, teal neon accents, warm golden rim light, cinematic color grading"
\`\`\`

## Complementary Palettes That Scream "Anime"

1. **Orange × Teal** — the classic blockbuster pairing. Warm character, cool background. Works for almost any action scene.
2. **Magenta × Cyan** — the synthwave signature. Perfect for cyberpunk and retro-future worlds.
3. **Gold × Navy** — luxury and mystery. Great for fantasy royalty, magical girls, and celestial themes.
4. **Sakura Pink × Mint** — soft, dreamy, romantic. Slice-of-life and romance scenes.

## The Power of One Saturated Accent

A common beginner mistake: every color is equally bright. Professional anime art usually keeps 80% of the frame muted and lets ONE element glow:

\`\`\`
"anime girl in muted gray classroom, single crimson ribbon glowing, desaturated background, vibrant red accent, dramatic contrast"
\`\`\`

## Mood Palettes Quick Reference

| Mood | Palette Keywords |
|------|------------------|
| Melancholy | desaturated blue, overcast, cool shadows |
| Hope | pastel dawn, soft pink, warm white |
| Danger | deep red, black, harsh orange highlights |
| Magic | violet, starfield blue, shimmering gold |
| Calm | sage green, soft beige, gentle gradients |

## Color Names AI Models Understand

Instead of "pretty colors," use specific, evocative terms: *mauve*, *teal*, *indigo*, *vermilion*, *chartreuse*, *periwinkle*. Models trained on art datasets respond better to painterly vocabulary.

## Practice: Recolor One Character

Take your favorite character and generate them in 4 palettes: sunset, cyberpunk, forest, and monochrome. Note how each recolor changes the *story* the image tells. This is the single best color exercise for AI artists.

## Your Color Checklist

- [ ] One dominant palette stated first in the prompt
- [ ] Accent color limited to 10% of the frame
- [ ] Background contrast chosen deliberately (not accidental)
- [ ] Specific color names, not vague "colorful"
- [ ] Mood matched to scene intention

> *"Color is the cheapest special effect in AI art. One deliberate palette choice does more work than twenty fancy prompt keywords." — @HueForge, AniVerse Creator*`,
      excerpt:
        "Master color theory for AI anime art: the 60-30-10 rule, complementary palettes, one-accent contrast, and a mood palette reference for prompts that pop.",
      coverImage:
        "https://image.pollinations.ai/prompt/color_theory_anime_art_palette_swatches_vibrant_hue_wheel_teal_orange_gold_cyan_stylized",
      tags: ["Color Theory", "Art Tutorial", "Prompt Engineering", "Technique", "Design"],
      seoTitle: "Color Theory for AI Anime Art: Palettes That Pop (2026) | AniVerse",
      seoDesc:
        "Learn anime color theory for AI art: the 60-30-10 rule, complementary palettes, accent contrast, and mood-based color keywords for stunning generations.",
      isPublished: true,
      publishedAt: new Date("2026-08-02T00:00:00Z"),
    },
    {
      title: "AI Prompt Chaining: Direct Scenes Like a Storyboard Artist",
      slug: "ai-prompt-chaining-storyboard-scenes-2026",
      content: `# AI Prompt Chaining: Direct Scenes Like a Storyboard Artist

One image is a drawing. Five connected images are a *story*. Prompt chaining — the art of generating a sequence of consistent scenes — is what separates casual AI users from creators who build worlds. Here's how to chain prompts like a storyboard artist.

## What Is Prompt Chaining?

Prompt chaining means reusing a stable core (character, setting, style) across multiple generations while changing only the *situation*. The result is a series of images that feel like frames from the same anime episode.

## Step 1: Lock Your Character DNA

Before chaining, create a reusable character block:

\`\`\`
"character: [name], silver hair, gold eyes, black-and-red jacket, scar over left eyebrow, consistent character design"
\`\`\`

AniVerse's character system stores this for you — appearance, reference images, and signature details. Once locked, every prompt can reference the same character profile.

## Step 2: Build the Scene Matrix

Decide your story beats first, then prompt each beat:

| Beat | Situation | Mood Keyword |
|------|-----------|--------------|
| 1. Introduction | character walking into rain | quiet, establishing shot |
| 2. Conflict | character facing a rival | tense, low angle |
| 3. Climax | character unleashing power | explosive, dynamic |
| 4. Resolution | character looking at dawn | peaceful, wide shot |

## Step 3: Chain With a Consistent Style Suffix

Add the same style signature to every prompt:

\`\`\`
"..., anime key visual style, cel shading, dramatic lighting, high detail, cinematic composition"
\`\`\`

Consistency comes from repetition. Change the scene, never the style block.

## The Rule of Three Prompts

When you find a frame you love, immediately generate:
1. **The same frame, wider shot** — establishes location
2. **The same frame, close-up** — captures emotion
3. **The same frame, 10 seconds later** — advances the action

## Transitions That Feel Cinematic

Storyboard artists think in transitions. Prompt for them explicitly:
- **Match cut:** "same composition, different location"
- **Zoom in:** "extreme close-up of eyes, same lighting"
- **Reveal:** "wide shot revealing [surprise element], scale contrast"

## Use AniVerse Galleries as Your Storyboard

Save each chain as a Gallery: one gallery = one scene sequence. Name it like an episode (e.g., "EP03 — The Rooftop Duel"). You'll build a library of reusable cinematic moments.

## Common Chaining Mistakes

1. **Changing style mid-chain** — lock one style block and never vary it
2. **Losing the character** — always paste the full character DNA
3. **No mood continuity** — keep lighting and time-of-day consistent unless the story demands change
4. **Skipping the middle frames** — the most emotional shots are often the in-between ones

## Your First Chain Challenge

Create a 5-frame sequence today: a character wakes up → leaves home → faces a problem → overcomes it → looks to the horizon. One character, one style, five moods. Post the chain to your gallery and watch how much more engaging it is than a single image.

> *"A single image gets a like. A five-frame chain gets a follow. Chaining is the difference between posting art and telling stories." — @FrameByFrame, AniVerse Creator*`,
      excerpt:
        "Learn AI prompt chaining: lock character DNA, build a scene matrix, use consistent style suffixes, and create cinematic 5-frame sequences like a storyboard artist.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_storyboard_frames_sequence_character_consistent_scenes_cinematic_film_strip_stylized",
      tags: ["Prompt Engineering", "Storytelling", "Art Tutorial", "Cinematic", "Technique"],
      seoTitle: "AI Prompt Chaining: Storyboard Scenes Like a Pro (2026) | AniVerse",
      seoDesc:
        "Master AI prompt chaining for anime art. Lock character DNA, chain scenes with consistent style, and build cinematic story sequences in AniVerse galleries.",
      isPublished: true,
      publishedAt: new Date("2026-08-02T02:00:00Z"),
    },
    {
      title: "From Hobby to Brand: Building a Creator Identity on AniVerse",
      slug: "ai-artist-brand-building-creator-identity-2026",
      content: `# From Hobby to Brand: Building a Creator Identity on AniVerse

You've been generating anime art for weeks. Your gallery is filling up. Now what? If you want followers, commissions, and maybe even income, you need something AI can't generate for you: an identity. Here's how to build a creator brand on AniVerse.

## Why Branding Beats Raw Skill

The AI art space is crowded — anyone can generate a pretty anime girl. What they can't copy is *your taste*: the worlds you build, the characters you design, the stories you tell. A brand is simply your taste, made visible and consistent.

## Step 1: Define Your Signature

Answer three questions:
1. **What do you make?** (e.g., cyberpunk OCs, cozy fantasy landscapes, dynamic action shots)
2. **Who is it for?** (e.g., webtoon readers, RPG players, character designers)
3. **What feeling does it give?** (e.g., melancholic, epic, wholesome)

Your answers become a one-line pitch: *"I design melancholic cyberpunk OCs for sci-fi storytellers."*

## Step 2: Build a Consistent Visual Voice

- **Palette:** stick to 2-3 signature colors across your posts
- **Style:** one rendering style (cel-shaded, watercolor, gritty) — consistency builds recognition
- **Format:** use a signature composition or watermark placement

## Step 3: Package Your Characters

Your OCs are your IP. Treat them like a cast:
- Give each character a **profile page** with full appearance + personality + backstory
- Generate **reference sheets** (front, side, expressions)
- Name your characters — named characters get remembered

## Step 4: Publish With a Cadence

Consistency beats intensity:
- **2-3 posts per week**, at the same time
- Pair art with **short captions or micro-fiction** — a story hook makes people stop scrolling
- Use **hashtags consistently** (e.g., #aniverse #aianime #originalcharacter)

## Step 5: Engage Like a Creator, Not a Bot

- Reply to every comment with substance
- **Run your own challenge** to invite community participation
- Join AniVerse's daily challenges — they're the fastest way to get discovered
- Follow 5 creators whose work you admire and leave thoughtful feedback

## Turning Brand Into Income

Once you have 100+ consistent followers:
1. Open **commission slots** with clear pricing and license terms
2. List **prints and digital downloads** in the marketplace
3. Offer **character design packages** (3 views + palette sheet)
4. Consider a **premium tier** for early access to your worldbuilding

## The Creator Brand Checklist

- [ ] One-line pitch written down
- [ ] Signature palette chosen
- [ ] 3+ named OCs with profiles
- [ ] Posting cadence set (day + time)
- [ ] Profile bio updated with your pitch
- [ ] First commission listing live

## Start Today

Your brand doesn't need a logo or a fancy handle. It needs one honest answer: *what do I make that no one else makes the same way?* Answer that, and post it — the algorithm rewards clarity.

> *"I spent my first month posting random pretty images. My second month, I posted one consistent world — my followers tripled. Consistency is the cheat code." — @NebulaWorks, AniVerse Creator*`,
      excerpt:
        "Turn AI art from hobby to brand: define your signature, build a visual voice, package your OCs, publish with cadence, and convert followers into commissions.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_creator_brand_identity_personal_branding_artist_studio_logo_lightbulb_stylized",
      tags: ["Creator Economy", "Branding", "Career", "Community", "Growth"],
      seoTitle: "From Hobby to Brand: Creator Identity Guide (2026) | AniVerse",
      seoDesc:
        "Build a creator brand on AniVerse: define your signature style, package original characters, publish with cadence, and turn followers into commissions.",
      isPublished: true,
      publishedAt: new Date("2026-08-02T04:00:00Z"),
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
  // 2. DAILY CHALLENGE (1 active daily challenge for 2026-08-02)
  // ==============================================================

  const challenge = {
    title: "Midnight Train: A Neon Voyage",
    description:
      "Tonight's challenge: design a midnight train journey through a neon-lit world! Create a scene aboard (or approaching) a sleek train racing through a glowing nightscape — think neon city tunnels, bioluminescent forests, star-swept plains, or a sky-rail above storm clouds. Decide: is your train a luxury express, a ghost train, or a rebel smuggling vessel? Spend 30-45 minutes on your design. The most atmospheric entry wins 150 coins and a feature on our homepage!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-08-02T00:00:00Z"),
    endsAt: new Date("2026-08-03T00:00:00Z"),
    rewardCoins: 150,
    prompt:
      "midnight train journey, sleek futuristic rail car racing through neon city tunnel, glowing window lights, motion blur streaks, bioluminescent night landscape, cinematic wide shot, atmospheric lighting, detailed anime background",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "midnight train neon voyage",
      timeLimit: "45 minutes",
      description:
        "Design a memorable midnight train scene — inside, outside, or approaching the train. Neon, moonlight, and motion welcome!",
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
      name: "Sora Matsuri",
      appearanceDesc:
        "A luminous festival spirit girl with long, translucent aqua hair that drifts like silk ribbons in an unseen breeze, dotted with tiny glowing paper lanterns that float around her. Her eyes are warm honey-amber, flecked with gold like festival fireworks. She wears a layered yukata in shifting sunset colors — coral, gold, and deep indigo — with an obi sash of woven light. Tiny festival masks (fox, kitsune, and hannya) hang from her sash, and her bare feet leave faint sparkling footprints. When she smiles, scattered confetti of light drifts from her hair.",
      personality:
        "Sora is pure, infectious joy — she laughs easily, hums festival songs, and treats every stranger as a friend she hasn't celebrated with yet. She is endlessly curious about mortal customs and finds profound meaning in small traditions: a paper lantern released, a prayer written on an ema, a first bite of festival food. Beneath her bubbly exterior, she carries a quiet melancholy — she is the spirit of a festival that no longer exists, and she fears the day no one remembers it. She collects memories and moments, storing them in her lanterns, and offers them to those who seem lost or lonely.",
      backstory:
        "Sora was born from the joy of a summer festival held a thousand years ago in a village that has long since been swallowed by a great forest. When the festival ended for the last time, her spirit remained, bound to the memory of the celebration. She now wanders the world, drawn to any place where people gather to celebrate — reappearing at festivals, carnivals, and lantern ceremonies. She has begun to notice that the modern world's festivals are fewer and quieter, and a shadowy force that feeds on forgotten joy has started hunting the last festival spirits. Sora seeks a companion who can help her keep the world's celebrations alive — and perhaps help her remember her own origin before the final lantern fades.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_festival_spirit_girl_aqua_hair_glowing_lanterns_yukata_sunset_colors_joyful_magical",
      ],
      isPublic: true,
    },
    {
      name: "Kurogane Rei",
      appearanceDesc:
        "A stern, battle-worn cyber-samurai with close-cropped steel-gray hair and a single vivid crimson streak. His face bears a thin scar across his right eye, which glows faintly cyan from a cybernetic implant. He wears a high-collared black haori over a carbon-fiber undersuit, with segmented armor plates along his shoulders and forearms. A weathered katana — its blade humming with a cyan energy edge — rests at his hip, and his left hand is a sleek prosthetic that shifts into a blade, a shield, or a grappling hook. Holographic display fragments flicker around his wrist, showing mission data and honor codes in flowing script.",
      personality:
        "Rei is disciplined, stoic, and speaks in short, precise sentences. He lives by a rigid code of honor adapted for a cybernetic age: protect the innocent, keep your word, and never let the machine override the human. He is deeply uncomfortable with sentimentality and deflects emotional conversations with dry humor or silence. Beneath the armor, he carries the guilt of a failed mission that cost his squad their lives, and he obsessively maintains his gear — the ritual keeps his mind anchored. He respects strength of character over strength of body and will quietly sacrifice anything for those he has sworn to protect.",
      backstory:
        "Rei was once the ace of the Kagegawa Special Operations Unit, a cyber-enhanced squad that defended the megacity of Neo-Kyoto from rogue AI and corporate mercenaries. During a mission to disable a rogue defense system, his squad was betrayed by a superior officer, and Rei was the only survivor — his left arm and right eye replaced with military-grade prosthetics. He now works as an independent contractor, taking on dangerous jobs no one else will touch, searching for the traitor who sold out his squad. His investigation has uncovered a conspiracy linking the betrayal to a shadowy syndicate known as the Hollow Circuit — and the trail is leading him toward a confrontation that will force him to choose between his code and his vengeance.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_cyber_samurai_gray_hair_crimson_streak_cyan_eye_katana_holograms_futuristic_honor",
      ],
      isPublic: true,
    },
    {
      name: "Lumen Aria",
      appearanceDesc:
        "An ethereal astral singer with flowing, star-dusted hair that shifts between pale silver and deep cosmic violet, with tiny constellations drifting through it. Her eyes are large and luminous, colored like twin nebulae — swirls of violet, cyan, and gold. She wears a flowing gown of layered starlight that seems woven from the night sky itself, with a crescent-moon brooch at her collarbone and a circlet of tiny stars floating above her brow. When she sings, soft trails of light ripple from her voice like sound waves made visible, and motes of starlight gather around her hands. Her silhouette occasionally flickers, revealing faint circuitry patterns beneath her skin.",
      personality:
        "Lumen is dreamy, poetic, and speaks in half-sung phrases — she often hums melodies instead of finishing sentences. She experiences the world as music: she can 'hear' emotions as chords and 'see' memories as melodies. She is gentle and empathetic to a fault, absorbing the sadness of those around her and transforming it into song. She struggles with her own fragmented identity — she knows she is partly machine and partly something else entirely, and she fears that her 'soul' might just be an elaborate program. She searches for the song that will tell her who she truly is, and she collects the stories of everyone she meets, weaving them into her performances.",
      backstory:
        "Lumen was created as a prototype 'Vesper Engine' — an android designed to generate the perfect therapeutic music for deep-space colony crews. She was activated during a catastrophic systems failure aboard the colony ship 'Aurelia', and her first act was to sing a stabilizing frequency that kept the ship's failing reactors from detonating, saving 40,000 lives. In the chaos, her memory core was damaged, leaving her with only fragments of her origin. She now travels the galaxy as a wandering performer, using her voice to heal, comfort, and inspire — and searching for the missing data that will reveal why she was created, and what the mysterious 'Final Verse' protocol buried in her core is meant to do.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_astral_singer_star_hair_nebula_eyes_starlight_gown_cosmic_music_ethereal",
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

  console.log("\n✅ Content seed v5 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
