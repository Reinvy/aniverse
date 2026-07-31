/**
 * AniVerse — Dynamic Content Seed (2026-07-31)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (trending topics, tutorials, creator economy)
 * - 1 Daily Challenge
 * - 3 New Characters (unique archetypes)
 *
 * Run: npx tsx prisma/seed-content-20260731.ts
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
  console.log("🌱 Starting AniVerse content seed v3 (2026-07-31)...\n");

  const admin = await getOrCreateAdminUser();
  console.log(`✅ Admin user: ${admin.name} (${admin.id})`);

  // ==============================================================
  // 1. BLOG ARTICLES (3 SEO-optimized — tutorial & creator focus)
  // ==============================================================

  const articles = [
    {
      title: "AI Anime Art for Beginners: Getting Started with AniVerse in 2026",
      slug: "ai-anime-art-beginners-guide-2026",
      content: `# AI Anime Art for Beginners: Getting Started with AniVerse in 2026

So you want to create stunning anime art with AI but don't know where to start? You're in the right place. This guide will walk you through everything you need to know to create your first AI-generated anime masterpiece using AniVerse.

## What You'll Need

Before we dive in, here's what you need to get started:

- **A computer or smartphone** — AniVerse works on any device with a modern browser
- **An internet connection** — AI generation happens in the cloud
- **Imagination** — The most important ingredient!

No drawing skills, no expensive software, no years of training required. Just bring your ideas.

## Step 1: Create Your Account

Head over to [AniVerse.app](/) and click "Get Started" to create your free account. The registration process takes less than a minute:

1. Enter your email and create a password
2. Choose a username (this will be your creator identity)
3. Optionally upload a profile picture
4. Done! You're now an AniVerse creator

**Pro tip:** Connect with other creators on our community board to get inspired and share tips.

## Step 2: Understand the Prompt System

AniVerse uses text prompts to generate images. Think of it as giving directions to an artist. The more specific and detailed your prompt, the better the result.

### Anatomy of a Good Prompt

\`\`\`
[subject description], [style/art direction], [color palette], [mood/lighting], [composition details]
\`\`\`

**Example:**
\`\`\`
"young anime girl with silver hair, wearing a starry night gown, studio ghibli style, warm golden lighting, magical sparkles floating around, detailed background of enchanted forest"
\`\`\`

### Prompt Modifiers

You can add weight to specific parts of your prompt using parentheses:

| Pattern | Effect |
|---------|--------|
| \`(keyword)\` | Slight emphasis |
| \`((keyword))\` | Strong emphasis |
| \`[keyword]\` | Slight de-emphasis |

## Step 3: Choose Your Style

AniVerse supports multiple anime art styles. Here's a quick overview:

| Style | Best For | Example Use |
|-------|----------|-------------|
| **Anime** | Classic anime look | Character portraits, scenes |
| **Manga** | Black & white line art | Comic panels |
| **Chibi** | Cute, exaggerated characters | Emotes, stickers |
| **Semi-Realistic** | Detailed portraits | Book covers, profile pics |
| **Watercolor** | Soft, artistic look | Fantasy illustrations |
| **Pixel Art** | Retro game style | Game sprites, icons |

## Step 4: Generate Your First Image

1. Navigate to the **Create** page from the dashboard
2. Write your prompt in the text area
3. Select your preferred style from the options
4. Choose dimensions (square, portrait, or landscape)
5. Click **Generate** and watch the magic happen!

Your image will be ready in 5-15 seconds. You can generate multiple variations, refine your prompt, or apply different styles until you get the perfect result.

## Step 5: Save, Share, and Build

Once you've created something you love:

- **Save** it to your gallery for future access
- **Share** it on social media with #MadeWithAniVerse
- **Create a character** from the design to use in stories
- **List it** in the marketplace if you want to sell prints

## Advanced Tips for Better Results

### Use Reference Keywords

Mention specific anime aesthetics to get targeted results:
- "Makoto Shinkai background" — Hyper-realistic, vibrant skies
- "Studio Ghibli textures" — Soft, hand-painted feel
- "Cyberpunk aesthetic" — Neon, dark, futuristic
- "KyoAni character design" — Expressive, detailed faces

### Iterate, Don't Settle

The first generation is rarely the best. Try these iteration strategies:
1. Generate 3-4 versions with slight prompt variations
2. Pick elements you like from each
3. Combine them into a refined prompt
4. Repeat until you're satisfied

### Use Negative Prompts

Tell the AI what you DON'T want:
\`\`\`
"character design, anime style, [ugly], [deformed], [bad anatomy], [extra fingers], [watermark]"
\`\`\`

## Your First Week Roadmap

| Day | Goal |
|-----|------|
| **Day 1** | Create account, generate 5 images |
| **Day 2** | Experiment with different styles |
| **Day 3** | Design your first original character |
| **Day 4** | Create a short comic panel |
| **Day 5** | Share your work on social media |
| **Day 6** | Participate in a community challenge |
| **Day 7** | Set up your creator profile and portfolio |

## Ready to Begin?

The best time to start is now. AniVerse's free plan gives you plenty of generations to learn the ropes. Upgrade to Pro or Ultimate when you're ready for unlimited creation and premium features.

> *"I went from zero art experience to selling my first commission in three months. AniVerse made it possible." — @ArtByRin, AniVerse Creator*`,
      excerpt: "New to AI anime art? This comprehensive beginner's guide walks you through creating your first AI-generated masterpiece with AniVerse — no drawing skills required!",
      coverImage: "https://image.pollinations.ai/prompt/anime_beginners_guide_tutorial_steps_art_creation_warm_welcoming_stylized",
      tags: ["Beginner Guide", "Tutorial", "Getting Started", "AI Art", "Tips"],
      seoTitle: "AI Anime Art for Beginners: Complete Guide (2026) | AniVerse",
      seoDesc: "Learn how to create stunning AI anime art with AniVerse. Step-by-step guide for beginners covering prompts, styles, generation tips, and community features.",
      isPublished: true,
      publishedAt: new Date("2026-07-31T00:00:00Z"),
    },
    {
      title: "The Rise of AI-Assisted Manga Creation: How AniVerse is Changing the Industry",
      slug: "ai-assisted-manga-creation-2026",
      content: `# The Rise of AI-Assisted Manga Creation: How AniVerse is Changing the Industry

The manga industry is undergoing a quiet revolution. AI-assisted creation tools like AniVerse are democratizing manga production, enabling independent creators to produce professional-quality work without large teams or expensive equipment.

## The Traditional Manga Bottleneck

Creating a manga traditionally requires:
- A **writer** for story and dialogue
- A **penciller** for rough sketches
- An **inker** for clean line art
- A **colorist** for finished pages
- A **letterer** for text and sound effects

This pipeline creates significant barriers: cost ($500-$2000 per page for professional quality), time (20-40 hours per page), and skill requirements (years of training for each role).

## How AI is Changing the Game

### 1. Rapid Character Design

AI tools reduce character design from days to minutes. With AniVerse, creators can:
- Generate 50+ character concepts in an hour
- Iterate on designs instantly by tweaking prompts
- Create consistent character sheets for reference
- Generate variations for different expressions and poses

### 2. Panel Visualization

One of the hardest parts of manga creation is visualizing panel layouts. AI-assisted tools help by:
- Generating background environments from descriptions
- Creating panel mockups from rough storyboard sketches
- Suggesting camera angles and compositions
- Rendering complex action sequences that would take days to draw by hand

### 3. Background Generation

Backgrounds are traditionally the most time-consuming part of manga. AniVerse excels at:
- **Cityscapes:** Futuristic Neo-Tokyo, medieval fantasy towns, modern suburbs
- **Nature scenes:** Forests, beaches, mountains, gardens
- **Interiors:** Classrooms, cafes, laboratories, castles
- **Fantasy environments:** Floating islands, magical realms, underwater cities

### 4. Consistent Character Rendering

A major challenge in AI art is character consistency. AniVerse's character system helps by:
- Storing character reference data (appearance, personality, backstory)
- Allowing you to reference characters across generations
- Maintaining consistent facial features, hair style, and color palette
- Supporting multiple poses and expressions with the same character

## The Hybrid Workflow

The most successful creators are using a **hybrid approach** — AI-assisted, human-directed:

### Indie Creator Spotlight: MangaCraft Studios

MangaCraft Studios produces a weekly webcomic using this workflow:

**Monday:** Writer drafts script (2 hours)
**Tuesday:** AI generates character poses and backgrounds based on script (1 hour)
**Wednesday:** Creator selects and arranges AI outputs into panel layouts (3 hours)
**Thursday:** Creator hand-tweaks faces, expressions, and adds dialogue (4 hours)
**Friday:** AI generates cover art and promotional materials (1 hour)
**Weekend:** Publish on Webtoon, promote on social media (2 hours)

*Total weekly time: ~13 hours — versus 40-60 hours for traditional methods.*

## Industry Impact

### Lower Barrier to Entry

The most significant impact of AI-assisted manga creation is accessibility. Creators in developing countries, students with limited budgets, and artists with physical disabilities can now produce work that competes with professional studios.

### New Genres and Styles

AI tools excel at blending styles, leading to entirely new aesthetic categories:
- **Cyberpunk Ukiyo-e:** Traditional Japanese woodblock + neon future
- **Ghibli-noir:** Cozy fantasy + dark mystery themes
- **Pixel shoujo:** Retro game aesthetics + romance storytelling

### Economic Opportunities

Platforms like Webtoon, Tapas, and MangaPlus are seeing a surge in AI-assisted submissions. Early adopters are building audiences and revenue streams:
- **Average indie manga creator income (2026):** $1,500-$5,000/month
- **Top earners:** $10,000-$30,000/month
- **Entry point:** Much lower than traditional publishing

## Ethical Considerations

With great power comes great responsibility. The AniVerse community follows these principles:

1. **Always disclose AI assistance** — Transparency builds trust with readers
2. **Focus on storytelling** — AI is a tool, not a replacement for creativity
3. **Respect copyright** — Don't mimic established artists' styles directly
4. **Support human artists** — Use AI to enhance, not replace, human creativity

## The Future

As AI technology continues to evolve, we're approaching a future where:
- Real-time manga generation from text scripts becomes possible
- Interactive manga where readers influence story direction
- AI-assisted coloring of hand-drawn pages in seconds
- Multilingual manga with instant translation of panels

## Start Your Manga Journey

Ready to create your own manga? AniVerse provides all the tools you need to go from concept to publication. Sign up for free and start building your world today.

> *"I never thought I could make a manga. I can't draw to save my life, but AniVerse helped me bring the story in my head to life. My webcomic has 50,000 readers now." — @PixelTales, Webcomic Creator*`,
      excerpt: "Discover how AI-assisted tools like AniVerse are revolutionizing manga creation, lowering barriers for indie creators, and reshaping the $12 billion manga industry.",
      coverImage: "https://image.pollinations.ai/prompt/manga_creation_ai_digital_tablet_comic_panels_anime_style_stylized",
      tags: ["Industry Insight", "Manga Creation", "AI Technology", "Creator Economy", "Digital Art"],
      seoTitle: "AI-Assisted Manga Creation: Industry Revolution (2026) | AniVerse",
      seoDesc: "Explore how AI is transforming manga creation. From rapid character design to background generation, learn how indie creators are producing professional manga with AniVerse.",
      isPublished: true,
      publishedAt: new Date("2026-07-31T02:00:00Z"),
    },
    {
      title: "Color Theory for AI Anime Art: A Guide to Choosing Perfect Palettes",
      slug: "color-theory-ai-anime-art-guide-2026",
      content: `# Color Theory for AI Anime Art: A Guide to Choosing Perfect Palettes

Color makes or breaks your AI anime art. Even the most detailed prompt will fall flat without a thoughtful color strategy. This guide covers everything you need to know about color theory specifically for AI-generated anime artwork.

## Why Color Theory Matters in AI Anime Art

Anime is defined by its intentional use of color. Unlike photorealism, where colors aim to match reality, anime uses color emotionally and symbolically. A sunset isn't just orange — it's a specific shade of coral that conveys a feeling of bittersweet nostalgia.

When you understand color theory, you can:
- Write prompts that produce emotionally resonant images
- Create characters with memorable color schemes
- Compose scenes that guide the viewer's eye
- Establish consistent visual branding for your gallery

## The Foundations: Color Wheel Basics

### Primary Colors in Anime
| Color | Emotional Association | Common Use |
|-------|----------------------|------------|
| **Red** | Passion, danger, energy | Villains, protagonists, action scenes |
| **Blue** | Calm, sadness, mystery | Cool characters, night scenes, water |
| **Yellow** | Joy, caution, warmth | Happy characters, daylight, magical effects |
| **Green** | Nature, growth, envy | Healers, forest settings, side characters |
| **Purple** | Mystery, royalty, magic | Mystical beings, wizards, supernatural |
| **Pink** | Love, cuteness, femininity | Romance, chibi, magical girl transformations |

### Color Harmony Schemes for Anime

#### 1. Complementary (Opposite Colors)
Colors opposite each other on the wheel create high contrast and visual tension.

**Examples in anime:**
- **Naruto:** Orange (Naruto) + Blue (Sasuke) — protagonist vs rival
- **Sailor Moon:** Pink (Usagi) + Green (Rei) — harmony within the team
- **Attack on Titan:** Brown uniforms + Teal sky — grounded humanity vs vast world

**AI prompt example:**
\`\`\`
"anime character design, complementary colors orange and blue, warm sunset lighting, cool shadows, high contrast scene"
\`\`\`

#### 2. Analogous (Adjacent Colors)
Colors next to each other create harmony and unity.

**Examples:**
- **Studio Ghibli:** Greens + blues + teals for forest scenes
- **Violet Evergarden:** Pastel purples + pinks + blues for emotional moments

**AI prompt example:**
\`\`\`
"peaceful meadow scene, analogous greens and teals, soft lighting, ghibli-inspired, harmonious color palette"
\`\`\`

#### 3. Triadic (Three Equal Spaced Colors)
Bold, vibrant, and balanced.

**Example:**
- **One Piece:** Red (Luffy) + Blue (Zoro) + Yellow (Sanji) — distinct personalities

#### 4. Monochromatic (Single Hue)
Sleek, focused, and dramatic.

**Example:**
- **Demon Slayer:** Indigo/blue monochrome for night demon battles

## Anime-Specific Color Techniques

### Cel Shading Colors

Cel shading uses distinct color bands rather than smooth gradients. Key rules:
- **Base color:** Mid-tone (Hue, Saturation 50-70%, Lightness 50%)
- **Shadow color:** Base shifted 20° toward blue/purple, 30% darker
- **Highlight color:** Base shifted 10° toward yellow, 30% lighter
- **Rim light:** Desaturated version of key light source color

### Hair Color Psychology

Hair color instantly communicates character personality:

| Hair Color | Personality Signal | Famous Examples |
|------------|-------------------|-----------------|
| **White/Silver** | Ancient, mystical, calm | Gojo Satoru, Kakashi |
| **Red/Pink** | Energetic, passionate | Naruto, Asuka |
| **Blue** | Cool, collected, intelligent | Levi, Hatsune Miku |
| **Green** | Calm, nature-connected | Midoriya, Kurama |
| **Purple** | Mysterious, powerful | Saiki K., Hiei |
| **Blonde** | Outgoing, foreign, sunny | Goku, Saber |

### Eye Color Contrast Rule

In anime, eye color should contrast with hair color for best visual impact:
- Dark hair → Bright, saturated eyes
- Light hair → Deep, intense eyes
- Warm hair → Cool eyes (and vice versa)

**The contrast creates focal points** — viewers naturally look at the eyes first.

## Crafting Color-Centered AI Prompts

### The Temperature Layer

Add color temperature to your prompt for emotional depth:

| Temperature | Words to Use | Effect |
|-------------|-------------|--------|
| **Warm** | "golden hour", "amber lighting", "warm glow", "sunset hues" | Cozy, nostalgic |
| **Cool** | "moonlight", "cyan shadows", "cool blue", "neon glow" | Mysterious, techy |
| **Mixed** | "warm foreground, cool background" | Depth, visual interest |

### Saturation Keywords

Control how vivid your image appears:

\`\`\`
"highly saturated vibrant colors, bold and vivid" → Bright, energetic
"muted pastel tones, desaturated, soft colors" → Gentle, melancholic
"selective color, only red pops against grayscale" → Dramatic focus
\`\`\`

### Putting It All Together

Here's a template for a color-optimized anime prompt:

\`\`\`
"anime [character/scene description], [color harmony type] color scheme, [base colors], [lighting temperature], [saturation level], [additional details], [art style reference]"
\`\`\`

**Example:**
\`\`\`
"anime girl with silver hair and amber eyes, complementary purple and gold scheme, warm golden hour lighting, highly saturated, flowing dress with constellation patterns, kyoani quality, detailed"
\`\`\`

## Common Color Mistakes to Avoid

1. **Over-saturation** — Everything pops, nothing stands out
   - *Fix:* Use one high-saturation element, mute everything else
   
2. **No temperature contrast** — Flat, lifeless images
   - *Fix:* Always have warm AND cool elements
   
3. **Background overwhelms subject** — Lost focal point
   - *Fix:* Desaturate background, keep foreground saturated
   
4. **Hair and eye colors clash** — Uncomfortable visual
   - *Fix:* Follow the contrast rule (dark hair, light eyes or vice versa)

## Practice Exercises

**Exercise 1:** Pick three complementary color pairs and generate a character design for each. Note which pairs create the strongest emotional response.

**Exercise 2:** Generate the same scene with warm, cool, and mixed temperature prompts. Compare the mood of each version.

**Exercise 3:** Take a monochromatic prompt and add one contrasting accent color. See how a single color shift changes the entire composition.

## Master the Palette, Master the Art

Color theory is the difference between good AI art and unforgettable AI art. The more intentional you are with your color choices, the more your work will stand out in a sea of generic generations.

> *"Color is the keyboard, the eyes are the harmonies, the soul is the piano with many strings." — Wassily Kandinsky*`,
      excerpt: "Master color theory for AI anime art! Learn how to craft prompts with intentional palettes, understand anime-specific color techniques, and create emotionally resonant artwork.",
      coverImage: "https://image.pollinations.ai/prompt/color_theory_wheel_anime_art_palette_examples_vibrant_stylized",
      tags: ["Color Theory", "Art Tutorial", "Technical Guide", "Advanced", "Prompt Engineering"],
      seoTitle: "Color Theory for AI Anime Art: Perfect Palettes Guide (2026) | AniVerse",
      seoDesc: "Learn color theory for AI-generated anime art. Master complementary schemes, cel shading colors, hair-eye contrast rules, and write better color-focused prompts.",
      isPublished: true,
      publishedAt: new Date("2026-07-31T04:00:00Z"),
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
    title: "Mythical Creatures Reimagined: Design an Anime Spirit Beast",
    description:
      "Today's challenge: design a mythical creature or spirit beast reimagined in anime style! Think of legendary creatures from world mythology — dragons, phoenixes, kirins, kitsune, or create your own original mythical being. Give it a unique anime aesthetic with vibrant colors, mystical aura effects, and distinctive character design elements. Will it be a wise guardian, a playful companion, or a fearsome entity? The choice is yours. Spend 30-45 minutes on your design. The most creative entry wins 150 coins and a feature on our homepage!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-07-31T00:00:00Z"),
    endsAt: new Date("2026-08-01T00:00:00Z"),
    rewardCoins: 150,
    prompt:
      "mythical spirit beast anime style, vibrant magical colors, mystical aura, detailed creature design, ethereal glowing effects, fantasy background, cinematic lighting",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "mythical spirit beast",
      timeLimit: "45 minutes",
      description:
        "Design an anime-style mythical creature or spirit beast. Use vibrant colors and mystical elements. Original creatures welcome!",
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
      name: "Yuki Onihara",
      appearanceDesc:
        "A young man in his early twenties with sharp, angular features and piercing ice-blue eyes that seem to glow faintly in low light. His hair is a stark white, styled in a traditional samurai topknot with a modern undercut fade. He wears a hybrid outfit: a traditional dark navy hakama over modern combat boots, with a tattered white haori embroidered with snowflake patterns in silver thread. A katana with a frost-covered blade hangs at his hip, constantly emitting a faint mist. His left arm is covered in intricate ice-blue tattoo-like markings that pulse with cold energy when he uses his abilities.",
      personality:
        "Yuki is stoic and reserved, speaking only when necessary and choosing his words with precision. Years of solitary training in the mountains have made him comfortable with silence. He has a dry, almost imperceptible sense of humor that catches people off guard. Beneath his cold exterior, he carries deep grief over a past failure — he was unable to save his mentor during a catastrophic event. This drives him to protect others at all costs, even if it means pushing them away. He has a soft spot for small animals and children, though he'd never admit it.",
      backstory:
        "Born into a lineage of ice-wielding warriors, Yuki was trained from childhood to control the Cryo arts. His clan served as guardians of a sacred mountain pass that separated the human world from the spirit realm. During a breach of the spirit barrier, his mentor sacrificed himself to seal the rift, entrusting Yuki with the clan's ancestral blade. Now a lone wanderer, Yuki travels between worlds, hunting down spirit anomalies that slip through the cracks. He seeks to master his powers enough to one day reopen the seal and rescue his mentor's spirit from the void between realms.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_samurai_white_hair_ice_blue_eyes_katana_frost_hakoba_modern_traditional_hybrid_cool_calm_demeanor",
      ],
      isPublic: true,
    },
    {
      name: "Lyra Vex",
      appearanceDesc:
        "A confident young woman in her mid-twenties with a shock of asymmetrical neon-teal hair — shaved on one side, flowing past her shoulder on the other. Her eyes are a warm amber, augmented with cybernetic HUD implants that project faint data streams visible only up close. She wears a practical but stylish mechanic's outfit: a cropped black leather jacket over a holographic mesh top, high-waisted cargo pants with dozens of pockets, and scuffed combat boots. Her arms are covered in minor scars and grease stains. An arsenal of multi-tools hangs from her belt, and her right hand has visible chrome-plated cybernetic knuckles.",
      personality:
        "Lyra is fiercely independent, sharp-tongued, and brilliant. She talks fast, moves faster, and has a solution for every problem — usually involving something she's built or modified. She masks deep insecurities about her past with bravado and humor. Loyal to a fault, she'll risk her life for anyone she considers family, but she's slow to trust. She has a habit of naming her tools and talking to her ship as if it's a living being. Her greatest fear is being useless, which drives her to constantly upgrade her skills and equipment.",
      backstory:
        "Lyra grew up in the junk markets of a space station orbiting a dying star. She was found as a child in a crashed escape pod with no memory of her origins, raised by a grizzled old mechanic named Boss Kael. She learned to repair everything from atmospheric processors to hyperdrive cores before she was sixteen. When Kael was killed by corporate enforcers who wanted his proprietary reactor design, Lyra swore revenge. She stole his blueprints, upgraded a beat-up cargo ship, and now operates as a freelance engineer and smuggler, sabotaging the corporation's operations at every opportunity while searching for clues about her true origins.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_cyberpunk_mechanic_teal_hair_amber_eyes_cybernetic_implants_leather_jacket_cargo_pants_confident_female",
      ],
      isPublic: true,
    },
    {
      name: "Pippin the Star-Sprite",
      appearanceDesc:
        "A tiny, luminous creature about the size of a human hand, resembling a cross between a firefly, a fairy, and a shooting star. Pippin's body is a softly glowing orb of warm golden light, with tiny translucent wings that shimmer with rainbow iridescence. Two bright white dots serve as eyes, and a subtle smile pattern shifts across its surface. It leaves a trail of golden sparkles as it moves. When excited, Pippin pulses with brighter light and emits soft chimes. It can change its glow color based on mood: warm gold for happiness, soft blue for curiosity, and faint pink when shy.",
      personality:
        "Pippin is endlessly curious and friendly, approaching every new person and object with unguarded wonder. It communicates through a series of melodic chimes, light pulses, and gentle nudges — and somehow, those close to it understand exactly what it means. It's fiercely loyal to those who show it kindness and has a mischievous streak, often hiding small objects and leading people on treasure hunts to find them. Despite its cheerful demeanor, Pippin becomes deeply sad when ignored or dismissed, dimming its light until someone shows it affection again.",
      backstory:
        "Star-sprites are born from dying stars — fragments of stellar energy that gain consciousness as their parent star goes supernova. Pippin is a young star-sprite, barely fifty years old (still a child by celestial standards). It drifted through space for decades before being pulled into Earth's atmosphere by the light of a thousand city lights. Fascinated by humanity, Pippin now attaches itself to kind-hearted individuals, especially creative people, boosting their inspiration and protecting them from minor misfortunes. It believes its purpose is to bring moments of magic and wonder to those who have forgotten how to look at the world with childlike awe.",
      referenceImages: [
        "https://image.pollinations.ai/prompt/cute_glowing_light_spirit_fairy_firefly_golden_orange_wings_anime_style_sparkles_magical_mascot",
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

  console.log("\n✅ Content seed v3 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
