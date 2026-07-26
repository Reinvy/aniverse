/**
 * Daily Challenge — July 26, 2026 (Sunday)
 * Theme: "Ghibli-esque Sunday Morning"
 *
 * Sunday is Cozy Style Challenge day — participants create a warm,
 * nostalgic scene inspired by Studio Ghibli's slice-of-life aesthetic.
 * Market research (A1) confirms Ghibli-inspired art continues to
 * dominate engagement metrics across Instagram and Pinterest.
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
  date: "2026-07-26",
  title: "Ghibli-esque Sunday Morning",
  theme: "Style Challenge",
  description:
    "Capture the quiet magic of a Sunday morning in the style of Studio Ghibli. Think sun-drenched kitchens, breezy gardens, sleepy cats, and the warm glow of golden hour light filtering through curtains. Nostalgia, comfort, and serenity are the keys — make us feel at home.",
  prompt:
    "Anime illustration in Studio Ghibli style, cozy Sunday morning atmosphere, warm golden sunlight, soft painterly textures, detailed background of a peaceful home or garden, nostalgic mood, gentle color palette, slice-of-life scene, cinematic composition, beautiful lighting",
  rules: [
    "Emulate the Ghibli visual style — soft painterly backgrounds, warm lighting, meticulous detail",
    "Theme must be a peaceful Sunday morning activity (breakfast, reading, gardening, etc.)",
    "Include at least one nature element (plants, trees, sunlight through leaves, etc.)",
    "No action scenes — the mood should be calm and contemplative",
    "Use a warm, nostalgic color palette with golden tones",
    "Submit with the hashtag #AniVerseGhibliSunday",
    "One submission per user",
  ],
  prize: "🏆 600 Coins + Featured in Gallery for 48h + Ghibli Sunday Badge on Profile + Art featured on Instagram",
  timeLeft: "48h",
  participants: 0,
  palette: [
    "#F5E6CA", // Warm Cream
    "#E8C39E", // Golden Peach
    "#B8D4C3", // Soft Mint
    "#A8C4D4", // Powder Blue
    "#D4A574", // Toasted Almond
    "#E8D5B7", // Pale Honey
    "#7BA8A0", // Weathered Teal
    "#C9A87C", // Warm Caramel
  ],
};

export default dailyChallenge;
