/**
 * Daily Challenge — July 27, 2026 (Monday)
 * Theme: "Cyberpunk Summer Matsuri"
 *
 * Monday is Character Design Challenge day — participants create an
 * original anime character blending two hot aesthetics: neon cyberpunk
 * and traditional Japanese summer festival (matsuri). Market research
 * (A1) confirms "Cyberpunk x Traditional" is trending in 2026 anime
 * character design communities on Pinterest and Twitter.
 */

export interface DailyChallenge {
  date: string;
  title: string;
  theme: string;
  description: string;
  prompt: string;
  rules: string[];
  prize: string;
  timeLeft: string;
  participants: number;
  palette?: string[];
}

export const dailyChallenge: DailyChallenge = {
  date: "2026-07-27",
  title: "Cyberpunk Summer Matsuri",
  theme: "Character Design Challenge",
  description:
    "Design an original anime character that fuses the neon-drenched cyberpunk aesthetic with the timeless traditions of a Japanese summer festival (matsuri). Think holographic yukata, LED-lit geta sandals, hanabi-flavored RAM, and obi sashes that double as data displays. The character should feel at home in a 2088 summer festival where ancient temple bells ring alongside synthwave beats.",
  prompt:
    "Original anime character design, cyberpunk x traditional Japanese matsuri fusion, neon yukata with holographic patterns, LED accessories, festival backdrop with digital torii gates, vibrant cyan and magenta neon accents against warm festival lantern light, detailed character sheet style, dynamic pose, futuristic yet traditional elements",
  rules: [
    "Character must blend cyberpunk (neon, tech, futuristic) with matsuri (yukata, lanterns, festival) elements",
    "Include at least one traditional Japanese festival accessory reimagined with tech (e.g., digital fan, holographic mask, LED fireworks hairpin)",
    "Design must be a full-body character concept (not just portrait)",
    "Color palette must balance warm festival tones (red, gold, amber) with cyberpunk neons (cyan, magenta, electric blue)",
    "Write a 2-3 sentence character bio alongside the art",
    "Submit with the hashtag #AniVerseMatsuri2088",
    "One submission per user",
  ],
  prize: "🏆 700 Coins + Featured in Gallery for 48h + Cyberpunk Matsuri Badge on Profile + Character featured on Twitter + $5 Credit toward Premium",
  timeLeft: "48h",
  participants: 0,
  palette: [
    "#FF3B3B", // Festival Red
    "#FFD700", // Golden Lantern
    "#00FFFF", // Cyber Cyan
    "#FF00FF", // Neon Magenta
    "#1A1A2E", // Deep Night Blue
    "#FF8C42", // Warm Amber
    "#00FFAA", // Holographic Teal
    "#E8D5B7", // Paper Lantern Cream
  ],
};

export default dailyChallenge;
