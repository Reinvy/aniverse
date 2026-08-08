/**
 * AniVerse — Dynamic Content Seed (2026-08-08)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (color theory, silhouette design, AI prompt
 *   engineering with negative prompts) — the first is marked `featured` so
 *   the blog landing hero showcases fresh content.
 * - 1 Daily Challenge (neon rain midnight market — reflections & light)
 * - 3 New Characters (unique archetypes: phantom guardian, star
 *   cartographer, moon rabbit café owner)
 * - Data hygiene: mark expired ACTIVE challenges as COMPLETED
 *
 * Run: npx tsx prisma/seed-content-20260808.ts
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
  console.log("🌱 Starting AniVerse content seed v10 (2026-08-08)...\n");

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
  // 1. BLOG ARTICLES (3 SEO-optimized — color theory, silhouette
  //    design, prompt engineering). First article is FEATURED.
  // ==============================================================

  const articles = [
    {
      title: "Anime Color Theory: Palettes That Tell the Story Before You Do",
      slug: "ai-anime-color-theory-palettes-2026",
      content: `# Anime Color Theory: Palettes That Tell the Story Before You Do

Color is the first thing a viewer reads — before the character moves, before the dialogue lands, before the plot twists. A palette can whisper "this is a romance" or scream "this is a war" with zero words. This guide breaks down how to wield anime color theory so your AI art communicates before a single panel is read.

## Every Palette Has a Temperature

Color temperature is the fastest storytelling shortcut in anime:

- **Warm palettes (amber, coral, gold)** — comfort, passion, energy, nostalgia
- **Cool palettes (blue, teal, violet)** — calm, distance, technology, melancholy
- **Neutral palettes (grey, beige, muted)** — realism, seriousness, documentary tone

The same scene painted warm or cool tells two different stories. A café at golden hour is cozy; the same café under cold blue light is lonely.

## The Dominant-Hue Rule

Pick ONE dominant hue for a scene (60%+ of the visible color) and let everything else support it. A red-dominated scene is aggressive even when nothing violent happens; a teal-dominated scene reads futuristic even in a forest. Supporting hues create contrast — a single warm accent inside a cool scene draws the eye like a magnet.

## Character Color Language

Anime assigns meaning to character colors deliberately:

| Color | Common Meaning | Example Archetype |
|-------|----------------|-------------------|
| Red | Passion, danger, determination | The rival / the hero |
| Blue | Calm, loyalty, sadness | The strategist / the quiet one |
| Gold | Royalty, divinity, ambition | The heir / the chosen one |
| Purple | Mystery, magic, otherness | The mage / the outsider |
| Green | Nature, growth, envy | The healer / the rival |
| White | Purity, absence, death | The martyr / the blank slate |
| Black | Power, hidden, grief | The antagonist / the shadow |

Keep a character's palette consistent across every image — their color identity is as important as their face.

## The Anime Gradient Trick

Flat colors read as "design", gradients read as "light". Anime backgrounds use gradients everywhere: sky fading from deep blue to peach at the horizon, neon glow bleeding into wet pavement, rim light melting into shadow. When prompting, name the gradient explicitly: "the sky is a gradient from indigo to warm amber near the horizon".

## Complementary Pop

Opposites on the color wheel create the classic anime "pop": orange hair against a blue sky, teal eyes in a red-lit room, a gold accent on an obsidian character. Use complementary pairs for heroes and their environments — the character should visually detach from the background.

## Mood Boards Before Prompts

The most reliable workflow: build a 3-color mood board (dominant, support, accent) BEFORE writing a prompt. Then describe the palette in your prompt: "dominant deep teal, support warm amber, accent coral red". The model follows explicit palettes far better than vague words like "pretty colors".

## Your Color Challenge

Take one character and generate the SAME pose in three palettes: warm (hope), cool (grief), and neutral (documentary). Keep everything else identical. Compare how the story changes with only the colors — that is anime color theory in action.

> *"A palette is a promise about the story you are telling." — @HueCaster, AniVerse Creator*`,
      excerpt:
        "Master anime color theory: temperature as storytelling, the dominant-hue rule, character color language, gradient tricks, and complementary pops that make heroes detach from backgrounds.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_color_theory_palette_swatches_warm_amber_cool_teal_complementary_orange_blue_gradient_sky_character_silhouette",
      tags: ["Color Theory", "Art Tutorial", "Character Design", "Palette", "Composition"],
      seoTitle: "Anime Color Theory: Palettes That Tell the Story Before You Do (2026) | AniVerse",
      seoDesc:
        "Master anime color theory: palette temperature as storytelling, the dominant-hue rule, character color language, and complementary pops that make your AI art communicate instantly.",
      isPublished: true,
      publishedAt: new Date("2026-08-08T00:00:00Z"),
      featured: true,
    },
    {
      title: "Silhouette First: Designing Anime Characters That Read at a Glance",
      slug: "anime-character-silhouette-design-2026",
      content: `# Silhouette First: Designing Anime Characters That Read at a Glance

Show a viewer a character's silhouette in pitch black — if they cannot tell who it is, the design is not finished. Silhouette is the oldest and most powerful test in character design: before color, before detail, before expressions, the shape must carry the identity. Here is how to design anime characters that read instantly, even at thumbnail size.

## Why Silhouette Matters

The human brain recognizes shapes in 100 milliseconds — long before it processes color or texture. When your character appears in a crowd scene, in the distance, or in a tiny panel, the silhouette is doing 90% of the recognition work. Strong silhouettes make characters unforgettable; weak ones make them interchangeable.

## The Three-Silhouette Rule

A strong character design has THREE distinct silhouettes that all read clearly:

1. **Standing** — the iconic pose (how they occupy space at rest)
2. **Action** — the signature move (how they move through the world)
3. **Profile** — the side view (how their hair/weapons/props extend)

If all three read as the same blob, the design lacks structure. Each should be recognizable as THAT character and no other.

## Silhouette Vocabulary

Build characters from distinct shape languages:

| Shape | Reads As | Example |
|-------|----------|---------|
| Triangle (wide base) | Stability, power | The tank / the guardian |
| Inverted triangle | Speed, tension | The sprinter / the assassin |
| Circle | Warmth, softness | The healer / the comic relief |
| Rectangle | Discipline, rigidity | The soldier / the bureaucrat |
| S-curve | Grace, danger | The femme fatale / the dancer |
| Asymmetry | Unpredictability | The trickster / the rogue |

## Extensions Are Identity

The fastest way to differentiate silhouettes is EXTENSION — anything that sticks out from the body:

- Hair: spikes, buns, long flowing tails, twin drills, gravity-defying strands
- Weapons: oversized blades, staffs, chains, fans, umbrellas
- Clothing: capes, long coats, ribbons, scarves, trailing sleeves
- Accessories: hats, masks, animal ears, floating companions

Rule of thumb: your character should have at least ONE extension that is unique to them. If you removed it and the silhouette still reads, great — if not, the design leans on that prop too hard.

## The Thumbnail Test

Scale your character down to a 50-pixel thumbnail and check:

1. Can you tell who it is? (identity)
2. Can you tell their role? (fighter / mage / support)
3. Can you tell their personality? (calm / wild / mysterious)

If any answer is "no", increase the shape contrast: make the hair bigger, the weapon longer, the posture more extreme. Anime designs succeed at thumbnail scale because they exaggerate — realism is the enemy of silhouette.

## Prompting Silhouettes with AI

AI models need explicit shape instructions:

\\\`\\\`\\\`text
"anime character design, full body, [name], [shape language], [hair extension], [clothing extension], [signature weapon/prop], strong readable silhouette, plain dark background, character reference sheet, front and back view"
\\\`\\\`\\\`

Example: "inverted triangle build, spiky silver hair extending up and back, long tattered coat trailing behind, twin daggers at the hips, strong readable silhouette".

## The Cast Test

Design five characters and arrange their silhouettes side by side. If any two could be confused at thumbnail size, redesign one. A great cast is a set of silhouettes that are all strong individually AND distinct from each other — that is what makes ensemble shows like the classics feel so alive.

## Your Silhouette Challenge

Take one of your existing characters and generate them in pure black silhouette against a white background. Then redesign ONE extension (hair, weapon, or clothing) to make the silhouette stronger. Compare before and after — you will see the shape do the work.

> *"If they recognize them in the dark, you have designed a character. If not, you have designed a costume." — @ShapeSage, AniVerse Creator*`,
      excerpt:
        "Design anime characters that read at a glance: the three-silhouette rule, shape language vocabulary, extensions as identity, the thumbnail test, and prompting silhouettes with AI.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_character_silhouette_design_black_shapes_white_background_distinct_profiles_spiky_hair_weapon_cape",
      tags: ["Character Design", "Silhouette", "Art Tutorial", "Design Fundamentals", "OC"],
      seoTitle: "Silhouette First: Designing Anime Characters That Read at a Glance (2026) | AniVerse",
      seoDesc:
        "Design anime characters with unforgettable silhouettes: shape language, extensions as identity, the thumbnail test, and AI prompting tricks for characters that read instantly.",
      isPublished: true,
      publishedAt: new Date("2026-08-08T02:00:00Z"),
    },
    {
      title: "AI Prompt Engineering for Anime: Negative Prompts & Style Locking",
      slug: "ai-prompt-engineering-anime-negative-prompts-2026",
      content: `# AI Prompt Engineering for Anime: Negative Prompts & Style Locking

Anyone can type "anime girl, beautiful" and get an image. Getting the RIGHT image — consistent, clean, and on-style — requires prompt engineering. This guide covers the two most powerful techniques in the AI anime artist's toolkit: negative prompts that delete the garbage, and style locking that keeps every image in the same universe.

## Negative Prompts: The Delete Key

Negative prompts tell the model what NOT to draw. They are the fastest quality upgrade in AI art. Start every generation with a baseline negative block:

\\\`\\\`\\\`text
"extra fingers, extra arms, mutated hands, deformed face, bad anatomy, bad proportions, cropped head, out of frame, watermark, signature, text, logo, jpeg artifacts, blurry, low quality, worst quality"
\\\`\\\`\\\`

## Common Anime-Specific Negatives

- **Anatomy:** extra fingers, six fingers, missing fingers, fused fingers, extra limbs, mismatched eyes, asymmetric eyes
- **Style drift:** western cartoon style, realistic photo, 3d render, live action, CG
- **Composition:** cropped, out of frame, off-center, head cut off, multiple heads
- **Quality:** lowres, bad anatomy, bad hands, worst quality, low quality, blurry, jpeg artifacts
- **Content noise:** watermark, signature, artist name, text, letters, logo

Adjust negatives per scene — a dramatic close-up needs "cropped head" removed from the block, while a full-body shot needs it front and center.

## Style Locking: The Same Universe, Every Time

Style locking is how you keep 20 images looking like one show instead of 20 random pictures. The technique: a fixed STYLE BLOCK appended to every prompt, word for word.

\\\`\\\`\\\`text
"anime style, cel shading, clean lineart, vibrant colors, detailed background, masterpiece quality, same art style"
\\\`\\\`\\\`

## The Anatomy of a Production Prompt

A production-ready anime prompt has five parts:

1. **Subject block** — who/what: "a teenage archer with silver hair and crimson eyes"
2. **Action/emotion block** — what they do/feel: "drawing a glowing bow, determined expression"
3. **Scene block** — where/when: "moonlit forest clearing, fireflies, midnight blue palette"
4. **Style lock** — the universe: "anime style, cel shading, clean lineart, vibrant colors"
5. **Negative block** — what to delete: "bad anatomy, extra fingers, watermark, blurry"

## Consistency Tokens

For character consistency across images, freeze a descriptor block — 8-12 words that NEVER change:

\\\`\\\`\\\`text
"[silver spiky hair, crimson eyes, black and gold jacket, red scarf]"
\\\`\\\`\\\`

Use the identical block in every prompt for that character. When combined with the style lock, the model has a much higher chance of keeping the design stable.

## Weighting and Emphasis

Most anime prompt systems support emphasis with parentheses and weights:

- \`(keyword:1.3)\` — stronger presence
- \`(keyword:0.7)\` — weaker presence
- \`[keyword]\` — reduced weight
- \`keyword + keyword\` — sequential emphasis

Use weights for the elements that MUST be right (the character, the style lock) and leave the scene details unweighted so the model has freedom.

## The Iteration Loop

Professional prompt engineering is a loop, not a one-shot:

1. Generate → inspect → identify the ONE biggest flaw
2. Fix it in the negative prompt OR add a specific positive
3. Re-generate with everything else IDENTICAL
4. Repeat until clean — change one variable at a time

Never change three things between attempts — you will never know what fixed it.

## Your Prompt Engineering Challenge

Take one of your weakest recent images and rebuild it with the full five-part production prompt: subject, action, scene, style lock, and a strong negative block. Then run the iteration loop three times. Compare the first and last result — that gap is what prompt engineering is worth.

> *"The prompt is a contract. The negative prompt is the fine print." — @PromptPilot, AniVerse Creator*`,
      excerpt:
        "Engineer AI anime prompts like a pro: negative prompts that delete bad anatomy and watermarks, style locking for universe consistency, five-part production prompts, and the iteration loop.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_prompt_engineering_negative_prompts_style_lock_consistency_tokens_cel_shading_clean_lineart_vibrant",
      tags: ["Prompt Engineering", "AI Art", "Art Tutorial", "Consistency", "Workflow"],
      seoTitle: "AI Prompt Engineering for Anime: Negative Prompts & Style Locking (2026) | AniVerse",
      seoDesc:
        "Master AI anime prompt engineering: negative prompts that delete the garbage, style locking for one universe, five-part production prompts, and consistency tokens for stable characters.",
      isPublished: true,
      publishedAt: new Date("2026-08-08T04:00:00Z"),
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
  // 2. DAILY CHALLENGE (1 active daily challenge for 2026-08-08)
  // ==============================================================

  const challenge = {
    title: "Neon Rain: Reflections of the Midnight Market",
    description:
      "Tonight's challenge: paint a midnight market under neon rain! Imagine a bustling night market where every puddle is a mirror of electric signs — cyan, magenta, and gold reflections rippling with every footstep. Decide: is your market a hidden district only visible when it rains, a trading hub for smugglers and spirits, or a memory of a city that no longer exists? Spend 30-45 minutes on your scene. The most atmospheric entry wins 150 coins and a feature on our homepage!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-08-08T00:00:00Z"),
    endsAt: new Date("2026-08-09T00:00:00Z"),
    rewardCoins: 150,
    prompt:
      "midnight market in neon rain, wet pavement reflecting cyan magenta and gold signs, umbrellas and lanterns, atmospheric rain streaks catching light, bustling stalls with steam and glow, cinematic wide shot, deep blues with electric accents, highly detailed anime art",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "neon rain — reflections of the midnight market",
      timeLimit: "45 minutes",
      description:
        "Paint a midnight market under neon rain where every puddle mirrors electric signs. Hidden district, smuggler's hub, or ghost city — make it unforgettable!",
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
      name: "Ren Kagerou",
      appearanceDesc:
        "A tall phantom guardian with pale ash-grey hair that fades to ember-orange at the tips, and mismatched eyes — one deep amber, one glowing white like a banked coal. He wears a high-collared black tactical coat over charcoal grey armor plates, with a flame-resistant scarf wrapped around his neck that never quite stops smoldering. Faint embers drift from his shoulders when he moves, and his left hand is wrapped in blackened bandages that glow from within when he summons fire. A sleek fire-extinguisher-shaped device hangs at his hip — a gift from the firefighters who raised him.",
      personality:
        "Ren is quiet, watchful, and relentlessly protective — the kind of guardian who notices exits, fire hazards, and panicking people before anyone else. He speaks in short sentences and has a dry, understated humor that surprises people who mistake his silence for coldness. He is deeply uncomfortable with being called a hero: he insists he is just 'a firefighter who happens to be a phantom'. Beneath the calm exterior is a fierce guilt — he blames himself for every life he could not save, which is why he never stops training, never stops patrolling, and never lets anyone stand between him and a burning building.",
      backstory:
        "Ren died in a warehouse fire ten years ago, but the flames refused to let him go. He woke as a phantom bound to the district he died protecting — a living guardian of the neighborhood's fire lanes and rescue routes. The local firefighters, who once carried his body out of the ashes, eventually learned to work with him: he can walk through smoke, sense trapped survivors, and command the embers of any blaze. He has spent a decade building a network of hidden water caches, emergency exits, and escape routes across the district. His goal is simple and impossible: make the district so safe that his second death — and his final rest — can finally come.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_phantom_firefighter_ash_grey_hair_ember_tips_mismatched_eyes_amber_white_black_tactical_coat_smoldering_scarf_embers",
      ],
      isPublic: true,
    },
    {
      name: "Sable Voss",
      appearanceDesc:
        "A celestial cartographer with deep indigo skin marked by faint silver constellations that shift slowly across her arms and cheeks, and voluminous midnight-black hair threaded with glowing star-strands. She wears a flowing astronomer's robe of deep violet with a high collar, embroidered with gold orbital lines, and a wide-brimmed hat tilted to shade one star-bright golden eye. A large leather-bound star atlas hangs from her belt, its cover embossed with a crescent moon, and a brass astrolabe floats beside her, slowly rotating. When she points at the sky, thin lines of starlight trace the constellations she names.",
      personality:
        "Sable is brilliant, absent-minded, and utterly convinced that the universe is a story she is slowly learning to read. She talks to stars like old friends, annotates everything (including people's faces, which she sketches in the margins of her atlas), and has a habit of answering questions with fascinating tangents that eventually — usually — return to the point. She is fiercely generous with her knowledge and genuinely delighted when someone else notices a pattern she missed. Under the dreamy exterior is a razor-sharp mind: she has calculated the exact position of every star in her atlas, and she will notice if yours is missing.",
      backstory:
        "Sable was born in an observatory during a meteor shower and has been mapping the sky ever since. But her atlas is not a record of stars — it is a record of LOST stars: every constellation that faded, every star that vanished from the sky, she has charted with obsessive precision. She believes the sky is slowly forgetting itself, and that somewhere beyond the edge of the map is the reason why. She travels from city to city, climbing the tallest towers and asking the oldest telescopes one question: 'Where did the stars go?' She has mapped 3,000 lost stars so far, and she is certain the answer to the sky's amnesia is written in the pattern they left behind.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_star_cartographer_indigo_skin_silver_constellations_midnight_hair_star_strands_violet_robe_gold_orbits_astrolabe",
      ],
      isPublic: true,
    },
    {
      name: "Momo Tsukimi",
      appearanceDesc:
        "A cheerful moon rabbit café owner with fluffy white-and-pink ears, large round ruby eyes, and a cloud-soft bob of pale pink hair. She wears a cream-and-coral apron over a pastel dress patterned with tiny crescent moons, with a rabbit-tail pom-pom at the back and a brass pocket watch shaped like a full moon hanging from her neck. Her café uniform includes fingerless mitts with paw pads, and she always carries a wooden tray with a steaming cup of her signature moon-milk latte. When she smiles, the tips of her ears twitch, and small sparkles drift from her hair like dust from a sugar bowl.",
      personality:
        "Momo is warm, endlessly energetic, and dangerously good at making people feel at home — she remembers every regular's order, every birthday, and every sad story that walked through her door. She talks in exclamations, hums while she works, and treats every customer like a guest at a festival. But she is also shrewd: her café is the quiet heart of a network that connects the moon-touched folk of the city — the werefolk, the dreamwalkers, the ones who glow faintly at night. She never asks for payment in coin when a favor will do, and she keeps a chalkboard of 'debts of kindness' that she never lets anyone forget — including herself.",
      backstory:
        "The Tsukimi family has run the Moonhare Café for three generations, a refuge for the moon-touched of the city. Momo inherited it from her grandmother, who inherited it from her own mother — and with it, the family secret: every full moon, the café's back door opens onto a tiny sliver of the moon itself, where the family grows the pale herbs that make their famous moon-milk tea. Momo is the first Tsukimi to realize the door is not a family heirloom but a responsibility: the moon's garden is slowly dying, and the café is the only bridge that can save it. She has started asking her most trusted customers for help — one cup of tea at a time.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_moon_rabbit_cafe_owner_white_pink_ears_ruby_eyes_pale_pink_hair_cream_coral_apron_crescent_moon_dress_moon_milk_latte",
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

  console.log("\n✅ Content seed v10 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
