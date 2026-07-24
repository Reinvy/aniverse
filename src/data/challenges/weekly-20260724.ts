/**
 * Weekly Challenge — Week of July 24–30, 2026
 * Theme: "Retro '90s Anime Revival"
 *
 * The weekly challenge is a larger, week-long event with better rewards.
 * Based on Agent A1 market research: the '90s anime aesthetic is making
 * a massive comeback (Science SARU's approach, retro cel-shaded look).
 *
 * Participants create full anime-style scenes using the retro '90s
 * aesthetic — high saturation, cel-shading, neon accents, and a
 * nostalgic cyberpunk/fantasy feel.
 */

export interface WeeklyChallenge {
  date: string;
  title: string;
  theme: string;
  description: string;
  prompt: string;
  rules: string[];
  prize: string;
  timeLeft: string;
  participants: number;
  sponsors?: string[];
  milestones?: {
    participants: number;
    reward: string;
  }[];
}

export const weeklyChallenge: WeeklyChallenge = {
  date: "2026-07-24",
  title: "Retro '90s Anime Revival",
  theme: "Style Challenge",
  description:
    "Step back in time! The '90s anime aesthetic is back in a big way. Create an artwork that captures the essence of 1990s anime — bold cel-shading, high-saturation colors, dramatic lighting, and that unmistakable retro vibe. Think Neon Genesis Evangelion, Cowboy Bebop, Sailor Moon, or original '90s OVA style. This is a week-long challenge — take your time to craft something truly nostalgic.",
  prompt:
    "1990s anime style, retro cel-shading, bold outlines, high saturation colors, dramatic lighting, nostalgic atmosphere, vintage anime aesthetic, traditional animation look, cinematic composition, detailed background",
  rules: [
    "Must use retro '90s anime aesthetic — cel-shading, bold outlines, high saturation",
    "Can be any genre: mecha, fantasy, romance, cyberpunk, or original",
    "No AI-generated images that look modern — must clearly evoke the '90s style",
    "Include at least one character with '90s-era anime hair/styling",
    "Submit with #AniVerse90sRevival on social media (for bonus prizes)",
    "One submission per user, but you may revise your entry before deadline",
    "Community voting will determine top 3 winners",
  ],
  prize: "🥇 2,000 Coins + 1 Month Pro Free + Profile Trophy + Featured in Newsletter\n🥈 1,000 Coins + Profile Medal\n🥉 500 Coins + Profile Badge\n🎖️ All participants get 100 Coins + '90s Kid Profile Badge",
  timeLeft: "7d",
  participants: 0,
  milestones: [
    { participants: 25, reward: "Bonus 200 coins for all participants" },
    { participants: 50, reward: "All participants get 'Retro Veteran' title" },
    { participants: 100, reward: "Top prize upgraded to 2 months Pro free" },
  ],
};

export default weeklyChallenge;
