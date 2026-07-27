/**
 * AniVerse application constants.
 */

export const APP_NAME = "AniVerse";
export const APP_TAGLINE = "Where AI Meets Anime Art";
export const APP_DESCRIPTION =
  "AniVerse is a creative platform for generating, sharing, and discovering AI-powered anime artwork.";

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

/** Navigation links for the public site header. */
export const MAIN_NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Gallery", href: "/dashboard/gallery" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Marketplace", href: "/dashboard/marketplace" },
] as const;

/** Dashboard sidebar navigation items. */
export const DASHBOARD_NAV = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: "LayoutDashboard",
  },
  {
    label: "Gallery",
    href: "/dashboard/gallery",
    icon: "Image",
  },
  {
    label: "Create",
    href: "/dashboard/create",
    icon: "Wand2",
  },
  {
    label: "Marketplace",
    href: "/dashboard/marketplace",
    icon: "Store",
  },
  {
    label: "Social",
    href: "/dashboard/social",
    icon: "Share2",
  },
  {
    label: "Challenges",
    href: "/dashboard/challenges",
    icon: "Trophy",
  },
  {
    label: "Monetization",
    href: "/dashboard/monetization",
    icon: "DollarSign",
  },
] as const;

/** Subscription tier definitions. */
export const TIERS = {
  FREE: {
    id: "free",
    name: "Free",
    price: 0,
    credits: 10,
    features: [
      "10 AI generations per month",
      "Standard resolution (512×512)",
      "Basic style presets",
      "Community gallery access",
    ],
    color: "zinc",
    popular: false,
  },
  PRO: {
    id: "pro",
    name: "Pro",
    price: 9.99,
    credits: 100,
    features: [
      "100 AI generations per month",
      "HD resolution (1024×1024)",
      "All style presets + custom prompts",
      "Commercial license",
      "Priority generation queue",
      "Export without watermark",
    ],
    color: "violet",
    popular: true,
  },
  STUDIO: {
    id: "studio",
    name: "Studio",
    price: 24.99,
    credits: "Unlimited",
    features: [
      "Unlimited AI generations",
      "4K resolution (2048×2048)",
      "Full model control + negative prompts",
      "Commercial + resale license",
      "Priority support",
      "API access (1000 req/day)",
      "Team collaboration (up to 5)",
    ],
    color: "amber",
    popular: false,
  },
} as const;

export type TierId = keyof typeof TIERS;

/** Annual pricing (20% discount applied). */
export const ANNUAL_PRICES: Record<Exclude<TierId, "FREE">, number> = {
  PRO: 7.99,
  STUDIO: 19.99,
} as const;

/** Coin pack definitions for microtransactions. */
export const COIN_PACKS = [
  { id: "coins-10", coins: 10, price: 1.99, bonus: 0, label: "Starter Pack" },
  { id: "coins-50", coins: 50, price: 7.99, bonus: 5, label: "Creator Pack" },
  { id: "coins-100", coins: 100, price: 14.99, bonus: 15, label: "Pro Pack" },
  { id: "coins-500", coins: 500, price: 59.99, bonus: 100, label: "Mega Pack" },
] as const;

/** Marketplace commission rate. */
export const MARKETPLACE_COMMISSION_RATE = 0.15 as const;

/** Referral program reward structure. */
export const REFERRAL_REWARDS = {
  referrerCredit: 5, // $5 credit
  refereeDiscountPercent: 20, // 20% off first month
  maxReferralsPerMonth: 10,
  minPayout: 20, // minimum $20 to withdraw
} as const;

/** Pricing display variants. */
export const PRICING_INTERVALS = [
  { label: "Monthly", value: "monthly" },
  { label: "Annual", value: "annual" },
] as const;

/** Featured gallery categories. */
export const GALLERY_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "portraits", label: "Portraits" },
  { id: "landscapes", label: "Landscapes" },
  { id: "fantasy", label: "Fantasy" },
  { id: "sci-fi", label: "Sci-Fi" },
  { id: "chibi", label: "Chibi" },
  { id: "cyberpunk", label: "Cyberpunk" },
] as const;

