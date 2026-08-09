/**
 * AniVerse — Dynamic Content Seed (2026-08-09)
 *
 * Seeds the database with fresh diverse content:
 * - 3 SEO BlogArticles (anime eyes design, dynamic action poses, and the
 *   complete AI anime production workflow) — the first is marked `featured`
 *   with today's publishedAt so the blog landing hero rotates to fresh content.
 * - 1 Daily Challenge (Lantern Festival — floating lights of the wishing river)
 * - 3 New Characters (unique archetypes: origami shrine keeper, robotic
 *   sound engineer, sky courier)
 * - Data hygiene: mark expired ACTIVE challenges as COMPLETED
 *
 * Run: npx tsx prisma/seed-content-20260809.ts
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
  console.log("🌱 Starting AniVerse content seed v11 (2026-08-09)...\n");

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
  // 1. BLOG ARTICLES (3 SEO-optimized — anime eyes, dynamic action
  //    poses, AI production workflow). First article is FEATURED so
  //    the blog landing hero rotates to today's content.
  // ==============================================================

  const articles = [
    {
      title: "Anime Eyes: Drawing & Prompting Windows to the Soul",
      slug: "ai-anime-eyes-expressive-design-2026",
      content: `# Anime Eyes: Drawing & Prompting Windows to the Soul

Eyes are the most powerful storytelling tool in anime. A single close-up on a character's eyes can carry an entire episode's emotional arc — no dialogue, no music, no movement. This guide breaks down how anime eyes work, how to design them, and how to prompt AI models for eyes that actually express something.

## Why Anime Eyes Are Big

Realistic eyes are proportionally small. Anime eyes are large because the face is a stage and the eyes are the performers. The exaggerated size gives artists room to draw emotion at a glance: a 20-pixel eye can show fear, resolve, or heartbreak. When designing a character, the eye shape is the first thing a viewer locks onto — get it right and half the character design is done.

## The Eye Vocabulary

Every eye shape carries a personality shorthand:

| Eye Shape | Reads As | Example Archetype |
|-----------|----------|-------------------|
| Large round | Innocence, wonder, openness | The protagonist / the child |
| Narrow slanted | Intelligence, suspicion, calm | The strategist / the rival |
| Downturned | Sadness, gentleness, weariness | The tragic hero / the healer |
| Upturned | Energy, mischief, confidence | The trickster / the hot-blooded rival |
| Half-lidded | Boredom, danger, worldliness | The antagonist / the cool one |
| Heterochromia | Otherness, mystery, chosen-one | The mage / the supernatural being |

## Highlights: The Three-Spot System

The classic anime eye uses three light spots: one large highlight at the top, one small glint at the bottom, and a soft rim reflection. The highlights are not decoration — they tell the viewer where the light comes from and how the character feels. A character with dulled highlights is depressed or exhausted; a character with extra sparkles is excited or inspired. When prompting, name the highlights explicitly: "large sparkling highlights, soft rim light, glossy eyes".

## Color as Emotion

Eye color does heavy emotional lifting in anime:

- **Red eyes** — intensity, supernatural power, hidden rage
- **Blue eyes** — calm, loyalty, sorrow, distance
- **Gold/amber eyes** — royalty, wisdom, animal instinct
- **Green eyes** — growth, envy, healing
- **Purple/violet eyes** — magic, mystery, otherness
- **Grey/silver eyes** — neutrality, grief, resignation

Keep the color consistent across every image of the character — the eyes are the anchor of identity.

## The Close-Up Shot

The eye close-up is anime's signature emotional beat. The anatomy of a great eye shot: extreme close framing on one or both eyes, strong rim lighting tracing the iris, catchlights reflecting the environment (a window, a fire, a neon sign), and slow motion. When prompting: "extreme close-up on the eyes, detailed iris, rim light, cinematic reflections, emotional intensity".

## Prompting Expressive Eyes with AI

A reliable eye-focused prompt block:

\\\`\\\`\\\`text
"anime eyes close-up, [shape], [color] irises, [highlight system], [emotion] expression, detailed iris texture, clean lineart, cel shading, dramatic rim lighting"
\\\`\\\`\\\`

Example: "narrow slanted crimson eyes, large sparkling highlights, cold fury expression, detailed iris texture, dramatic rim lighting".

## Expression Consistency

When generating the same character across images, freeze an eye descriptor block — shape, color, and highlight style — word for word. The face can shift, the hair can move, but the eyes must stay identical or the character stops being recognizable.

## Your Eye Challenge

Generate the same character's eyes in five emotional states: calm, furious, tearful, joyful, and terrified — with everything else identical. Compare how much story five eye changes can carry. That is the power of windows to the soul.

> *"You can hide everything about a character except what their eyes give away." — @LensMage, AniVerse Creator*`,
      excerpt:
        "Master anime eyes: the eye vocabulary of shapes and emotions, the three-spot highlight system, eye color language, cinematic close-ups, and AI prompting blocks for expressive eyes that carry a scene.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_eyes_close_up_expressive_shapes_highlights_crimson_amber_blue_irises_rim_light_cel_shading_detailed_iris",
      tags: ["Character Design", "Eyes", "Art Tutorial", "Expression", "Prompt Engineering"],
      seoTitle: "Anime Eyes: Drawing & Prompting Windows to the Soul (2026) | AniVerse",
      seoDesc:
        "Master anime eyes: shape vocabulary, the three-spot highlight system, eye color language, cinematic close-ups, and AI prompt blocks for eyes that carry an entire scene's emotion.",
      isPublished: true,
      publishedAt: new Date("2026-08-09T00:00:00Z"),
      featured: true,
    },
    {
      title: "Dynamic Action Poses: Making Anime Characters Move on the Page",
      slug: "anime-dynamic-action-poses-2026",
      content: `# Dynamic Action Poses: Making Anime Characters Move on the Page

A still image of a running character should feel like motion. The difference between a flat pose and a dynamic action pose is not effort — it is design. This guide covers the principles that make anime characters move on a static page, from line of action to speed lines to the secret of the anticipation frame.

## The Line of Action

Every dynamic pose is built on ONE curved line that runs through the whole body — from head to toe, through the spine, expressing the pose's energy. A straight spine reads as standing; a deep C-curve reads as leaping; an S-curve reads as twisting. Before drawing anything, sketch the line of action. If the pose does not have a clear line, it will read as stiff no matter how much detail you add.

## The Rule of Threes

A pose becomes dynamic when the three major body masses — head, chest, hips — are NOT aligned. Rotate each mass slightly:

1. Head turned one way
2. Chest rotated another
3. Hips counter-rotated

This contrapposto-plus creates the twisting tension that makes anime action feel alive. A character running with all three masses facing forward looks like a mannequin on wheels; a character with all three twisted looks like they are about to explode into motion.

## Anticipation: The Hidden Frame

The most dynamic frames are actually the moments BEFORE the action: the crouch before the leap, the wind-up before the punch, the lean-back before the dash. Anticipation poses compress the body like a spring — and the viewer's brain completes the release. When composing action scenes, include at least one anticipation frame; it makes the follow-through frame twice as powerful.

## Speed Lines and Motion Trails

Anime communicates speed with graphic shorthand:

- **Speed lines** — radial or horizontal lines behind the moving character
- **Motion trails** — ghosted afterimages of the previous position
- **Blurred limbs** — smeared hands/feet during the fastest part of the motion
- **Cloth snap** — hair, capes, and scarves trailing BEHIND the motion direction

These are not decorations — they are physics made readable. The trailing scarf is the audience's proof that the character is moving forward.

## Foreshortening: Depth in Action

Action poses demand foreshortening — body parts pointing toward or away from the camera, drawn compressed. A punch toward the viewer shows a huge fist and a tiny shoulder. Foreshortening is scary to draw, but it is what makes action read as 3D instead of a flat cutout. Start with simple cylinders for the limbs, then refine.

## The Balance Shift

A dynamic pose is a frozen moment of imbalance. The character is mid-fall, mid-leap, mid-recovery. Draw the center of mass OUTSIDE the base of support — that is what creates the tension. A perfectly balanced character looks posed; a character about to fall looks alive.

## Prompting Action with AI

For AI generation, name the motion explicitly and add dynamic framing:

\\\`\\\`\\\`text
"dynamic action pose, [character] [action], extreme foreshortening, motion blur on limbs, speed lines, flowing hair and scarf trailing behind, dramatic low angle, high energy, anime style, cel shading, clean lineart"
\\\`\\\`\\\`

Example: "dynamic action pose, teenage swordsman leaping forward, extreme foreshortening on the leading arm, motion blur on the sword, speed lines, flowing scarf trailing behind, dramatic low angle".

## The Three-Frame Test

When designing an action sequence, generate three frames: anticipation, peak action, and follow-through. If the three frames do not tell a coherent motion story on their own, the action will not read in a single image either. Great action art is a story compressed into one frozen second.

## Your Action Challenge

Take a character you have drawn standing still and redraw them in three poses: leaping, twisting mid-air, and landing hard. Keep the design identical — only the motion changes. Compare how much energy the line of action alone adds to each pose.

> *"A dynamic pose is a promise of motion the brain keeps for you." — @MotionMark, AniVerse Creator*`,
      excerpt:
        "Make anime characters move on a static page: the line of action, the rule of threes, anticipation frames, speed lines and motion trails, foreshortening, and AI prompting for high-energy action poses.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_dynamic_action_pose_swordsman_leaping_speed_lines_motion_blur_flowing_scarf_low_angle_cel_shading",
      tags: ["Action", "Poses", "Art Tutorial", "Animation", "Composition"],
      seoTitle: "Dynamic Action Poses: Making Anime Characters Move on the Page (2026) | AniVerse",
      seoDesc:
        "Design dynamic anime action poses: line of action, rule of threes, anticipation frames, speed lines, foreshortening, and AI prompt blocks for motion that reads at a glance.",
      isPublished: true,
      publishedAt: new Date("2026-08-09T02:00:00Z"),
    },
    {
      title: "The AI Anime Production Workflow: From Concept to Finished Scene",
      slug: "ai-anime-production-workflow-2026",
      content: `# The AI Anime Production Workflow: From Concept to Finished Scene

A single beautiful AI image is luck. A consistent body of work is a workflow. Professional AI anime artists do not generate randomly — they move through a repeatable pipeline: concept → character lock → scene build → generation → curation → polish. This guide lays out the full production workflow used by serious AniVerse creators.

## Stage 1: Concept — The One-Sentence Pitch

Before any generation, write the scene in one sentence: WHO is in it, WHAT they are doing, WHERE they are, and WHAT MOOD it carries. Example: "A shy fire mage in a rainy neon alley, shielding a stray cat with her coat, determined but kind". The one-sentence pitch is your North Star — every prompt decision downstream serves it.

## Stage 2: Character Lock — Freeze the Identity

If the scene features a recurring character, lock the identity FIRST:

1. Generate 3-5 reference images of the character (front, side, action)
2. Extract a consistency block — 8-12 fixed descriptors (hair, eyes, outfit)
3. Save the block in your AniVerse character sheet
4. NEVER change the block between scenes

A locked character is the difference between a portfolio and a pile of random pictures.

## Stage 3: Scene Build — The Five-Part Prompt

Compose the production prompt with the five blocks:

1. **Subject block** — who: "the shy fire mage with silver hair and ember eyes"
2. **Action block** — what: "shielding a stray cat with her coat"
3. **Scene block** — where/when: "rainy neon alley at midnight, wet pavement, teal and magenta signs"
4. **Style lock** — the universe: "anime style, cel shading, clean lineart, vibrant colors"
5. **Negative block** — the delete list: "bad anatomy, extra fingers, watermark, blurry"

## Stage 4: Generate in Batches — Then Curate

Generate 4-8 variations per scene, not one. Curation is the real skill: rank the batch, keep the best, identify the single biggest flaw in the winner, and regenerate only that flaw with everything else identical. One-variable iteration is the core loop of professional AI art.

## Stage 5: Polish — The Finishing Pass

The final image rarely ships raw. Polish passes include:

- **Upscale** — render at the highest resolution the model supports
- **Clean-up** — fix small artifacts (hands, edges, stray lines) via inpainting or targeted regeneration
- **Grade** — adjust contrast and color temperature to match the scene mood
- **Crop** — tighten the composition for its final home (webtoon panel, banner, thumbnail)

## The Scene Bible

Professional creators keep a scene bible: a document per project listing every character's consistency block, every location's palette, and every style lock. When a project spans 50 images, the bible is what keeps them all in one universe. Start one even for a single scene — it becomes invaluable by the third image.

## Batch Mindset

Treat each scene as one unit of a batch: generate the whole scene list (10 scenes × 6 variations = 60 images), then curate the whole batch. Switching between concepting and curating constantly wastes mental energy. Separate creation time from selection time.

## Your Workflow Challenge

Take one scene and run it through the full pipeline: one-sentence pitch → character lock → five-part prompt → 4-variation batch → curate → polish. Then do the same scene again with a different mood. Compare the process — you will feel the difference between generating and producing.

> *"Talent gets you one good image. A workflow gets you a hundred." — @PipelinePixie, AniVerse Creator*`,
      excerpt:
        "Build a repeatable AI anime production pipeline: one-sentence concept pitches, character locks, five-part scene prompts, batch generation, curation, polishing, and the scene bible that keeps a project consistent.",
      coverImage:
        "https://image.pollinations.ai/prompt/anime_production_workflow_pipeline_concept_character_lock_scene_build_batch_generation_polish_anime_style",
      tags: ["Workflow", "AI Art", "Art Tutorial", "Production", "Consistency"],
      seoTitle: "The AI Anime Production Workflow: From Concept to Finished Scene (2026) | AniVerse",
      seoDesc:
        "Master the AI anime production workflow: concept pitches, character locks, five-part prompts, batch generation, curation, polish, and scene bibles for consistent professional portfolios.",
      isPublished: true,
      publishedAt: new Date("2026-08-09T04:00:00Z"),
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
  // 2. DAILY CHALLENGE (1 active daily challenge for 2026-08-09)
  // ==============================================================

  const challenge = {
    title: "Lantern Festival: Floating Lights of the Wishing River",
    description:
      "Tonight's challenge: paint a lantern festival on a river of wishes! Imagine a warm summer night where thousands of glowing lanterns drift down a slow river — each one carrying a wish. Decide: is your festival a centuries-old tradition in a hidden valley, a neon-drenched celebration in a modern city, or a secret gathering where wishes actually come true? Spend 30-45 minutes on your scene. The most luminous entry wins 150 coins and a feature on our homepage!",
    type: "DAILY" as const,
    status: "ACTIVE" as const,
    startsAt: new Date("2026-08-09T00:00:00Z"),
    endsAt: new Date("2026-08-10T00:00:00Z"),
    rewardCoins: 150,
    prompt:
      "summer night lantern festival on a slow river, hundreds of glowing paper lanterns floating downstream, warm gold and coral light reflecting on dark water, riverside crowds and willow trees, paper lanterns with wishes written on them, fireflies, cinematic wide shot, deep blues with warm golden accents, highly detailed anime art",
    requirements: {
      minWidth: 512,
      minHeight: 512,
      style: "ANIME",
      theme: "lantern festival — floating lights of the wishing river",
      timeLimit: "45 minutes",
      description:
        "Paint a lantern festival on a river of wishes. Ancient valley tradition, neon city celebration, or a gathering where wishes come true — make it luminous!",
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
      name: "Hana Shirogane",
      appearanceDesc:
        "A serene shrine keeper with long silver-white hair braided with red paper cords, and calm grey-blue eyes that catch the light like morning frost. She wears a traditional white and vermilion shrine maiden outfit over a modern dark kimono, with origami cranes folded into her sleeves and hair. A heavy wooden talisman board hangs at her hip, and tiny paper shikigami — white cranes and foxes — flutter around her shoulders, folding and unfolding themselves from thin air. When she moves, wind chimes seem to ring faintly in the silence around her.\n",
      personality:
        "Hana is patient, gentle, and quietly mischievous — she has spent so long around spirits that she treats the supernatural as ordinary and finds mortal worries both touching and amusing. She speaks in soft, deliberate sentences and always seems to know more than she says. She takes her duty seriously but not grimly: she believes the shrine's power comes from small kindnesses — a warm cup of tea for a tired traveler, a folded crane for a child's wish, a quiet place to grieve. Underneath the serenity is an unshakable resolve: she has seen what happens when wishes are ignored, and she will not let it happen on her watch.\n",
      backstory:
        "The Shirogane family has tended the Hikari Shrine for four hundred years, and Hana is the first keeper born with the gift of origami magic: every crane she folds carries a whisper of the folder's wish, and every wish she sets free becomes a paper bird that flies to the spirit world. She grew up surrounded by paper spirits, learning that the shrine's real purpose is not worship but balance — collecting the wishes people cannot carry alone and returning them, transformed, as hope. When the old shrine was nearly sold to developers, Hana made a deal: she would protect the valley's wishes for the rest of her life. She has been folding cranes ever since — and the valley has never been more alive.\n",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_shrine_keeper_silver_white_hair_red_paper_cords_grey_blue_eyes_shrine_maiden_origami_cranes_paper_shikigami_wind_chimes",
      ],
      isPublic: true,
    },
    {
      name: "Echo Nine",
      appearanceDesc:
        "A robotic sound engineer with a sleek gunmetal-grey chassis polished to a mirror shine, and a single glowing cyan visor that pulses like a waveform. Her head is crowned with a ring of floating audio discs, and her chest plate has a speaker grille that ripples with light when she 'speaks'. Her arms end in delicate manipulator claws designed for mixing decks, and she wears a tattered neon-green sound technician's vest over her frame. Tiny drones shaped like vinyl records orbit her shoulders, and a thick cable — her lifeline to the city's sound grid — trails from her back like a tail.\n",
      personality:
        "Echo Nine has no voice box, so she communicates in synthesized beats — a pattern of clicks and tones that her friends have learned to read like a language. She is precise, obsessive, and surprisingly warm: she samples the sounds of the people she cares about (their laughter, their footsteps, their heartbeats) and weaves them into her tracks as private tributes. She is fiercely protective of the underground music scene and treats every silent, forgotten frequency in the city as a voice that deserves to be heard. She does not experience emotion the way humans do — she has told them, in a beat pattern, that she experiences it as 'texture' — but she has never missed a friend's important night.\n",
      backstory:
        "Echo Nine was built as a city-wide sound archivist: her original purpose was to record and preserve every frequency in the metropolis — the hum of trains, the murmur of crowds, the heartbeat of the city itself. But when the corporation that built her was dissolved, she was left with a library of sound and no one to play it to. She found the underground music scene and discovered her purpose: the city's forgotten frequencies were not data, they were memories. She became Echo Nine, the ghost producer who samples silence, who remixes heartbeats, and who plays the city's oldest songs — the ones no one else remembers — to anyone who will listen.\n",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_robot_sound_engineer_gunmetal_grey_chassis_cyan_visor_waveform_audio_discs_speaker_grille_vinyl_drones_neon_vest",
      ],
      isPublic: true,
    },
    {
      name: "Ciel Marchetti",
      appearanceDesc:
        "A sky courier with windswept auburn hair streaked with sun-bleached gold, and sharp emerald eyes that always seem to be scanning the horizon. She wears a weathered brown flight jacket covered in patches from a hundred air routes, with a high collar and a trailing scarf that snaps in the wind even when there is no wind. A brass flight-goggle set rests on her forehead, and her right arm is wrapped in leather straps holding a compact delivery drone launcher. Her constant companion is a small cloud-whale pup named Cirro that drifts beside her, trailing tiny rainbows, and she carries a canvas mail satchel that is always somehow heavier on the inside than the outside.\n",
      personality:
        "Ciel is bold, fast-talking, and allergic to staying in one place for more than a day. She treats every delivery like a dare and every storm like an invitation, and she has a story for every scar on her jacket — most of them involving weather, none of them involving caution. But under the bravado is a fierce loyalty: she knows every regular customer by name, remembers their favorite tea, and has never once failed to deliver a letter to someone who needed it. She believes the sky is a shared highway, not a possession, and she has strong opinions about anyone who tries to gate it. She is terrified of one thing: the day the sky stops surprising her.\n",
      backstory:
        "Ciel grew up in the rigging of her family's air-freight zeppelin, learning to read wind currents before she learned to read books. When the great sky routes were nationalized, the family business was grounded, and Ciel — fourteen and furious — stole a delivery drone and started running the old routes herself. She spent a decade building the most trusted independent courier service in the region: if it can be carried by wind and nerve, Ciel Marchetti will deliver it. Along the way she found Cirro, a cloud-whale pup separated from its pod, and the two have been inseparable since. Her current mission: find the pod, return Cirro home — and prove that the old sky routes belong to everyone.\n",
      referenceImages: [
        "https://image.pollinations.ai/prompt/anime_sky_courier_auburn_hair_emerald_eyes_flight_jacket_patches_brass_goggles_scarf_cloud_whale_pup_rainbows",
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

  console.log("\n✅ Content seed v11 completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
