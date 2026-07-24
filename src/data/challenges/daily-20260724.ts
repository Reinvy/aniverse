/**
 * Daily Challenge — July 24, 2026 (Friday)
 * Theme: "Dusty Pastels: Frieren's Palette"
 *
 * Friday is Color Challenge day — participants must use a specific
 * color palette inspired by the trending "Frieren" aesthetic:
 * muted warm tones, dusty pastels, and soft earthy hues.
 *
 * Market research (A1) confirms "Dusty Pastels" is one of the top
 * trending color palettes in anime art for 2026.
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
  date: "2026-07-24",
  title: "Dusty Pastels: Frieren's Palette",
  theme: "Color Challenge",
  description:
    "Create an anime artwork using the Dusty Pastels palette inspired by Frieren's aesthetic — muted warm tones, dusty lavender, sage green, and soft earthy hues. Let the colors tell a story of melancholy beauty and gentle nostalgia.",
  prompt:
    "Anime illustration, dusty pastel color palette, muted lavender and sage green tones, warm earthy browns, soft lighting, gentle atmosphere, ethereal mood, fantasy setting, detailed background, cinematic composition",
  rules: [
    "Use ONLY colors from the Dusty Pastels palette (see palette below)",
    "No pure black or pure white — keep everything in the pastel range",
    "At least 60% of the artwork must use the core palette colors",
    "Theme: fantasy or slice-of-life with an emotional/melancholic undertone",
    "Submit with the hashtag #AniVerseDustyPastels",
    "One submission per user",
  ],
  prize: "🏆 500 Coins + Featured in Gallery for 24h + Dusty Pastels Badge on Profile",
  timeLeft: "24h",
  participants: 0,
  palette: [
    "#C4A7B3", // Dusty Lavender
    "#A8B5A0", // Sage Green
    "#D4C4B0", // Warm Sand
    "#E8D5C4", // Pale Peach
    "#B5A892", // Warm Taupe
    "#D3C5C5", // Misted Rose
    "#8FA89A", // Weathered Sage
    "#C9B8A7", // Soft Fawn
  ],
};

export default dailyChallenge;
