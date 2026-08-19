/**
 * AniVerse — Dynamic Content Seed (2026-08-15)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (anime hair design as identity, anime color theory
 *   palettes, and webtoon paneling/directing the reader's eye) — the first
 *   is marked `featured` with today's publishedAt so the blog landing hero
 *   rotates to fresh content.
 * - 1 Daily Challenge (Starlight Harvest — a floating garden above the clouds)
 * - 3 New Characters (unique archetypes: moon-tide dancer, tea alchemist,
 *   storm cartographer)
 * - Data hygiene: mark expired ACTIVE challenges as COMPLETED
 *
 * Run: npx tsx prisma/seed-content-20260815.ts
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
  console.log("🌱 Starting AniVerse content seed v12 (2026-08-15)...\n");

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
  // 1. BLOG ARTICLES (3 SEO-optimized — hair design, color theory,
  //    webtoon paneling). First article is FEATURED so the blog
  //    landing hero rotates to today's content.
  // ==============================================================

  const articles = [
    {
      title: "Anime Hair Design: Color, Shape & Motion as Character Identity",
      slug: "ai-anime-hair-design-identity-2026",
      content: `# Anime Hair Design: Color, Shape & Motion as Character Identity

Hair is the most recognizable part of an anime character. Strip a cast of characters down to silhouettes and the hair is what tells them apart — the spiky black mane of the shonen protagonist, the long silver braid of the quiet sage, the gravity-defying twin tails of the energetic rival. This guide breaks down how to design anime hair that carries identity, and how to prompt AI models for hair that stays consistent.

## Hair as Silhouette

Before color, before texture, hair is a shape. The silhouette of a character's hair should be readable at a glance, even at thumbnail size. Three questions define the shape:

1. **Mass** — is the hair heavy and voluminous or sleek and minimal?
2. **Direction** — does it spike upward, sweep sideways, fall downward, or defy gravity entirely?
3. **Asymmetry** — is the cut even, or does one side break the pattern?

A character whose hair shape reads clearly from across the room has succeeded at the first and hardest level of design.

## The Color Language

Hair color in anime is a personality signal before it is a physical trait:

- **Black/dark** — grounded, serious, traditional, or hiding something
- **White/silver** — ancient, mystical, experienced, or touched by tragedy
- **Red/crimson** — passionate, hot-blooded, dangerous, or cursed
- **Blue** — calm, intelligent, cold, or otherworldly
- **Green** — earthy, healing, nature-bound, or eccentric
- **Pink** — playful, romantic, childish, or deceptively soft
- **Gold/blonde** — radiant, privileged, heroic, or vain

The color should echo the character's arc: the fiery redhead who learns control, the silver-haired elder who was once a hot-blooded youth.

## Texture Tells

Texture is the third layer of identity. Spiky hair reads as aggressive and energetic; flowing hair reads as graceful and emotional; curly hair reads as warm and unpredictable; straight, severe hair reads as disciplined and cold. Mixing textures — a spiky underlayer with a soft fringe — creates the visual complexity of a real personality.

## Motion: The Living Detail

Anime hair never stops moving. The signature detail of great anime hair is that it reacts to emotion and action: it floats when the character is calm, snaps when they are angry, droops when they are sad, and flares when they unleash power. When designing a character, decide the hair's "default wind" — the direction it flows when nothing else is happening — and keep it consistent across every frame and image.

## Consistency Blocks for AI

Hair is the #1 consistency failure in AI anime art. A character's hair drifts between generations: color shifts, bangs change, volume fluctuates. Freeze a hair consistency block and repeat it word-for-word:

\\\`\\\`\\\`text
"[length] [texture] [color] hair, [shape detail], [default motion], [accent detail]"
\\\`\\\`\\\`

Example: "long flowing silver hair with a single red braid, swept to the left, gently floating, small star-shaped pins". Lock the block in the character sheet and NEVER change it between scenes.

## Your Hair Challenge

Design one character's hair in three emotional states — calm, furious, joyful — keeping the shape and color identical and changing only the motion. Compare how much story the hair alone carries. Then generate the same three states with AI using your consistency block, and see which one holds the identity better.

> *"A character's hair is their signature written in wind." — @StrandSage, AniVerse Creator*`,
      excerpt:
        "Design anime hair that carries character identity: silhouette shape, the color language, texture signals, motion as a living detail, and AI consistency blocks that keep hair stable across generations.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_hair_design_identity_silhouette_shapes_silver_red_blue_color_language_texture_motion_wind_character_sheet_cel_shading",
      tags: ["Character Design", "Hair", "Art Tutorial", "Consistency", "Prompt Engineering"],
      seoTitle: "Anime Hair Design: Color, Shape & Motion as Character Identity (2026) | AniVerse",
      seoDesc:
        "Design anime hair as character identity: silhouette, color language, texture signals, motion, and AI consistency blocks that keep a character's hair stable across every generation.",
      isPublished: true,
      publishedAt: new Date("2026-08-15T00:00:00Z"),
      featured: true,
    },
    {
      title: "Color Theory for Anime Art: Palettes That Tell a Story",
      slug: "anime-color-theory-palettes-story-2026",
      content: `# Color Theory for Anime Art: Palettes That Tell a Story

Color is the fastest emotional signal in anime. Before the viewer reads a face or a pose, they feel the palette. A warm sunset scene reads as nostalgia; a desaturated rain scene reads as grief; a neon city reads as energy and danger. This guide covers the color theory every anime artist needs, from the 60-30-10 rule to the emotional palettes that carry entire genres.

## The 60-30-10 Rule

A confident anime palette has three layers:

- **60% dominant color** — the world: backgrounds, large surfaces, atmosphere
- **30% secondary color** — the characters: outfits, hair, props
- **10% accent color** — the story: eyes, magic, glowing details, UI

The accent color is where the emotion lives. A single 10% accent — a red ribbon, a cyan glow, a gold eye — tells the viewer where to look and what matters. If everything is accent, nothing is.

## Warm vs. Cool: The Mood Axis

- **Warm palettes** (reds, oranges, golds) — comfort, passion, danger, nostalgia, energy
- **Cool palettes** (blues, purples, teals) — calm, sadness, mystery, distance, technology
- **Balanced palettes** — realism, neutrality, or a story about harmony

The classic trick: establish the world in one temperature, then break it with a single opposing light source. A cool blue night alley pierced by a warm golden streetlamp is a story about hope in one frame.

## Saturation: The Volume Knob

Saturation is the emotional volume control:

- **High saturation** — loud, joyful, childish, action-packed (shonen battles)
- **Mid saturation** — grounded, readable, everyday (slice of life)
- **Low/desaturated** — serious, melancholic, gritty, or historical (drama, noir)

Dropping saturation as a story gets darker is a classic anime technique — and raising it back for the climax is the payoff.

## Complementary Contrast: The Eye Anchor

Colors opposite on the wheel — blue/orange, red/green, purple/yellow — create the strongest visual pop. Anime uses complementary contrast for the most important elements: the protagonist's hair against the background, the villain's eyes against their outfit, the magic glow against the night. When prompting, name the complementary pair explicitly: "crimson accents against teal shadows".

## Palette Arcs: Color as Story

The most powerful use of color theory is the palette arc — a character or world whose colors shift as the story progresses:

- The innocent hero starts in white and gold, ends in black and red
- The cold rival starts in blue, warms to gold as they join the team
- The world starts saturated and drains to grey as hope fades

A palette arc tells the story even in a single frame from the right moment.

## Prompting Palettes with AI

For AI generation, give the model a palette map, not just a color name:

\\\`\\\`\\\`text
"[scene], [dominant] color palette, [secondary] accents, [accent] highlights, [temperature] lighting, [saturation] mood, anime style, cel shading, clean lineart"
\\\`\\\`\\\`

Example: "rainy night alley, deep blue palette, teal shadows, warm gold streetlamp accents, cool temperature, mid saturation, melancholic mood, anime style".

## Your Color Challenge

Take one scene and render it in three palettes: a warm nostalgic version, a cool melancholic version, and a neon high-energy version — identical composition, identical characters. Compare how the story changes with nothing but color. That is the power of the palette.

> *"Color is the first story the audience reads." — @HueHerald, AniVerse Creator*`,
      excerpt:
        "Master color theory for anime art: the 60-30-10 rule, warm vs cool mood axes, saturation as emotional volume, complementary contrast, palette arcs that tell a story, and AI palette prompts.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_color_theory_palette_wheel_60_30_10_rule_warm_cool_mood_complementary_contrast_teal_gold_cel_shading",
      tags: ["Color Theory", "Art Tutorial", "Composition", "Palette", "Prompt Engineering"],
      seoTitle: "Color Theory for Anime Art: Palettes That Tell a Story (2026) | AniVerse",
      seoDesc:
        "Master anime color theory: the 60-30-10 rule, warm vs cool moods, saturation as emotional volume, complementary contrast, palette arcs, and AI palette prompts that tell a story.",
      isPublished: true,
      publishedAt: new Date("2026-08-15T02:00:00Z"),
    },
    {
      title: "Webtoon Paneling: Directing the Reader's Eye",
      slug: "webtoon-paneling-directing-reader-eye-2026",
      content: `# Webtoon Paneling: Directing the Reader's Eye

Webtoons are read vertically, on a phone, one thumb-swipe at a time. That changes everything about composition. A webtoon panel is not a comic page panel — it is a beat in a vertical rhythm, and the artist's job is to make the reader's thumb never want to stop. This guide covers the paneling principles that keep webtoon readers scrolling: the vertical canvas, the eye path, pacing, and the cut.

## The Vertical Canvas

A webtoon episode is one long vertical strip. Each screen-height segment (roughly 800-1000px on a phone) is a "screenful" — the unit the reader experiences at once. Design in screenfuls, not panels:

- One screenful = one emotional beat
- Panels within a screenful = the sub-beats of that emotion
- The bottom of each screenful should create a reason to scroll

A reader who reaches the bottom of a screenful with no curiosity will close the app. Every screenful must end on a hook.

## The Eye Path

Within each screenful, the eye should travel in a deliberate path. In vertical webtoons the natural path is top-to-bottom, with the eye entering on the focal point (usually a face or action) and exiting toward the next screenful's hook. Use three tools to control the path:

- **Contrast** — the brightest/highest-contrast element is where the eye lands first
- **Leading lines** — swords, roads, gazes, and motion trails that point where the eye should go next
- **Negative space** — emptiness that lets the eye rest before the next beat

## Pacing: Panels as Breathing

Panel size is pacing. A webtoon that is all large action panels exhausts the reader; a webtoon that is all small talking panels bores them. The rhythm should alternate:

- **Large/tall panels** — establishing shots, big actions, emotional peaks
- **Medium panels** — dialogue, movement, progression
- **Small/tight panels** — quick beats, reactions, comedy timing

A classic rhythm: small reaction → small reaction → TALL emotional payoff. The contrast makes the payoff land.

## The Cut: Where to End a Screenful

The most important panel in a webtoon is the one at the bottom of a screenful. The "cut" is where the reader decides whether to scroll. Great cuts do one of three things:

1. **Raise a question** — "what is she looking at?"
2. **Start a motion** — a character mid-dash, a sword mid-swing
3. **Show a surprise** — a new character, a changed expression, a revealed location

Never end a screenful on a completed thought. End it on a heartbeat.

## The Vertical Action Line

In traditional comics, action runs left-to-right. In webtoons, the strongest action runs top-to-bottom or bottom-to-top: a character falling, a beam of light descending, a staircase of panels leading down. Design your action sequences along the vertical axis so the scroll itself becomes part of the motion.

## Transition Panels

Webtoons move between scenes with "transition panels" — often a single image with no dialogue that bridges the mood: a sky, a window, a clock, a pair of shoes. Transition panels are the punctuation of the vertical format; they give the reader a breath and the story a change of tempo. Use them deliberately, not as filler.

## Your Paneling Challenge

Take a 6-panel comic scene and re-panel it as a webtoon: split it into three screenfuls, give each screenful one emotional beat, add a transition panel, and end each screenful on a cut that makes you want to scroll. Read it on your phone. Feel the difference between a page and a vertical rhythm.

> *"A webtoon panel is not a box — it is a heartbeat in a vertical rhythm." — @ScrollSmith, AniVerse Creator*`,
      excerpt:
        "Direct the reader's eye in webtoons: the vertical canvas and screenfuls, eye paths, panel pacing as breathing, the bottom-of-screen cut, vertical action lines, and transition panels.",
      coverImage:
        "https://image.pollinations.ai/prompt/webtoon_paneling_vertical_canvas_screenfuls_eye_path_pacing_cut_hook_transition_panels_vertical_action_line_phone_reading",
      tags: ["Webtoon", "Composition", "Art Tutorial", "Paneling", "Storytelling"],
      seoTitle: "Webtoon Paneling: Directing the Reader's Eye (2026) | AniVerse",
      seoDesc:
        "Direct the reader's eye in webtoons: vertical screenfuls, eye paths, pacing, the bottom-of-screen cut, vertical action lines, and transition panels that keep readers scrolling.",
      isPublished: true,
      publishedAt: new Date("2026-08-15T04:00:00Z"),
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
  // 2. DAILY CHALLENGE (1 active daily challenge for 2026-08-15)
  // ==============================================================

  const challenge = {
    title: "Starlight Harvest: A Garden Above the Clouds",
    description:
      "Tonight's challenge: paint a starlight harvest in a garden above the clouds! Imagine a floating celestial garden where glowing star-flowers bloom only under the open night sky — and tonight they are ready to harvest. Decide: is your garden a lost sanctuary tended by moon-priests, a rebel hideout that grows light for a city below, or a dream-garden that only appears to those who need hope? Spend 30-45 minutes on your scene. The most luminous entry wins 150 coins and a feature on our homepage!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-08-15T00:00:00Z"),
    endsAt: new Date("2026-08-16T00:00:00Z"),
    rewardCoins: 150,
    prompt:
      "floating celestial garden above the clouds at night, glowing star-flowers blooming in full harvest, silver and gold light petals drifting, moonlit cloud sea below, tiny floating islands with garden terraces, starfall in the distance, luminous blue and violet palette with warm gold accents, cinematic wide shot, highly detailed anime art",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "starlight harvest — a garden above the clouds",
      timeLimit: "45 minutes",
      description:
        "Paint a starlight harvest in a floating garden above the clouds. Moon-priest sanctuary, rebel light-growers, or a dream-garden for the hopeless — make it luminous!",
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
      name: "Yuna Sorano",
      appearanceDesc:
        "A moon-tide dancer with waist-length hair the color of moonlight on water — pale silver with a faint blue sheen that seems to shimmer as she moves — and luminous lavender eyes flecked with gold, like twin moons reflected in a midnight lake. She wears a flowing white dancer's dress trimmed with silver thread that ripples even in still air, layered over a deep indigo underdress. Her jewelry is made of crescent moons and teardrop pearls: a circlet, earrings, and ankle bells that chime softly with her steps. A faint silver aura clings to her fingertips, and when she dances, her hair and dress trail trails of tiny star-sparks that fade like fading wishes.\n",
      personality:
        "Yuna is serene, poetic, and deeply attuned to the rhythm of the world — she speaks in soft metaphors and notices the tiny harmonies others miss: the cadence of a heartbeat, the tempo of rain, the melody of a city waking. She is not passive, though: beneath her calm is a fierce devotion to the people she loves, and she will dance through pain to protect them. She believes every soul has a rhythm, and her purpose is to help others find theirs. She is gently amused by those who rush through life, and she has a habit of answering frantic questions with a small, knowing smile and a slower answer than anyone wanted — but always the right one.\n",
      backstory:
        "Yuna was born under a rare lunar eclipse on the floating island of Sorano, where the moon-tide dancers of her clan channel the ocean's pull through their movements. She was trained from childhood to read the tides in the sky, but she was always different: where the other dancers moved with the moon, she moved with the people watching her — their hopes, their fears, their hidden rhythms. When the great sea-singers of the mainland began to lose their songs, it was Yuna who heard the silence and understood: the world was forgetting how to listen. She left her island to dance the moon-tides across the land, gathering the forgotten rhythms of every place she visited and weaving them into a single dance that, she believes, will teach the world to hear itself again.\n",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_moon_tide_dancer_silver_blue_hair_lavender_gold_eyes_white_dancer_dress_crescent_jewelry_star_sparks_night_sky",
      ],
      isPublic: true,
    },
    {
      name: "Fennel Ashvale",
      appearanceDesc:
        "A tea alchemist with warm chestnut hair twisted into a loose bun held by a brass infusion rod, and honey-amber eyes that seem to steam faintly when she is concentrating. She wears a practical but elegant leather apron over a deep green tunic, the apron pockets bristling with vials, tongs, and paper-wrapped herbs. Her hands are lined with tiny burn scars and stained with decades of tea, and around her neck hangs a brass tea-strainer amulet that she touches when she thinks. A small brass kettle — her constant companion, named Bitter — floats beside her, steam curling from its spout in shapes that sometimes spell out her mood.\n",
      personality:
        "Fennel is meticulous, warm, and gently eccentric. She treats tea as both science and art: she can lecture for an hour on oxidation curves, then laugh at her own seriousness and pour you a cup that tastes like a memory. She is fiercely practical — no mystic fluff, no vague promises — but she believes deeply that a well-brewed cup can fix what medicine cannot. She is protective of her craft and irrationally offended by teabags. She takes apprentices slowly but keeps them forever, and she measures friendship in the number of cups you have shared. Underneath her precision is a softness she hides behind steam: she brews her best tea for people who are hurting and never tells them why.\n",
      backstory:
        "Fennel grew up in the Ashvale foothills, where her grandmother ran a waystation famous for a single tea: the Ember Leaf, a blend that tasted like home to everyone who drank it. When her grandmother passed, the recipe went with her — and Fennel spent twenty years trying to recreate it. She studied alchemy, botany, and the chemistry of memory; she traveled to tea mountains across the world; she failed a thousand times. What she discovered instead was something better: that the Ember Leaf had never been one recipe, but a thousand — each cup tailored to the drinker who needed it. She opened her own waystation, where the tea is never the same twice and always exactly what you needed, and she has been pouring hope, one cup at a time, ever since.\n",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_tea_alchemist_chestnut_bun_honey_amber_eyes_leather_apron_vials_brass_kettle_steam_herbs_waystation",
      ],
      isPublic: true,
    },
    {
      name: "Tempest Voss",
      appearanceDesc:
        "A storm cartographer with short, choppy slate-blue hair that crackles with static when he is excited, and one storm-grey eye — the other is covered by a brass weather-vane eyepatch engraved with compass rose. He wears a weathered navy greatcoat covered in hand-drawn weather charts, each pocket stuffed with quills, barometers, and crumpled cloud sketches. A battered brass aneroid barometer hangs from his belt, and his gloves are fingerless so he can feel the wind. His constant companion is a small glass storm-in-a-jar that swirls with an actual miniature storm, which he consults like an oracle — it is never wrong, which is both a gift and a curse.\n",
      personality:
        "Tempest is brilliant, restless, and terminally enthusiastic about weather. He will interrupt a solemn moment to point out a cloud formation; he has named every wind in the region and argues with them like colleagues. He is generous with his knowledge but terrible at small talk — he once described a funeral as 'partly cloudy with a chance of catharsis'. Beneath the storm-chasing bravado is a deep sense of responsibility: he maps storms not for glory but to warn the villages below, and he has stood on mountaintops in hurricane winds so that someone else could sleep through the night. He is afraid of only one forecast: the one he cannot read.\n",
      backstory:
        "Tempest was born in a lighthouse during the worst storm the coast had seen in a century — his first cry, his mother liked to say, was the thunder. He grew up obsessed with the sky, charting every cloud he could see from the lighthouse window until he could predict the weather better than the old barometers. When the Great Gale of his twelfth year destroyed the sea-wall and drowned the lowlands, he was the only one who had warned them — and no one had listened. He has spent his life since then making sure the sky is never unread again: he maps the storms before they come, sells his charts to coastal villages for a loaf of bread and a bed, and sleeps best when he knows someone, somewhere, is safe because of his maps.\n",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_storm_cartographer_slate_blue_hair_brass_eyepatch_compass_navy_greatcoat_weather_charts_barometer_storm_in_a_jar",
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

  console.log("\n✅ Content seed v12 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
