/**
 * AniVerse — Dynamic Content Seed (2026-08-05)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (anatomy & proportions, hair & accessories, AI art ethics)
 * - 1 Daily Challenge (moonlit garden — bioluminescent fantasy)
 * - 3 New Characters (unique archetypes)
 * - Data hygiene: mark expired ACTIVE challenges as COMPLETED
 *
 * Run: npx tsx prisma/seed-content-20260805.ts
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
  console.log("🌱 Starting AniVerse content seed v8 (2026-08-05)...\n");

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
  // 1. BLOG ARTICLES (3 SEO-optimized — anatomy, hair, ethics)
  // ==============================================================

  const articles = [
    {
      title: "AI Anime Anatomy & Proportions: Drawing Believable Characters",
      slug: "ai-anime-anatomy-proportions-2026",
      content: `# AI Anime Anatomy & Proportions: Drawing Believable Characters

Anime anatomy is stylized, not random. The reason some AI characters feel "off" while others feel alive is almost always proportion — the head-to-body ratio, the placement of the eyes, the length of the limbs. Master proportion and your characters will read as intentional art instead of lucky generations. Here's the anatomy system behind believable anime characters.

## The Head-to-Body Ratio Is Everything

Real humans are about 7.5 heads tall. Anime lives on a sliding scale:

| Style | Heads Tall | Vibe |
|-------|-----------|------|
| Realistic seinen | 7 heads | Mature, grounded drama |
| Classic shonen | 6.5 heads | Heroic, athletic |
| Standard anime | 6 heads | The safe default |
| Romance/shoujo | 5.5 heads | Elegant, elongated |
| Chibi/comedy | 2-3 heads | Cute, exaggerated |

Prompt it explicitly: "6 heads tall, standard anime proportions" — and never mix ratios inside one character sheet.

## The Eyes Sit Lower Than You Think

In anime, the eyes are placed lower on the face than in realistic art — roughly at the vertical midpoint or slightly below. This is what gives anime faces their signature soft, youthful read. High-placed eyes read mature and intense; low-placed eyes read young and innocent. Choose deliberately per character.

## The "Three-Unit" Face

Divide the face into three horizontal units: hairline to brow, brow to nose base, nose base to chin. Anime compresses the middle unit and slightly elongates the lower one — the chin comes to a softer point and the jaw is narrower than real anatomy. Keep the ears between the brow and the nose base, and the neck about one-third the width of the head.

## Hands and Feet: The Consistency Killers

AI models are famously inconsistent with hands. Anchor them hard:

- **Fingers** — four fingers plus a thumb; count them in the prompt ("five fingers, natural hand pose")
- **Proportions** — the hand is roughly the size of the face
- **Feet** — the foot is about one head-length long; anime feet are small and detailed at the ankle

## The Torso Triangle

The chest-to-waist-to-hip relationship defines the silhouette:

- **Heroes** — broad shoulders tapering to a narrow waist (V-taper)
- **Heroines** — gentle hourglass with a defined waist
- **Kids/chibi** — minimal waist, round torso, big head

Prompt the silhouette before the details: "athletic V-taper torso, narrow waist, confident stance".

## Dynamic vs Neutral Poses

Neutral poses (standing straight, arms at sides) expose proportion errors instantly — that's why turnarounds use them. Dynamic poses hide errors behind motion. If you're testing a new design, generate a neutral pose first; if the anatomy holds there, it will hold anywhere.

## Anatomy Prompt Template

\\\`\\\`\\\`text
"anime character, [age range], [head-to-body ratio] heads tall, [body type] physique, [face shape] face, [eye placement] eyes, detailed hands and feet, consistent anatomy, full body, neutral pose"
\\\`\\\`\\\`

## Common Proportion Mistakes

1. **Head too large for the body** — check the ratio against your target style
2. **Eyes too high** — push them to the face midpoint or below
3. **Neck too thick** — anime necks are slim, especially for female characters
4. **Hands too small** — a hand should cover the face
5. **Mixed ratios** — don't combine a chibi head with a 7-head body

## Your Anatomy Challenge

Generate the same character at three ratios: 7-head (mature), 6-head (standard), and 3-head (chibi). Keep the design identical otherwise. This single exercise teaches you more about anime proportion than a hundred random generations — because you'll *see* the ratio do the work.

> *"Proportion is the grammar of character design. Learn the rules, then break them on purpose." — @AnatomySensei, AniVerse Creator*`,
      excerpt:
        "Master AI anime anatomy: head-to-body ratios, eye placement, the three-unit face, hands and feet consistency, and the silhouette-first approach to believable characters.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_anatomy_proportions_character_ratio_comparison_7_head_6_head_chibi_sketch_reference_stylized",
      tags: ["Anatomy", "Character Design", "Art Tutorial", "Proportions", "Technique"],
      seoTitle: "AI Anime Anatomy & Proportions: Believable Characters (2026) | AniVerse",
      seoDesc:
        "Learn AI anime anatomy: head-to-body ratios for every style, eye placement rules, the three-unit face, and how to keep hands and feet consistent in AI art.",
      isPublished: true,
      publishedAt: new Date("2026-08-05T00:00:00Z"),
    },
    {
      title: "Anime Hair & Accessories: Design Language That Defines Characters",
      slug: "anime-hair-accessories-design-language-2026",
      content: `# Anime Hair & Accessories: Design Language That Defines Characters

Hair is the most powerful design tool in anime. Before a viewer reads a face, they read a silhouette — and hair is the largest part of that silhouette. Accessories are the second read: they tell profession, allegiance, and personality in a glance. Together they form a character's design language. Here's how to speak it fluently in AI prompts.

## Silhouette First, Details Second

A great character is recognizable in pure black silhouette. Test your design: if the hair shape alone doesn't identify the character, it isn't doing its job. Spiky hair = energy; long flowing hair = elegance or mystery; twin tails = youth and energy; a shaggy bob = casual cool.

## Hair Shape Vocabulary

| Shape | Reads As | Best For |
|-------|----------|----------|
| Spiky / flame | Aggressive, energetic | Shonen heroes, rivals |
| Long and straight | Calm, traditional | Heroines, royalty |
| Wild / unkempt | Free-spirited, wild | Rogues, outsiders |
| Twin tails / drills | Youthful, playful | Genki girls, idols |
| Very short | Practical, disciplined | Soldiers, tomboys |
| Asymmetrical | Unconventional, stylish | Antagonists, fashionistas |

## Color Is a Personality Statement

Hair color in anime is character code, not biology:

- **Black / dark** — grounded, mysterious, serious
- **White / silver** — ancient, powerful, otherworldly
- **Red / orange** — passionate, hot-blooded
- **Blue / cyan** — calm, cool, sometimes cold
- **Pink / pastel** — gentle, romantic, sometimes deceptive
- **Green / teal** — natural, healing, eccentric

The "unnatural hair color" convention is a free pass to code personality directly into the design — use it.

## The Accessory Layer

Accessories do three jobs: tell profession, show allegiance, and create a hook (a memorable detail). Prompt them deliberately:

- **Headwear** — ribbons, tiaras, goggles, hats, hairpins (a signature hairpin is a classic hook)
- **Jewelry** — earrings, chokers, rings (chokers read fashionable or dangerous)
- **Equipment** — swords, wands, staves, smartphones (profession at a glance)
- **Marks** — tattoos, scars, birthmarks (history in a detail)

Rule: one strong accessory beats five weak ones. A single mismatched earring tells a story; a pile of random trinkets reads as noise.

## Consistency Across Generations

Hair and accessories are the FIRST things AI models change between generations. Lock them with an unchangeable block in every prompt:

\\\`\\\`\\\`text
"character design: [name], [hair color + style + length], [signature accessory], same hairstyle, same accessories, consistent design"
\\\`\\\`\\\`

Never describe hair as "nice hair" — describe it as "crimson spiky hair with a single golden ahoge". Specific beats vague, every time.

## The Ahoge and Other Signature Details

The ahoge (the single antenna-like strand of hair) is anime's most famous signature detail. It reads as energetic, slightly goofy, or spiritually attuned. Other signature details: a beauty mark, a chipped horn, a permanent blush, a cracked lens. Pick ONE signature detail per character and never generate without it.

## Accessory Prompt Template

\\\`\\\`\\\`text
"anime portrait, [character name], [hair: color, style, length], [signature accessory], [clothing accent color], studio lighting, clean lineart, character reference, highly detailed"
\\\`\\\`\\\`

## Design Language Checklist

- [ ] Silhouette recognizable in black
- [ ] Hair color codes the personality
- [ ] One signature accessory
- [ ] One signature detail (ahoge, mark, scar)
- [ ] Accessories match profession and allegiance

## Your Hair Challenge

Take one character and redesign them with three different hair silhouettes (e.g., spiky, long, and bob). Keep everything else identical. Notice how each version tells a different story — then pick the one that best matches their personality and commit to it.

> *"Hair is the character's flag. Plant it in the viewer's memory and never lower it." — @SilhouetteStudio, AniVerse Creator*`,
      excerpt:
        "Design anime hair & accessories that define characters: silhouette-first thinking, hair shape vocabulary, color psychology, and signature details that survive AI generation.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_hair_design_silhouette_variations_spiky_long_bob_character_accessories_signature_detail_stylized",
      tags: ["Hair Design", "Character Design", "Accessories", "Art Tutorial", "Silhouette"],
      seoTitle: "Anime Hair & Accessories: Design Language That Defines Characters (2026) | AniVerse",
      seoDesc:
        "Master anime hair and accessory design: silhouette-first character design, hair shape vocabulary, color personality coding, and signature details that stick.",
      isPublished: true,
      publishedAt: new Date("2026-08-05T02:00:00Z"),
    },
    {
      title: "AI Art Ethics & Originality: Building a Responsible Creator Practice",
      slug: "ai-art-ethics-originality-creators-2026",
      content: `# AI Art Ethics & Originality: Building a Responsible Creator Practice

AI art is a tool, and like any tool it has an ethics manual. As AI anime creation goes mainstream, the creators who thrive are the ones who build an honest, original practice from day one. This guide covers the practical ethics of AI art: originality, sourcing, disclosure, and community responsibility.

## Originality Is a Process, Not a Magic Trick

Originality in AI art doesn't mean the model invented everything — it means YOU did. The model samples its training data; your originality lives in:

- **Prompt design** — the specific combination of style, subject, and constraints
- **Iteration** — the choices you make across dozens of generations
- **Post-processing** — the edits, composites, and refinements you add
- **Worldbuilding** — the characters, stories, and universes you build around the art

Document your process. A creator who can explain WHY a piece looks the way it does is a creator with a practice, not a prompt parrot.

## Know Your Sources

Different models and services have different training disclosures. Before you build a commercial workflow:

- **Read the license** of the model/service you use
- **Check the training data policy** — opt-out, attribution, or unknown
- **Keep records** — prompts, seeds, dates, model versions

AniVerse surfaces the model and prompt metadata on every artwork so your process is transparent by default.

## Disclosure: Be Honest With Your Audience

The AI art community runs on trust. The rules that keep it healthy:

1. **Label AI-assisted work** — when a piece is AI-generated or AI-assisted, say so
2. **Don't claim human-only authorship** for AI work — it erodes trust for everyone
3. **Be specific** — "AI-assisted, human-edited" is more honest than a vague tag

Audiences don't reject AI art; they reject deception. Transparency is the cheapest trust-builder available.

## Respect Other Creators

The cardinal rules of the community:

- **Don't prompt-copy** other creators' exact private prompts without permission
- **Don't pass off another person's generation as your own**
- **Don't train on other artists' styles without their consent** — a "style of X" prompt on a living artist's name is a choice; make it consciously
- **Credit inspiration** — if a piece was inspired by a specific artist or work, name it

## Copyright Reality Check

AI art copyright is a moving target — laws differ by country and are still being written. The practical stance:

- **Your prompts and edits** are your creative contribution
- **The generated output's copyright status** depends on jurisdiction and the model's license
- **Commercial use** — verify the model/service license permits it before selling
- **Derivative characters** — don't copy existing franchise characters and sell them as your own

When in doubt, ask the platform, the model provider, or a lawyer. "Everyone does it" is not a license.

## Building a Responsible Workflow

1. **Prompt with intention** — know what you want and why
2. **Iterate with judgment** — reject outputs that don't serve your vision
3. **Document everything** — seeds, prompts, versions, dates
4. **Disclose consistently** — label AI work everywhere you post it
5. **Credit generously** — inspiration, references, and collaborators
6. **Give back** — share technique, not just finished pieces

## The Community Responsibility

The AI art community is young and its reputation is still being written. Every time you post a labeled, original, respectful AI artwork, you add a good page to that reputation. Every time someone passes off unlabeled AI work as human-made, the whole community pays. Choose which page you write.

## Your Ethics Checklist

- [ ] I can explain my process honestly
- [ ] I've read the model/service license
- [ ] I label AI-assisted work clearly
- [ ] I don't copy other creators' prompts or works
- [ ] I credit inspiration where it's due

> *"The tool is artificial. The artist is you. Act like it." — @EthicsMuse, AniVerse Creator*`,
      excerpt:
        "Build a responsible AI art practice: originality through process, honest disclosure, respecting other creators, copyright reality, and community stewardship.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_artist_ethics_originality_creative_process_sketchbook_ai_tools_balance_transparency_stylized",
      tags: ["Ethics", "Originality", "Creator Guide", "Community", "Responsibility"],
      seoTitle: "AI Art Ethics & Originality: Responsible Creator Practice (2026) | AniVerse",
      seoDesc:
        "AI art ethics for creators: originality through process, honest disclosure rules, respecting fellow artists, copyright reality, and building community trust.",
      isPublished: true,
      publishedAt: new Date("2026-08-05T04:00:00Z"),
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
  // 2. DAILY CHALLENGE (1 active daily challenge for 2026-08-05)
  // ==============================================================

  const challenge = {
    title: "Moonlit Garden: Bioluminescent Fantasy",
    description:
      "Today's challenge: design a moonlit garden where the plants glow with bioluminescent light! Imagine luminous flowers that pulse like heartbeats, crystal trees that refract moonlight into rainbows, and firefly spirits drifting between the petals. Decide: is your garden a hidden sanctuary, a dangerous lure for lost travelers, or a memorial planted by a grieving mage? Spend 30-45 minutes on your design. The most striking entry wins 150 coins and a feature on our homepage!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-08-05T00:00:00Z"),
    endsAt: new Date("2026-08-06T00:00:00Z"),
    rewardCoins: 150,
    prompt:
      "moonlit garden with bioluminescent plants, glowing flowers and mushrooms, crystal trees refracting moonlight, firefly spirits, magical atmosphere, deep blue night palette with cyan and gold glow, cinematic wide shot, highly detailed anime art",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "moonlit garden — bioluminescent fantasy",
      timeLimit: "45 minutes",
      description:
        "Design a moonlit garden alive with bioluminescent light. Sanctuary, lure, or memorial — make it unforgettable!",
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
      name: "Aoi Tenchi",
      appearanceDesc:
        "A serene celestial guardian with waist-length storm-blue hair that drifts as if underwater, and pale luminous eyes that shift between sky blue and silver. She wears a flowing white-and-azure hanfu layered with translucent silk, embroidered with constellations and wind patterns that shimmer faintly. A delicate circlet of crystalline feathers rests on her brow, and a ribbon of woven starlight trails from her waist. Small motes of light drift around her fingertips, and her bare feet hover a breath above the ground.",
      personality:
        "Aoi is patient in a way that feels ancient — she listens with complete stillness and answers only when the silence has settled. She speaks in calm, precise sentences, rarely raises her voice, and treats every living thing with the same gentle attention, from a crying child to a wounded sparrow. She is deeply protective of the boundary between the human world and the spirit realm, and carries a quiet sadness about the moments that boundary is crossed. She finds human chaos exhausting but endearing, and keeps a private journal of 'the small beautiful things' she notices in the mortal world.",
      backstory:
        "Aoi was once the youngest of the Tenchi, the celestial guardians who watch over the borders between worlds. Unlike her stern elders, she believed that guardianship meant understanding humans, not merely overseeing them. When a young shrine maiden died protecting a village from a rogue spirit, Aoi descended to the mortal realm to honor her promise to watch over the village in her place. She has lived there ever since, a quiet protector who appears when the boundary thins — at festivals, at funerals, at the exact moment a lost child needs a hand. The celestial court considers her exile; she considers it her purpose.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_celestial_guardian_storm_blue_hair_luminous_eyes_white_azure_hanfu_constellations_starlight_ribbon",
      ],
      isPublic: true,
    },
    {
      name: "Chrome Kagami",
      appearanceDesc:
        "A sleek cyber-knight whose armor is made of mirror-polished chrome plates etched with faint circuit patterns that glow a soft magenta. His short, asymmetrical silver hair is shaved on one side, and his right eye is a mechanical visor that reflects the world back at him — literally, a mirror eye. A long chrome scarf flows behind him, rippling like liquid mercury, and a curved energy blade hums at his hip. Every surface of his armor reflects his surroundings, making him shimmer and shift as he moves, a living mirror in a neon world.",
      personality:
        "Chrome is sharp, sardonic, and deeply private — he deflects every personal question with a quip and a mirror-shine smile. He projects total confidence, but his mirror eye is a defense mechanism: he is terrified of being truly seen, so he shows everyone only reflections of themselves. He is fiercely loyal to the few people who have seen past his armor, and would burn the city down for them without hesitation. He collects small broken things — cracked mirrors, dead screens, shattered lenses — and fixes them meticulously, though he refuses to explain why.",
      backstory:
        "Kagami was a rising star in the Neo-Chrome Corps, an elite unit of cyber-knights who protected the city's data core. During a catastrophic breach, his squad was ordered to sacrifice a residential district to save the core. He refused — and watched his commander execute the order anyway, then erase all records of the district's existence. Kagami deserted, taking with him the only surviving shard of the district's mirror-network: a single reflective fragment that now powers his mirror eye. He now works as a freelance protector-for-hire, taking jobs that let him save the people the system writes off — and hunting the commander who made him a mirror of a dead district.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_cyber_knight_chrome_mirror_armor_magenta_circuits_silver_hair_mechanical_visor_mirror_eye_neon_city",
      ],
      isPublic: true,
    },
    {
      name: "Pomme the Pastry Witch",
      appearanceDesc:
        "An adorable young witch with soft caramel-pink hair in two messy braids, and warm honey-gold eyes that crinkle when she smiles. She wears a cream-and-rust patissier outfit under a oversized black witch hat tilted jauntily to one side, with a tiny apple-shaped brooch pinning her cape. A floating heart-shaped familiar made of hardened sugar and spun glass hovers by her shoulder. Her apron is dusted with flour and cocoa, and she carries a wooden spoon that glows faintly at the tip — her wand, which she insists is 'just a very magical spoon'.",
      personality:
        "Pomme is sunshine with a pastry bag: relentlessly cheerful, endlessly generous, and completely incapable of doing anything by half measures. She greets every problem with 'let's bake our way through it!' and genuinely believes that a well-made cake can fix most of the world's troubles — and she is startlingly often right. She is scatterbrained about everything except recipes, which she treats as sacred texts, and she takes her craft with deadly seriousness even while bouncing with joy. She has a quiet, fierce protectiveness over the children of her village, who she feeds on festival days and defends with a surprisingly sharp glare when needed.",
      backstory:
        "Pomme was apprenticed to the legendary witch-patissier Margaux, who ran a tiny bakery at the edge of a forest where the sweets were said to carry spells — courage in the chocolate, comfort in the cream. When Margaux vanished into the forest during a magical blight, she left Pomme the bakery, the recipe book, and a final note: 'The magic was never in the recipes, dear. It was in the reason you bake.' Pomme now runs the bakery and wanders the region with her sugar familiar, baking for festivals, weddings, and the occasional dragon with a sweet tooth — convinced that somewhere in her thousandth recipe, she'll find the one that brings Margaux home.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_pastry_witch_caramel_pink_braids_honey_eyes_patissier_outfit_witch_hat_sugar_familiar_apple_brooch",
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

  console.log("\n✅ Content seed v8 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
