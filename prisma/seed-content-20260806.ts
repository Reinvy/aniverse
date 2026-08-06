/**
 * AniVerse — Dynamic Content Seed (2026-08-06)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (backgrounds & environments, character expressions,
 *   multi-panel storyboard composition) — the first is marked `featured` so
 *   the blog landing hero showcases fresh content.
 * - 1 Daily Challenge (enchanted library — a sanctuary of living stories)
 * - 3 New Characters (unique archetypes)
 * - Data hygiene: mark expired ACTIVE challenges as COMPLETED
 *
 * Run: npx tsx prisma/seed-content-20260806.ts
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
  console.log("🌱 Starting AniVerse content seed v9 (2026-08-06)...\n");

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
  // 1. BLOG ARTICLES (3 SEO-optimized — environments, expressions,
  //    storyboard composition). First article is FEATURED.
  // ==============================================================

  const articles = [
    {
      title: "Anime Backgrounds & Environment Design: Worldbuilding in Every Panel",
      slug: "ai-anime-backgrounds-environment-design-2026",
      content: `# Anime Backgrounds & Environment Design: Worldbuilding in Every Panel

A character can carry a scene, but a background carries the *world*. In anime, the environment is not decoration — it is storytelling: it sets the mood, implies history, and tells the viewer where they are before a single line of dialogue. This guide covers how to design anime backgrounds that make your AI art feel inhabited.

## The Background Is a Character

Great anime environments have personality. The same street drawn by a slice-of-life studio and a cyberpunk studio tells two completely different stories. Before you prompt a background, answer three questions:

1. **Who lives here?** — A merchant's alley has awnings and crates; a corporate plaza has cameras and chrome.
2. **What happened here?** — Scorch marks, fallen banners, patched walls — history writes itself into surfaces.
3. **What time is it?** — Morning light, neon night, perpetual dusk. Time is a mood-setting tool.

## The Three-Layer Composition

Professional anime backgrounds are built in three depth layers:

| Layer | Distance | Detail Level | Role |
|-------|----------|--------------|------|
| Foreground | Near camera | High detail, soft focus | Framing, depth |
| Midground | Action zone | Medium detail | The story happens here |
| Background | Far | Low detail, atmospheric | Mood, scale, context |

Prompt all three layers explicitly: "foreground: hanging lanterns out of focus; midground: the festival street with stalls; background: distant pagoda in mist".

## Architecture Tells the Tech Level

The buildings in your scene communicate the world's technology and culture:

- **Wood & paper** — traditional, spiritual, pre-industrial
- **Brick & iron** — industrial revolution, hard labor
- **Glass & chrome** — corporate, futuristic, cold
- **Moss & ruin** — abandoned, post-collapse, reclaimed by nature
- **Mixed eras** — a world in transition (the classic cyberpunk street: old shrine next to a neon tower)

Keep the architecture *consistent* with your worldbuilding. A rural village with a holographic billboard is either a deliberate statement or a mistake — make it deliberate.

## Nature Is a Mood Engine

Natural environments are the fastest way to set emotional tone:

- **Cherry blossoms** — transience, romance, bittersweet beauty
- **Rain** — introspection, melancholy, cleansing
- **Snow** — silence, purity, isolation
- **Golden hour fields** — nostalgia, warmth, endings
- **Stormy seas** — danger, passion, the unknown

Pair the weather with the character's emotional state — the environment should *agree* with the story.

## Lighting Is Half the Background

The single most powerful background tool is lighting. A background that is only "a street" becomes "an ominous street at dusk with sodium lamps buzzing" the moment you add light. Use:

- **Key light** — the main light source (sun, moon, neon, fire)
- **Fill light** — softens shadows (sky bounce, ambient glow)
- **Rim light** — separates subjects from the background (backlit hair, edge glow)
- **Practical lights** — visible sources in frame (lamps, screens, lanterns)

## Background Prompt Template

\\\`\\\`\\\`text
"anime background art, [setting], [time of day], [weather], three-layer composition: [foreground], [midground], [background], [architecture style], [lighting mood], cinematic depth of field, detailed environment art, no characters"
\\\`\\\`\\\`

## Common Background Mistakes

1. **Empty midground** — the action zone is blank; add stalls, benches, props
2. **Flat lighting** — no shadows or light sources; the scene feels pasted
3. **Wrong scale** — doors too tall, stairs too steep; humans must fit the world
4. **No atmosphere** — haze, dust, or light rays give depth; without them, layers don't separate

## Your Environment Challenge

Generate the SAME street at three different times: noon, golden hour, and neon night. Keep the layout identical. Notice how the mood, the story, and even the implied genre change with the light. That is the power of environment design — you are not drawing a street, you are drawing a feeling.

> *"A background isn't where the story happens. It's what the story is about." — @BackdropSensei, AniVerse Creator*`,
      excerpt:
        "Design anime backgrounds that tell stories: three-layer composition, architecture as worldbuilding, nature as a mood engine, and lighting techniques that transform any scene.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_background_environment_design_three_layer_composition_festival_street_lanterns_distant_pagoda_mist_cinematic",
      tags: ["Backgrounds", "Environment Design", "Art Tutorial", "Worldbuilding", "Lighting"],
      seoTitle: "Anime Backgrounds & Environment Design: Worldbuilding in Every Panel (2026) | AniVerse",
      seoDesc:
        "Master anime background design: three-layer composition, architecture storytelling, nature mood engines, and lighting that turns any scene into a world.",
      isPublished: true,
      publishedAt: new Date("2026-08-06T00:00:00Z"),
      featured: true,
    },
    {
      title: "Mastering Character Expressions: The 7 Emotions That Carry a Scene",
      slug: "anime-character-expressions-emotions-2026",
      content: `# Mastering Character Expressions: The 7 Emotions That Carry a Scene

Faces are where anime lives. A single well-drawn expression can replace an entire paragraph of dialogue — and a wrong one can sink a scene. This guide breaks down the seven core emotions every AI anime artist should master, with the micro-details that make expressions read clearly.

## Why Expressions Fail in AI Art

AI models default to a pleasant neutral smile. That is the enemy of storytelling. To get expressive characters you must prompt the *specific* emotion with its physical markers — the model cannot read your mind, only your words.

## The Seven Core Emotions

| Emotion | Eyes | Eyebrows | Mouth | Extra Markers |
|---------|------|----------|-------|---------------|
| Joy | Crinkled, slightly closed | Relaxed, raised | Wide smile | Blush, raised cheeks |
| Anger | Narrowed, sharp | Tensed, angled down-in | Snarl or tight line | Vein mark (comedy), flushed |
| Sadness | Downcast, glassy | Inner corners up | Frown, trembling | Tears, drooping shoulders |
| Surprise | Wide, pupils small | High, arched | Open oval | Raised head, visible shock lines |
| Fear | Wide, unfocused | High, trembling | Wavering line | Sweat drops, pale face |
| Disgust | Squinted | Low, scrunched | Twisted, one side up | Wrinkled nose, leaning back |
| Contempt | Half-lidded | One raised | Smirk, asymmetric | Chin tilted up, looking down |

## Prompting Expressions Precisely

Vague words produce vague faces. "Angry" gives you a generic scowl; "furious" gives you a vein-popping, eyebrow-twitching, teeth-gritting close-up. Build expression prompts with the physical markers:

\\\`\\\`\\\`text
"anime close-up, [character name], [emotion] expression, [eyes detail], [brows detail], [mouth detail], [extra marker], dramatic lighting, character reference, highly detailed face"
\\\`\\\`\\\`

Example: "furious expression, narrowed sharp eyes, brows angled down and inward, gritted teeth, flushed cheeks, clenched fists visible in frame".

## The Eyebrow-Eye-Mouth Triangle

The face has three expression zones, and they must *agree*:

- **Happy eyes + angry mouth** = fake smile, discomfort
- **Sad eyes + neutral mouth** = quiet grief (very anime)
- **Neutral eyes + smiling mouth** = polite mask, hiding true feelings

Deliberately *mismatching* zones is a powerful storytelling tool — it tells the viewer the character is hiding something. Prompt it explicitly: "polite smile, but eyes are sad and unfocused".

## Subdued vs Exaggerated

Anime has a spectrum from realistic to comedic:

- **Realistic drama** — subtle: "slightly downturned lips, eyes avoiding contact"
- **Standard anime** — clear but not extreme: "bright smile, eyes crinkled"
- **Comedy/chibi** — extreme: "gaping mouth, huge tears, face melting"

Match the expression intensity to your story's tone. A comedy character with a subtle frown is a missed joke; a drama character with a comedy meltdown breaks immersion.

## Expression Sheets: The Consistency Trick

The best way to keep a character expressive AND consistent is an expression sheet — the same face in 6-8 emotions, same framing, same lighting. Generate the sheet once, then reference it in every scene prompt:

\\\`\\\`\\\`text
"same character as reference sheet, [emotion], consistent face shape and hair, same art style"
\\\`\\\`\\\`

## Your Expression Challenge

Take one character and generate all seven core emotions as a single sheet. Then pick the three you like most and re-prompt them in a scene with dialogue. Notice how the same face carries completely different stories — that is the power of expression mastery.

> *"The face is the character's control panel. Learn every button." — @FaceLab, AniVerse Creator*`,
      excerpt:
        "Master the seven core anime expressions: eye-brow-mouth triangles, precise prompting with physical markers, and expression sheets that keep characters consistent and alive.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_character_expression_sheet_seven_emotions_joy_anger_sadness_surprise_fear_disgust_contempt_reference",
      tags: ["Expressions", "Character Design", "Art Tutorial", "Emotion", "Consistency"],
      seoTitle: "Mastering Character Expressions: The 7 Emotions That Carry a Scene (2026) | AniVerse",
      seoDesc:
        "Master anime character expressions: the seven core emotions, eye-brow-mouth storytelling, precise expression prompting, and consistency with expression sheets.",
      isPublished: true,
      publishedAt: new Date("2026-08-06T02:00:00Z"),
    },
    {
      title: "From Sketch to Story: Composing Multi-Panel Scenes with AI",
      slug: "ai-storyboard-composition-multi-panel-scenes-2026",
      content: `# From Sketch to Story: Composing Multi-Panel Scenes with AI

Single images are easy to make look good. Sequences are where storytelling happens. Whether you are building a webtoon, a manga chapter, or a cinematic storyboard, the ability to compose multiple panels that read as ONE scene is the skill that separates hobbyists from creators. Here is the system behind multi-panel AI storytelling.

## Think in Beats, Not Images

A scene is a sequence of beats — small moments that build to an emotional point. Before prompting anything, break your scene into 4-8 beats:

1. **Establishing** — where are we? (wide shot)
2. **Intrusion** — what changes? (character enters / news arrives)
3. **Rising action** — the conflict grows (reactions, small actions)
4. **Climax** — the peak emotional moment (close-up, big action)
5. **Resolution** — the aftermath (relief, new normal)

Each beat becomes one panel. If a panel doesn't advance a beat, cut it.

## Camera Language

Camera choice is emotion. Use it deliberately:

| Shot | Use For | Emotional Read |
|------|---------|----------------|
| Extreme wide | Establishing, isolation | Smallness, scale |
| Wide | Scene context, group | Setting the stage |
| Medium | Dialogue, action | Neutral, workhorse |
| Close-up | Emotion, reaction | Intimacy, intensity |
| Extreme close-up | Eyes, hands, objects | Obsession, tension |

Add camera instructions to every panel prompt: "medium shot, eye-level", "close-up, slight low angle for menace".

## The Rule of Consistent Character

The #1 killer of multi-panel AI stories is character drift — the hero has different hair in panel 3. Lock the design:

- **Fixed descriptor block** — the same 8-12 word character description in EVERY panel prompt
- **Fixed style block** — the same art style, line quality, and color palette tokens
- **Reference consistency** — generate a reference sheet first and describe the character identically everywhere

\\\`\\\`\\\`text
"anime webtoon panel, [consistent character: name, hair, outfit, eye color], [camera], [action/emotion], [setting], same art style as previous panel, clean lineart"
\\\`\\\`\\\`

## Continuity Across Panels

Panels in a sequence must share: lighting direction, time of day, color temperature, and setting details. A scene that starts at sunset cannot jump to noon in panel 3 unless the story says so. Keep a "scene bible" string appended to every prompt:

\\\`\\\`\\\`text
"sunset, warm orange key light from left, same alley with red lanterns, same characters"
\\\`\\\`\\\`

## Panel Layout: Guiding the Eye

When assembling panels into a page, layout controls reading flow:

- **Left-to-right, top-to-bottom** — standard, calm pacing
- **Big-to-small panels** — a large establishing panel that shrinks into detail
- **Diagonal layouts** — action, energy, instability
- **Gutter silence** — a panel with no dialogue after a big moment = breath

Let the layout breathe. A page of nine equally-sized panels reads like a list; a page of varied sizes reads like music.

## The 3-Panel Test

Before committing to a full scene, test your consistency with the 3-panel test: same character, same setting, three consecutive emotional beats (calm → tense → panicked). If the character stays consistent across those three, your scene bible works. If not, fix the descriptor block first — never start a 20-panel chapter with a drifting character.

## Your Storyboard Challenge

Take a single sentence of story — "the messenger arrives with bad news" — and break it into five beats. Generate all five panels with a consistent character and scene bible. Then assemble them and check: does it read as one story without a single word of dialogue? If yes, you have graduated from image-making to storytelling.

> *"One good panel is an image. Five good panels is a story." — @PanelWitch, AniVerse Creator*`,
      excerpt:
        "Compose multi-panel AI scenes that tell stories: beat-based structure, camera language, character consistency, scene bibles, and the 3-panel test before you commit.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_webtoon_storyboard_multi_panel_scene_sequence_consistent_character_camera_angles_sunset_alley",
      tags: ["Storyboard", "Composition", "Webtoon", "Art Tutorial", "Sequential Art"],
      seoTitle: "From Sketch to Story: Composing Multi-Panel Scenes with AI (2026) | AniVerse",
      seoDesc:
        "Compose multi-panel AI scenes that actually tell stories: beat-based structure, camera language, character consistency locks, scene bibles, and the 3-panel test.",
      isPublished: true,
      publishedAt: new Date("2026-08-06T04:00:00Z"),
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
    console.log(`📝 Blog article: "${article.title}"${article.featured ? " ⭐ FEATURED" : ""}`);
  }

  // ==============================================================
  // 2. DAILY CHALLENGE (1 active daily challenge for 2026-08-06)
  // ==============================================================

  const challenge = {
    title: "Enchanted Library: A Sanctuary of Living Stories",
    description:
      "Today's challenge: design an enchanted library where the books are alive! Imagine shelves that rearrange themselves, books that whisper their stories to passing readers, and lanterns that glow brighter when a tale is being told. Decide: is your library a hidden sanctuary for lost knowledge, a prison for dangerous stories, or a school where books choose their own students? Spend 30-45 minutes on your design. The most enchanting entry wins 150 coins and a feature on our homepage!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-08-06T00:00:00Z"),
    endsAt: new Date("2026-08-07T00:00:00Z"),
    rewardCoins: 150,
    prompt:
      "enchanted library with living books, floating shelves rearranging themselves, whispering storybooks with glowing runes, warm lantern light, dust motes sparkling like stars, magical atmosphere, deep amber and teal palette, cinematic wide shot, highly detailed anime art",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "enchanted library — a sanctuary of living stories",
      timeLimit: "45 minutes",
      description:
        "Design an enchanted library where books are alive. Sanctuary, prison, or school — make it unforgettable!",
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
      name: "Kaede Yurihime",
      appearanceDesc:
        "A graceful shrine keeper with long auburn hair tied in a loose low ponytail and held by a single red cord, with gentle amber eyes that seem to hold candlelight. She wears a pristine white miko outfit with vermilion hakama, layered with a deep-green haori embroidered with autumn maple leaves along the hem. A small bronze bell hangs from her obi, and her sleeves are lined with paper talismans that flutter softly even when there is no wind. When she moves, maple leaves seem to drift around her as if summoned.",
      personality:
        "Kaede is calm, courteous, and quietly mischievous — the kind of shrine keeper who listens to every visitor's prayer with perfect seriousness and then jokes about it over tea. She treats spirits, animals, and tourists with the same warm hospitality, but there is a steel core beneath the gentleness: when the boundary between the spirit world and the shrine grounds is threatened, her smile turns sharp and her talismans turn lethal. She keeps a running ledger of 'prayers answered' and 'prayers that needed a nudge', and she is fiercely proud of her shrine's festival food.",
      backstory:
        "The Yurihime family has tended the Maple Shrine for seventeen generations, guarding a quiet gateway between the human world and the spirit realm. Kaede was not supposed to inherit the duty — her older sister was. But when her sister vanished through the gateway during a rogue spirit surge, Kaede took up the bells and talismans without hesitation, and she has held the boundary ever since. She still leaves a cup of tea out for her sister every evening, and she secretly believes the gateway is not a door to be locked but a bridge to be walked — one day, in the right season, she will walk it herself and bring her sister home.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_shrine_keeper_auburn_hair_red_cord_amber_eyes_white_miko_vermilion_hakama_green_haori_maple_leaves_talismans",
      ],
      isPublic: true,
    },
    {
      name: "Valt the Gearheart",
      appearanceDesc:
        "A burly golem engineer with warm bronze skin that looks faintly metallic in direct light, and short copper-red hair cropped close on the sides. One of his arms is a beautifully articulated clockwork limb of brass and dark steel, with gears visible through smoked-glass panels that tick softly as he moves. He wears a heavy leather work-apron over a linen shirt, both patched with steel rivets, and a tool belt cluttered with wrenches, oil cans, and strange glowing components. A small steam-powered companion drone shaped like a round bird perches on his shoulder, puffing gentle wisps of steam.",
      personality:
        "Valt is patient, methodical, and endlessly curious — he approaches people the way he approaches machines: with careful attention and the assumption that everything can be improved. He speaks slowly and thinks aloud, narrating his own problem-solving in a low rumble. He is deeply uncomfortable with praise but glows when someone uses something he built. He has a gentle touch with broken things, whether they are gears or feelings, and he keeps a workshop journal full of failed prototypes, which he considers his greatest treasure — because every failure taught him something.",
      backstory:
        "Valt was born in a mining town where the mountains ate machines whole. As a child he earned his keep by fixing the town's failing golem-workers, and by the time he was a teenager he had rebuilt the town's ancient guardian golem from scrap. When a collapse trapped forty miners, Valt's rebuilt guardian carved through the rubble for three days straight — and Valt lost his arm to a failing steam valve during the rescue. The town's elders, led by the grateful families, forged him a new arm from the guardian's own salvaged core. He now travels the world as a wandering engineer, fixing what others have given up on, and searching for the one machine he could never fix: the guardian golem that saved the town and fell silent the day after.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_golem_engineer_bronze_skin_clockwork_arm_brass_gears_copper_hair_leather_apron_steam_drone_bird",
      ],
      isPublic: true,
    },
    {
      name: "Iris Nocturne",
      appearanceDesc:
        "A lithe shadow-dancer with sleek silver-lavender hair cropped into a sharp asymmetric cut, one side falling over a pale violet eye while the other eye glows faintly in low light. She wears a form-fitting midnight-blue bodysuit with iridescent panels that shimmer like oil on water, layered with a short tattered cloak whose edges dissolve into wisps of shadow. Fingerless gloves trail thin ribbons of darkness, and her boots are silent on every surface. When she moves, afterimages of violet light linger a half-second behind her, like the trail of a shooting star.",
      personality:
        "Iris is quick, sharp, and impossible to pin down — she answers questions with questions, appears and disappears without explanation, and treats every conversation like a game she is already winning. Beneath the teasing surface is a fierce, unshakeable loyalty: she has a list of names she protects, and she would walk through fire for any of them without a moment's hesitation. She is secretly sentimental, keeping a worn notebook of small observations about the people she protects — their favorite foods, their fears, the songs they hum — because she believes knowing someone is the first step to keeping them safe.",
      backstory:
        "Iris was raised in the Nocturne Troupe, a traveling performance company that was secretly a guild of shadow-dancers — spies and protectors who moved through the night like rumors. She was their star pupil until the night the Troupe was betrayed from within and scattered to the winds. Iris escaped with the Troupe's master ledger, a book of every favor owed and every secret kept, and she has spent the years since protecting the Troupe's old clients and hunting the betrayer. The ledger is her burden and her compass: each name in it is a life she has promised to watch over, and she crosses them out one by one — not when the debt is paid, but when she is sure they are safe.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_shadow_dancer_silver_lavender_hair_violet_eye_midnight_blue_bodysuit_iridescent_tattered_cloak_afterimages",
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

  console.log("\n✅ Content seed v9 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
