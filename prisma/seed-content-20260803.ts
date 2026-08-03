/**
 * AniVerse — Dynamic Content Seed (2026-08-03)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (lighting & mood, expression sheets, webtoon pacing)
 * - 1 Daily Challenge (skybound floating city)
 * - 3 New Characters (unique archetypes)
 * - Data hygiene: mark expired ACTIVE challenges as COMPLETED
 *
 * Run: npx tsx prisma/seed-content-20260803.ts
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
  console.log("🌱 Starting AniVerse content seed v6 (2026-08-03)...\n");

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
  // 1. BLOG ARTICLES (3 SEO-optimized — lighting, expressions, pacing)
  // ==============================================================

  const articles = [
    {
      title: "AI Anime Lighting: Cinematic Techniques for Dramatic Mood",
      slug: "ai-anime-lighting-cinematic-mood-2026",
      content: `# AI Anime Lighting: Cinematic Techniques for Dramatic Mood

Lighting is the fastest way to make a flat AI anime image feel like a movie still. Two prompts with the same character and pose can feel completely different — one looks like a screencap, the other like a poster. The difference is almost always light. Here's how to direct light in your AI anime art like a cinematographer.

## Why Lighting Reads Before Anything Else

The human eye finds light first. A viewer registers the brightest part of the frame, then the darkest, then the story in between. In anime, lighting isn't just illumination — it's emotion made visible. A single rim light can turn an ordinary portrait into a dramatic character reveal.

## The Three-Point System for Anime

Classic cinematography maps to anime prompts surprisingly well:

| Light | Role | Prompt Keyword |
|-------|------|----------------|
| Key light | Main illumination, defines form | "strong key light from upper left" |
| Fill light | Softens shadows | "soft fill light, gentle ambient" |
| Rim/back light | Separates subject from background | "bright cyan rim light, edge glow" |

A common mistake is prompting only "dramatic lighting" and letting the model guess. Instead, state the direction and color of each light source.

## Mood Lighting Recipes

- **Golden hour:** "warm golden hour backlight, long soft shadows, lens flare, honey-toned atmosphere"
- **Neon noir:** "hard magenta and cyan neon contrast, deep purple shadows, wet street reflections"
- **Moonlit:** "cool blue moonlight, silver rim light, deep indigo shadows, starfield glow"
- **Candlelit:** "flickering warm candlelight, deep amber shadows, intimate glow"
- **Overcast:** "soft diffused daylight, muted tones, gentle gradients, no harsh shadows"

## The One-Source Rule

Most professional anime frames use ONE dominant light source. Multiple strong lights create visual noise and muddy colors. Pick your hero light, then add at most one secondary accent.

\\\`\\\`\\\`
"anime swordsman in dark hall, single window light from upper right, dust particles in beam, cool shadows, cinematic composition"
\\\`\\\`\\\`

## Rim Light: The Anime Signature

Rim lighting — a bright edge tracing the character's silhouette — is the single most anime-cinematic technique. It separates the subject from the background and adds instant depth:

\\\`\\\`\\\`
"anime girl at night, strong warm rim light on hair and shoulders, dark background, glowing edge silhouette, cinematic"
\\\`\\\`\\\`

## Practical Light Sources in the Scene

Diegetic light — sources visible in the frame (neon signs, screens, lanterns, fire) — grounds the scene and gives the model something concrete to work with. "Street lamp" beats "moody lighting" every time.

## Shadow Quality Sets the Genre

- **Hard shadows** = action, thriller, drama
- **Soft shadows** = romance, slice-of-life, dream sequences
- **No visible shadows** = clean key visuals, idol anime, merchandise art

## Your Lighting Checklist

- [ ] One dominant light source chosen
- [ ] Light direction stated in the prompt (left/right/top/back)
- [ ] Rim light considered for subject separation
- [ ] Color temperature intentional (warm/cool/mixed)
- [ ] Shadow quality matched to genre

> *"Light is the cheapest cinematographer you'll ever hire — it costs nothing but a few prompt words, and it changes everything." — @LumiFrame, AniVerse Creator*`,
      excerpt:
        "Master cinematic AI anime lighting: three-point setup, mood lighting recipes, the one-source rule, rim light signatures, and shadow quality for genre.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_cinematic_lighting_rim_light_neon_noir_golden_hour_mood_lighting_techniques_stylized",
      tags: ["Lighting", "Cinematic", "Art Tutorial", "Technique", "Prompt Engineering"],
      seoTitle: "AI Anime Lighting: Cinematic Techniques for Dramatic Mood (2026) | AniVerse",
      seoDesc:
        "Learn cinematic AI anime lighting: three-point setup, mood recipes, rim light signatures, and shadow quality. Make your generations feel like movie stills.",
      isPublished: true,
      publishedAt: new Date("2026-08-03T00:00:00Z"),
    },
    {
      title: "Character Expression Sheets: Consistent Emotions in AI Art",
      slug: "character-expression-sheets-ai-art-2026",
      content: `# Character Expression Sheets: Consistent Emotions in AI Art

A character with one expression is a sketch. A character with a full expression sheet is a *cast member*. Whether you're building an OC for a webtoon, an RPG, or just your portfolio, mastering emotion consistency is what makes AI-generated characters feel alive. Here's how to build expression sheets that stay consistent.

## What Is an Expression Sheet?

An expression sheet is a grid of the same character showing different emotions — joy, anger, sadness, surprise, fear, and neutral — usually from the same angle so the face reads clearly. In the anime industry these are called "face charts" and they're the backbone of character design.

## The Consistency Problem in AI

AI is great at generating ONE beautiful face. It struggles to keep the SAME face across many emotions. The fix is anchoring: every prompt must repeat a locked description of the character's fixed features — hair, eye color, facial structure, distinguishing marks — and vary ONLY the emotion.

## Step 1: Lock the Character DNA

Create a reusable block (AniVerse character profiles store this for you):

\\\`\\\`\\\`
"character: [name], silver hair, gold eyes, small scar on left cheek, consistent character design"
\\\`\\\`\\\`

Never change this block. Change only the expression clause.

## Step 2: The Six Core Emotions

| Emotion | Expression Keywords | Eye Detail |
|---------|--------------------|------------|
| Joy | "bright smile, eyes closed in laughter" | happy curve |
| Anger | "narrowed brows, clenched jaw, sharp gaze" | intense |
| Sadness | "downcast eyes, trembling lip, soft frown" | glossy |
| Surprise | "wide eyes, raised brows, parted lips" | large pupils |
| Fear | "dilated pupils, furrowed brows, pale" | trembling |
| Neutral | "calm, relaxed, gentle default expression" | steady |

\\\`\\\`\\\`
"anime girl, silver hair, gold eyes, small scar on left cheek, surprised expression, wide eyes, raised brows, parted lips, head and shoulders portrait, consistent character design"
\\\`\\\`\\\`

## Step 3: Keep the Angle Fixed

For a clean sheet, keep the same camera angle (usually front-facing or 3/4) and the same framing for every cell. Changing angles mid-sheet makes consistency harder to judge — and harder for the model to maintain.

## Step 4: Use AniVerse Reference Images

AniVerse's character system stores reference images. Reuse your best reference as a seed for expression variants — the closer your anchor, the more consistent the sheet. Generate one strong "base portrait" first, then reference it for all six emotions.

## Micro-Expressions Add Life

Beyond the six core emotions, add micro-expressions: a faint blush, a raised eyebrow, a half-smile, tired eyes. These are what make a character feel like a real person rather than a stock anime face.

## Common Expression-Sheet Mistakes

1. **Changing hair or eye color between cells** — re-anchor every time
2. **Overacting** — anime expressions read bigger than life, but there's a line between expressive and uncanny
3. **Ignoring the eyes** — anime emotion lives in the eyes; mouth matters less
4. **No neutral cell** — you need a baseline to compare against

## Your Expression Sheet Challenge

Generate one character in six emotions, same angle, same framing. Lay them out in a 2x3 grid and post it as a gallery — a complete expression sheet is one of the most impressive things an AI artist can share, because it proves you control the model rather than the other way around.

> *"Anyone can generate a pretty face. An expression sheet proves you can generate a person." — @FaceChart, AniVerse Creator*`,
      excerpt:
        "Build consistent AI anime character expression sheets: lock character DNA, master the six core emotions, fix the angle, and avoid common consistency mistakes.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_character_expression_sheet_grid_six_emotions_same_character_consistent_face_chart_stylized",
      tags: ["Character Design", "Expressions", "Art Tutorial", "Consistency", "OC"],
      seoTitle: "Character Expression Sheets: Consistent Emotions in AI Art (2026) | AniVerse",
      seoDesc:
        "Master AI anime expression sheets: lock character DNA, generate six core emotions with consistent features, and avoid the top consistency mistakes.",
      isPublished: true,
      publishedAt: new Date("2026-08-03T02:00:00Z"),
    },
    {
      title: "Webtoon Panel Composition: Pacing and Camera for AI Artists",
      slug: "webtoon-panel-composition-pacing-2026",
      content: `# Webtoon Panel Composition: Pacing and Camera for AI Artists

Webtoons are read by scrolling, not by turning pages — and that changes everything about composition. A vertical scroll reader has about three seconds to feel your scene before they keep moving. Panel composition is how you control that scroll: when to breathe, when to punch, and how to direct the reader's eye with AI-generated art.

## The Vertical Canvas

A webtoon panel is tall, not wide. Portrait-oriented images (9:16 or taller) fit the scroll format naturally. When prompting AI for webtoon art, always specify a vertical composition or the model will default to landscape.

## Pacing = Panel Size

In comics, panel size controls reading time. The same logic applies to webtoons:

| Panel Type | Height | Effect |
|------------|--------|--------|
| Splash / establishing | Very tall | Breathe, set the scene, slow the reader |
| Standard action | Medium | Normal storytelling beat |
| Insert / close-up | Short | Fast beat, impact, quick read |

## Camera Distance Vocabulary

Direct the model with camera language — it works remarkably well:

- **Extreme wide:** "tiny character in vast landscape, establishing shot"
- **Medium shot:** "character from waist up, standard dialogue beat"
- **Close-up:** "face filling the frame, emotional beat"
- **Extreme close-up:** "eyes only, dramatic reveal, intense moment"

## The Rule of One Focus

Each panel should have exactly one focal point. When you prompt, state what the reader should look at first: "focus on the glowing key in her hand, background softly blurred". Scattered focus = scattered reader.

## Action Lines and Motion

Anime action reads best with directional motion cues:

\\\`\\\`\\\`
"anime action scene, character lunging forward, speed lines, motion blur, dynamic diagonal composition, cinematic"
\\\`\\\`\\\`

## Consistent Character Across Panels

This is where AniVerse's character system shines. Reuse the same character profile (appearance, reference images) for every panel so the cast stays consistent across a 40-panel episode. Anchor each prompt with the same character block, vary only the scene.

## Dialogue and Negative Space

Leave room for dialogue bubbles. A panel with text crammed over the art feels broken. Prompt for "clean negative space at top, simple background" on dialogue-heavy beats.

## The Cliffhanger Panel

End every episode on a hook: a close-up of a shocked face, a revealed mystery object, or an impossible situation. Prompt the final panel to be visually distinct from the rest — "dramatic lighting, high contrast, single focused element".

## Your Webtoon Challenge

Take one scene from your favorite story and break it into 6 vertical panels: establishing shot → action beat → close-up → dialogue → twist → cliffhanger. Generate them with the same character and export as a gallery sequence. You'll have your first webtoon page.

## Panel Checklist

- [ ] Vertical composition (portrait) specified
- [ ] One focal point per panel
- [ ] Camera distance matches emotional beat
- [ ] Character anchored with consistent DNA
- [ ] Negative space reserved for dialogue
- [ ] Cliffhanger panel visually distinct

> *"A webtoon is a scroll that breathes. Learn when to hold the reader's eye, and you've learned the whole craft." — @PanelPilot, AniVerse Creator*`,
      excerpt:
        "Compose webtoon panels with AI: vertical canvas, pacing via panel size, camera distance vocabulary, one-focus rule, and consistent characters across episodes.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_webtoon_panel_composition_vertical_storyboard_camera_angles_action_lines_stylized",
      tags: ["Webtoon", "Composition", "Storytelling", "Art Tutorial", "Technique"],
      seoTitle: "Webtoon Panel Composition: Pacing and Camera for AI Artists (2026) | AniVerse",
      seoDesc:
        "Master webtoon panel composition with AI: vertical canvas, pacing, camera distance, one-focus rule, and character consistency across a scrolling episode.",
      isPublished: true,
      publishedAt: new Date("2026-08-03T04:00:00Z"),
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
  // 2. DAILY CHALLENGE (1 active daily challenge for 2026-08-03)
  // ==============================================================

  const challenge = {
    title: "Skybound City: Architecture Among the Clouds",
    description:
      "Today's challenge: design a floating city suspended above the clouds! Create a breathtaking skybound metropolis — think crystalline spires, hanging gardens, airship docks, and waterfalls cascading off the edge into the sky. Decide: is your city a peaceful utopia, a hidden refuge, or a decaying relic of a fallen age? Spend 30-45 minutes on your design. The most awe-inspiring entry wins 150 coins and a feature on our homepage!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-08-03T00:00:00Z"),
    endsAt: new Date("2026-08-04T00:00:00Z"),
    rewardCoins: 150,
    prompt:
      "floating city above clouds, crystalline spires and hanging gardens, airship docks, waterfalls cascading off the edge, golden sunrise light, ethereal atmosphere, cinematic wide shot, highly detailed anime background",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "skybound floating city",
      timeLimit: "45 minutes",
      description:
        "Design a breathtaking floating city above the clouds — utopia, refuge, or relic. Vertical composition encouraged!",
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
      name: "Riku Stormbane",
      appearanceDesc:
        "A dashing sky-pirate captain with windswept silver hair streaked with lightning-blue, and one storm-grey eye — the other is a glowing cyan compass-eye that always points toward adventure. He wears a worn leather flight jacket over a white shirt with an open collar, a crimson scarf that never stops flowing, and gauntlets etched with swirling wind runes. A cutlass with a sky-glass blade hangs at his hip, and small airship tools dangle from his belt. Faint cloud patterns drift across his skin when the wind picks up, and his boots leave tiny whirlwinds in their wake.",
      personality:
        "Riku is bold, charismatic, and allergic to boredom. He speaks in grand declarations, laughs at danger, and treats every storm as a personal invitation. He's fiercely loyal to his crew and has a soft spot for lost causes — stranded travelers, orphaned griffins, and forgotten islands. Beneath the bravado, he carries the weight of a captaincy he never asked for: his father's ship was destroyed in a storm he couldn't outfly, and he now chases the legendary Sky Current that he believes leads to a haven where no ship ever sinks. He hides his grief behind a thousand jokes, but his crew knows when the compass-eye flickers, he's thinking of home.",
      backstory:
        "Riku was born aboard the airship 'Gale Sovereign', heir to a legendary line of sky-captains. When he was sixteen, a freak storm called the Tempest Maw swallowed his father's fleet; Riku survived by clinging to a piece of the mast for three days. He rebuilt a crew from fellow survivors and outcasts, and now commands the 'Zephyr's Revenge', hunting for the Sky Current — a mythical river of wind said to flow above the highest clouds. His search has brought him into conflict with the Cloud Court, a guild of sky-nobles who hoard the weather itself, and who may know more about the Tempest Maw than they admit.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_sky_pirate_captain_silver_hair_cyan_compass_eye_crimson_scarf_airship_gauntlets_adventurous",
      ],
      isPublic: true,
    },
    {
      name: "Mei Kuroboshi",
      appearanceDesc:
        "A graceful phantom thief with sleek black hair cut in a sharp asymmetrical bob, and striking violet eyes that seem to glow in dim light. She wears a form-fitting midnight-blue thief's suit with silver trim, a long flowing coat that billows dramatically, and a white masquerade mask pushed up on her forehead. Gloves with retractable claw-tips, a belt of lockpicks and smoke pellets, and a crescent-moon pendant that hums faintly. When she moves, afterimages of violet light trail behind her, and her footsteps make no sound at all.",
      personality:
        "Mei is playful, precise, and a little bit theatrical — she leaves calling cards, bows to security cameras, and never steals anything without leaving a riddle. She has a strict personal code: she only steals from the corrupt and the cruel, and she always pays back kindness tenfold. She is witty and charming in conversation, but deflects any question about her past with a smile and a change of subject. Deep down, she is searching for the person who destroyed her family's workshop — the same people who now run the city's most powerful corporation. Her obsession is quiet but absolute, and the only time her playful mask slips is when the investigation hits a dead end.",
      backstory:
        "Mei's family were master locksmiths and artisans of impossible mechanisms, crafting the vaults and security systems of the city's elite. One night, their workshop was burned to the ground and her parents vanished — and the insurance company that profited, the Obsidian Group, quietly absorbed the family patents. Mei grew up in the orphanages and streets, teaching herself the very craft her family had perfected, until she became the phantom thief known only as 'Kuroboshi' — the Black Star. She steals from Obsidian Group's vaults and archives, looking for the truth, and has begun to suspect the company's founder knows far more about that night than anyone admits.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_phantom_thief_black_hair_violet_eyes_midnight_suit_masquerade_mask_moon_pendant_elegant",
      ],
      isPublic: true,
    },
    {
      name: "Kitsune Rin",
      appearanceDesc:
        "A radiant nine-tailed fox spirit with flowing auburn hair that shifts to white at the tips, and intelligent amber eyes with slit pupils. She wears an elegant white-and-crimson shrine maiden outfit layered with a translucent kimono that shimmers like foxfire, and her nine tails fan out behind her, tipped with pale flames that don't burn. A small round mirror hangs at her waist — a gift from a shrine god — and tiny fox ears twitch above her hair. When she uses her illusions, faint patterns of dancing flames and floating torii gates ripple around her.",
      personality:
        "Rin is ancient, mischievous, and endlessly amused by mortal foolishness — though she'd never admit she's grown fond of them. She speaks in riddles and half-truths, loves a good prank, and collects 'interesting humans' the way mortals collect trinkets. She is fiercely protective of those she adopts, and her loyalty, once earned, is absolute. Beneath her playful exterior lies a deep loneliness: she has outlived every shrine, every priest, and every friend she's ever made, and she guards her heart carefully. She seeks a new shrine — not a building, but a person or place worth guarding for the next century.",
      backstory:
        "Rin was once the guardian spirit of a mountain shrine, serving the same priestly family for eight hundred years. When the last priest passed away and the shrine fell into ruin, she was freed — and lost. She wandered the modern world for decades, watching it change faster than any era she'd known, until she discovered the AniVerse community of artists and creators. She now attaches herself to promising creators, offering guidance and inspiration in exchange for a place to belong. She has begun to sense a growing darkness — spirits of forgotten traditions, angered by a world that has stopped believing — and she fears her kind may be called to a final reckoning.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_fox_spirit_kitsune_auburn_hair_amber_eyes_nine_tails_shrine_maiden_foxfire_mischievous",
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

  console.log("\n✅ Content seed v6 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