/** Style presets for AI generation. */
export const STYLE_PRESETS = [
  { id: "anime-classic", label: "Classic Anime", description: "Traditional cel-shaded anime style" },
  { id: "anime-modern", label: "Modern Anime", description: "Clean, high-detail modern anime aesthetic" },
  { id: "watercolor", label: "Watercolor", description: "Soft watercolor painted look" },
  { id: "cyberpunk", label: "Cyberpunk", description: "Neon-drenched futuristic style" },
  { id: "ghibli", label: "Ghibli-inspired", description: "Warm, whimsical Studio Ghibli aesthetic" },
  { id: "ghibli-background", label: "Ghibli Background", description: "Lush, detailed Ghibli-style landscape backgrounds" },
  { id: "ghibli-character", label: "Ghibli Character", description: "Classic Miyazaki-era Ghibli character design" },
  { id: "retro-90s", label: "Retro '90s", description: "Vibrant cel-shaded 1990s anime revival aesthetic" },
  { id: "vhs-anime", label: "VHS Anime", description: "Grainy VHS-tape look with scanlines and warm color bleed" },
  { id: "chibi", label: "Chibi", description: "Cute, proportionally exaggerated characters" },
  { id: "pixel-anime", label: "Pixel Anime", description: "Pixel-art fusion with anime-style characters and sprites" },
  { id: "vaporwave", label: "Vaporwave", description: "Retro-futuristic neon-drenched aesthetic with purple and pink hues, glitch effects, and '80s/'90s nostalgia" },
  { id: "dusty-pastel", label: "Dusty Pastel", description: "Muted, warm fantasy tones inspired by Frieren's soft color palette — perfect for romance and fantasy genres" },
  { id: "caricature", label: "Caricature", description: "Exaggerated, playful caricature style with bold features and vibrant colors — inspired by the viral AI caricature trend" },
  { id: "sepia-nostalgia", label: "Sepia Nostalgia", description: "Warm sepia-toned vintage anime aesthetic with film grain texture — retro photo look applied to anime characters" },
  { id: "pastel-goth", label: "Pastel Goth", description: "Dark romance meets soft pastels — muted charcoals paired with blush pinks, lavender, and mint tones" },
] as const;

/** Trending styles from market research (used for showcase). */
export const TRENDING_STYLES = [
  {
    id: "caricature",
    label: "AI Caricature",
    description: "The viral AI caricature trend is exploding — exaggerated features, bold colors, and playful expressions turning photos into anime-style portraits.",
    gradient: "from-orange-500 to-red-600",
    badge: "HOT",
  },
  {
    id: "retro-90s",
    label: "Retro '90s Revival",
    description: "The iconic cel-shaded look of 1990s anime is back — think Science SARU's vibrant aesthetic. High saturation, bold outlines, and nostalgic charm.",
    gradient: "from-pink-500 to-rose-600",
    badge: "HOT",
  },
  {
    id: "ghibli",
    label: "Ghibli-Inspired",
    description: "Studio Ghibli's warm, whimsical style continues to dominate. From lush forest backdrops to gentle character designs — timeless and beloved.",
    gradient: "from-emerald-500 to-teal-600",
    badge: "TRENDING",
  },
  {
    id: "vaporwave",
    label: "Vaporwave Neon",
    description: "Vaporwave's retro-futuristic aesthetic is surging — neon sunsets, glitch typography, and purple-pink gradients defining 2026's anime art revolution.",
    gradient: "from-purple-500 to-fuchsia-600",
    badge: "HOT",
  },
  {
    id: "dusty-pastel",
    label: "Dusty Pastel",
    description: "Muted, warm fantasy tones inspired by Frieren's palette — soft lavenders, dusty roses, and sage greens dominating romance and fantasy anime art.",
    gradient: "from-rose-400 to-orange-400",
    badge: "TRENDING",
  },
  {
    id: "sepia-nostalgia",
    label: "Sepia Nostalgia",
    description: "Warm sepia-toned vintage anime aesthetic with film grain texture — TikTok's #animeedit community is driving this nostalgic trend to new heights.",
    gradient: "from-yellow-600 to-amber-700",
    badge: "NEW",
  },
] as const;

/** Example artworks for feature showcase. */
export const FEATURED_ARTWORKS = [
  {
    id: "1",
    title: "Neon Samurai",
    artist: "CyberWeeb",
    likes: 1243,
    image: "/placeholder-artwork.svg",
  },
  {
    id: "2",
    title: "Spirit of the Forest",
    artist: "MoriArt",
    likes: 982,
    image: "/placeholder-artwork.svg",
  },
  {
    id: "3",
    title: "Starlight Dancer",
    artist: "KiraKira",
    likes: 2156,
    image: "/placeholder-artwork.svg",
  },
  {
    id: "4",
    title: "Mechanized Dreams",
    artist: "NeonWeeb",
    likes: 745,
    image: "/placeholder-artwork.svg",
  },
] as const;
