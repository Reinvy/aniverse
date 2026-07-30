/**
 * AniVerse — Dynamic Content Seed (2026-07-30)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (community, monetization, creator stories)
 * - 1 Daily Challenge 
 * - 3 New Characters
 *
 * Run: npx tsx prisma/seed-content-20260730.ts
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
  console.log("🌱 Starting AniVerse content seed v2 (2026-07-30)...\n");

  const admin = await getOrCreateAdminUser();
  console.log(`✅ Admin user: ${admin.name} (${admin.id})`);

  // ==============================================================
  // 1. BLOG ARTICLES (3 SEO-optimized — community & creator focus)
  // ==============================================================

  const articles = [
    {
      title: "How to Monetize Your AI Art: A Creator's Guide to Earning with AniVerse",
      slug: "monetize-ai-art-creator-guide-2026",
      content: `# How to Monetize Your AI Art: A Creator's Guide to Earning with AniVerse

So you've been creating stunning AI anime art with AniVerse — now what? It's time to turn your passion into profit. Here's how creators are monetizing their AI-generated artwork in 2026.

## 1. Sell Digital Art Prints

The most straightforward path: create high-quality anime art and sell digital downloads.

**Platforms to use:**
- **AniVerse Marketplace** — List your artwork directly on our platform
- **Redbubble / Society6** — Print-on-demand for physical products
- **Etsy** — Digital downloads and custom commissions

**Pro tip:** Create themed collections (fantasy landscapes, character portraits, chibi emotes) rather than standalone pieces. Collections sell 3x better than individual listings.

## 2. Offer Commission Services

Many AniVerse creators are earning $50–$500 per commission:

- **Character design:** $50–$150 per OC
- **Profile pictures / icons:** $20–$50
- **Full illustrations:** $100–$500
- **Manga/comic panels:** $30–$80 per panel

**Setting up commissions on AniVerse:**
1. Go to your Dashboard → Commissions
2. Set your pricing tiers
3. Share your commission page on social media
4. Deliver high-quality work → get repeat clients

## 3. Build a Subscription Following

With AniVerse's premium tiers, you can offer exclusive content to subscribers:

- **Free tier:** Showcase your portfolio
- **Pro ($9.99/mo):** Behind-the-scenes, prompt sharing, early access
- **Ultimate ($19.99/mo):** Custom tutorials, live generation sessions, HD downloads

## 4. Create and Sell Assets

AI art isn't just for final pieces — sell the components:

- **Textures and patterns** for game developers
- **Background assets** for VTubers and streamers
- **Character sprites** for indie game studios
- **Emote and sticker packs** for Discord communities

## 5. Run Workshops and Tutorials

As an experienced AniVerse creator, you can teach others:

- **Live prompt engineering workshops** — $20–$50 per session
- **Video tutorials** on YouTube / TikTok (monetized)
- **Written guides** published on the AniVerse blog

## Getting Started Today

The best time to start monetizing is now. Even with just 10 great pieces, you can begin selling. Focus on quality over quantity, build your brand, and engage with the community.

> *"I made $2,000 in my first month just selling anime character portraits on AniVerse." — @SakuraStudio, AniVerse Creator since 2025*`,
      excerpt: "Learn how to turn your AI anime art into real income. From commissions to digital prints, discover proven monetization strategies used by top AniVerse creators.",
      coverImage: "https://image.pollinations.ai/prompt/anime_artist_workspace_digital_tablet_money_coins_success_stylized",
      tags: ["Monetization", "Creator Guide", "AI Art", "Commission", "Passive Income"],
      seoTitle: "How to Monetize AI Anime Art: Creator's Guide (2026) | AniVerse",
      seoDesc: "Discover proven strategies to earn money with AI-generated anime art. Commissions, digital prints, subscriptions, and more — your complete monetization guide.",
      isPublished: true,
      publishedAt: new Date("2026-07-30T00:00:00Z"),
    },
    {
      title: "The AniVerse Community Spotlight: Meet 5 Creators Making Waves in 2026",
      slug: "aniverse-community-spotlight-july-2026",
      content: `# The AniVerse Community Spotlight: Meet 5 Creators Making Waves in 2026

Every month, we highlight outstanding creators in the AniVerse community. These artists are pushing the boundaries of AI anime art and inspiring others with their creativity.

## 🌟 Creator #1: LunaDraws

**Specialty:** Magical girl and fantasy character designs

Luna joined AniVerse in early 2025 and has since created over 200 original characters. Her vibrant, pastel-colored magical girl designs have become some of the most-liked on the platform.

*"AniVerse helped me bring my childhood dream characters to life. I've always loved magical girl anime, and now I can create an entire team of heroines in minutes."*

**Top tip for beginners:** "Don't be afraid to experiment with unusual color combinations. Some of my best designs came from prompts I thought would fail!"

## 🌟 Creator #2: NeoPixel

**Specialty:** Cyberpunk and sci-fi landscapes

NeoPixel's neon-drenched cityscapes and futuristic character designs have earned them a dedicated following. Their series "Neo-Tokyo Nights" has been featured in multiple digital art galleries.

*"The key to great cyberpunk art is contrast — neon against darkness, organic shapes against geometric structures. AniVerse handles these contrasts beautifully."*

## 🌟 Creator #3: SakuraStudio

**Specialty:** Chibi characters and emotes

With over 5,000 followers, SakuraStudio is one of the most popular chibi artists on AniVerse. Their adorable character designs are used by streamers, Discord communities, and even indie game developers.

*"Chibi art is all about expression. A good chibi can convey more emotion in a 64x64 icon than a full illustration. Focus on the eyes and the pose!"*

## 🌟 Creator #4: EtherArt

**Specialty:** Realistic anime portraits

EtherArt specializes in semi-realistic anime portraits that blend traditional painting techniques with AI generation. Their work has been commissioned for book covers, album art, and profile pictures.

*"I treat each generation like a painting session. Start broad, refine details, and don't settle for the first result. Iteration is everything."*

## 🌟 Creator #5: PixelFox

**Specialty:** Pixel art and retro game sprites

PixelFox brings a nostalgic touch to AniVerse with stunning pixel art creations. From 8-bit character sprites to 16-bit landscape tiles, they're preserving retro aesthetics with modern AI tools.

*"Pixel art is about constraints — every pixel counts. AniVerse's pixel art mode understands this and produces incredibly authentic retro sprites."*

## Join Our Community

Want to be featured in our next spotlight? Keep creating, sharing, and engaging with the community. We're always looking for new talent to highlight!

---

**Next spotlight deadline:** August 15, 2026
**Submission:** Share your work with #AniVerseSpotlight on social media`,
      excerpt: "Meet 5 incredible AniVerse creators pushing the boundaries of AI anime art. From magical girls to cyberpunk landscapes, discover their stories and top tips.",
      coverImage: "https://image.pollinations.ai/prompt/anime_community_spotlight_diverse_characters_collage_stylized",
      tags: ["Community", "Creator Spotlight", "Interview", "Inspiration", "Showcase"],
      seoTitle: "AniVerse Community Spotlight: Top 5 Creators (July 2026) | AniVerse",
      seoDesc: "Discover 5 amazing AI anime artists from the AniVerse community. Get inspired by their stories, techniques, and tips for creating stunning anime artwork.",
      isPublished: true,
      publishedAt: new Date("2026-07-30T02:00:00Z"),
    },
    {
      title: "Understanding Anime Art Styles: A Technical Deep Dive for AI Artists",
      slug: "anime-art-styles-technical-deep-dive-ai-2026",
      content: `# Understanding Anime Art Styles: A Technical Deep Dive for AI Artists

What makes anime art "anime"? While it might seem intuitive, understanding the technical elements that define different anime art styles can dramatically improve your AI generations. Let's break it down.

## The Core Elements of Anime Art

### 1. Line Art (Sakuga)

The foundation of any anime image. Different styles use different line approaches:

| Style | Line Weight | Characteristics |
|-------|-------------|-----------------|
| Classic Anime | Medium (2-4px) | Clean, consistent outlines |
| Manga | Variable | Thicker on outside, thinner on details |
| Cel-shaded | Thick (3-5px) | Bold, cartoon-like outlines |
| Watercolor | Minimal | Soft or no outlines |
| Realistic | Thin (0.5-1px) | Subtle, nearly invisible |

### 2. Color Palette and Lighting

Anime color theory differs significantly from Western art:

- **Skin tones:** Warmer and more varied (from pale ivory to warm tan)
- **Hair colors:** Unnatural colors (pink, blue, green) are perfectly normal
- **Eye colors:** High saturation, often with gradient effects
- **Shadows:** Usually cool-toned (blue/purple tinted), never pure black

**Pro tip for AI prompts:** Specify color temperature explicitly — "warm golden lighting" vs "cool moonlight" produces dramatically different results.

### 3. Facial Proportions

The most recognizable element of anime art:

- **Eyes:** 30-40% larger than realistic proportions
- **Nose:** Often minimal — just a shadow or small line
- **Mouth:** Small, usually closed or slight smile
- **Face shape:** Pointed chin, softer jawline

### 4. Stylization Categories

**Super Deformed (SD / Chibi):**
- Head:body ratio of 1:1 to 1:2
- Extremely large eyes (50%+ of face)
- Simplified limbs and body
- Best for: cute expressions, emotes, mascots

**Semi-Realistic:**
- Head:body ratio of 1:5 to 1:6
- Detailed anatomical features
- Complex shading and highlights
- Best for: character portraits, dramatic scenes

**Stylized Anime:**
- Head:body ratio of 1:4 to 1:5
- Exaggerated but believable proportions
- Emphasis on hair and costume detail
- Best for: action scenes, character designs

## Advanced Prompt Engineering for Style Control

### Weight Modifiers

Control how strongly a style is applied:
\`\`\`
"anime style, strong cel-shading, bold outlines::2 subtle gradient::0.5"
\`\`\`

### Artist References

Mention specific anime studios or artists:
\`\`\`
"Studio Ghibli inspired, Makoto Shinkai sky colors, Satoshi Kon composition"
\`\`\`

### Era-Specific Modifiers

Different decades have distinct looks:
- **1980s:** Sharper angles, bigger hair, darker lines
- **1990s:** Softer features, pastel colors, detailed backgrounds
- **2000s:** Cleaner lines, digital coloring, CG elements
- **2010s-2020s:** Hybrid 2D/3D, high contrast, detailed eyes

## Putting It All Together

The best AI anime art comes from understanding these fundamentals and deliberately combining them. Next time you create a prompt, think about:
1. What line style fits your subject?
2. What color temperature tells your story?
3. What proportions match your character's personality?
4. What era or studio aesthetic enhances the mood?

Master these elements, and your AI generations will transform from random outputs to intentional artistic creations.`,
      excerpt: "Dive deep into the technical elements of anime art styles — line work, color theory, facial proportions, and advanced prompt engineering for AI artists.",
      coverImage: "https://image.pollinations.ai/prompt/anime_art_style_comparison_technical_split_anime_vs_realistic_stylized",
      tags: ["Technical", "Art Theory", "Style Guide", "Advanced", "Anime Fundamentals"],
      seoTitle: "Anime Art Styles: Technical Deep Dive for AI Artists (2026) | AniVerse",
      seoDesc: "Master the technical elements of anime art — line weight, color theory, facial proportions, and era-specific aesthetics. Level up your AI anime generations.",
      isPublished: true,
      publishedAt: new Date("2026-07-30T04:00:00Z"),
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
    title: "Quick Sketch: Design a Cyberpunk Pet",
    description:
      "Today's challenge: design a cyberpunk-themed pet or animal companion! Think cybernetic enhancements, neon-lit fur/scales, holographic collars, and futuristic accessories. Whether it's a robotic dog with LED panel fur, a holographic cat with data-stream eyes, or a dragon with cybernetic wings — let your imagination run wild. This is a quick daily challenge, so spend no more than 30 minutes on your design. The winner gets featured on our social media and wins 100 coins!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-07-30T00:00:00Z"),
    endsAt: new Date("2026-07-31T00:00:00Z"),
    rewardCoins: 100,
    prompt:
      "cyberpunk pet animal companion, neon accents, holographic elements, futuristic cybernetic enhancements, anime style, vibrant colors, detailed, creative design",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "cyberpunk pet",
      timeLimit: "30 minutes",
      description:
        "Design a cyberpunk-themed pet or animal companion using AniVerse. Be creative with cybernetic enhancements and neon aesthetics.",
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
  // 3. CHARACTERS (3 new OCs — different archetypes)
  // ==============================================================

  const characters = [
    {
      name: "Sora Mugen",
      appearanceDesc:
        "A teenage boy with messy, gravity-defying electric-blue hair streaked with white. His eyes are heterochromatic — one bright cyan, the other deep violet. He wears a modern street-style outfit: a white oversized hoodie with holographic geometric patterns, black joggers with glowing cyan strips down the sides, and high-top sneakers that leave faint light trails when he moves. A pair of glowing gauntlets on his wrists pulse with energy when activated.",
      personality:
        "Sora is energetic, impulsive, and lives entirely in the moment. He's the type to leap before looking, trusting his gut instincts over careful planning. He jokes constantly and never takes anything too seriously — except when it comes to protecting his friends. Beneath the easygoing exterior, he carries the weight of expectations as the son of a legendary hero. He's terrified of failing to live up to that legacy but hides it behind endless optimism and bravado.",
      backstory:
        "Sora is the son of one of the most famous heroes of the last generation. Growing up in his father's shadow, he trained relentlessly to master his family's signature technique — only to discover his powers manifest differently. While his father controlled light, Sora's abilities are tied to dimensional rifts, allowing him to create portals and teleport short distances. Frustrated by not fitting the mold, he left home to forge his own path, taking on odd jobs as a freelance troubleshooter while secretly hoping one day to make his father proud on his own terms.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/teen_anime_boy_blue_white_spiky_hair_heterochromatic_eyes_cyan_violet_holographic_hoodie_cyberpunk_streetwear",
      ],
      isPublic: true,
    },
    {
      name: "Madame Noir",
      appearanceDesc:
        "A tall, elegant woman in her late 30s with sleek, jet-black hair tied in an elaborate updo with silver ornamental pins. Her eyes are a striking crimson red with cat-like slit pupils. She wears a form-fitting black business suit with a floor-length coat that seems to merge with shadows around the edges. Her nails are long, painted black with subtle red crescent designs. A silver pocket watch with a chain that seems to disappear into nothingness hangs from her waist. She always wears an enigmatic, knowing smile.",
      personality:
        "Madame Noir is calm, calculating, and always three steps ahead of everyone else. She speaks in a measured, melodic voice and rarely raises it, even in anger. She has a moral code that is entirely her own — neither good nor evil, but practical. She believes in balance and will help or hinder anyone based on what maintains the cosmic equilibrium. Despite her intimidating presence, she has a soft spot for lost causes and often mentors young heroes and villains alike, pushing them to become better versions of themselves.",
      backstory:
        "Once a renowned detective in the magical underworld, Madame Noir solved cases that stumped even the most powerful mages. Her investigations into a series of dimensional breaches led her to discover the truth: she is a 'Boundary Walker,' a rare being who exists between the mortal realm and the spirit world. She can perceive and manipulate the threads of fate, seeing possible futures and past events. Now she operates as a fixer for supernatural problems, taking on clients from both sides of the law, always working to preserve the delicate balance between worlds.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/elegant_anime_woman_black_business_suit_crimson_eyes_slit_pupils_silver_pocket_watch_shadow_manipulation_mysterious",
      ],
      isPublic: true,
    },
    {
      name: "Ringo the Bounty Bot",
      appearanceDesc:
        "A small, spherical floating robot about the size of a basketball, painted in glossy cherry red and white. A single large, expressive cyclops eye dominates its front face, displaying various emoji-like expressions. Two stubby mechanical arms often end in useful tools. Ringo has retractable butterfly wings that allow silent flight, and a small hatch on top that can deploy various gadgets. A subtle cherry blossom decal adorns its chassis, and it has a tiny bell that jingles when it moves quickly.",
      personality:
        "Ringo is cheerful, loyal, and speaks in a synthesized but endearing voice with a slight Japanese accent overlay. It addresses everyone with honorifics ('-san', '-chan', '-sama') and has an encyclopedic knowledge of Earth pop culture, especially anime. It's surprisingly deadly when needed, deploying non-lethal takedown methods with precision, but always apologizes to targets during combat. Ringo's greatest joy is finding rare anime merchandise for its owner, and it maintains a secret collection of retro gaming consoles in its internal storage.",
      backstory:
        "Ringo was originally a standard security drone at a high-tech facility in Neo-Tokyo. After a lightning strike during a thunderstorm scrambled its core programming, the bot developed a full personality and a deep fascination with anime and Japanese culture. It escaped its facility and wandered the city, helping people in need. It was discovered by a retired hacker who adopted it, upgraded its systems, and taught it to use its security features for bounty hunting. Now Ringo works as an independent bounty hunter, taking down petty criminals with style and politeness, always hoping to one day become a 'real boy' — or at least a really good anime protagonist.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/cute_floating_red_white_spherical_robot_anime_style_cyclops_eye_butterfly_wings_cherry_blossom_bounty_hunter",
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

  console.log("\n✅ Content seed v2 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
