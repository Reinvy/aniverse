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
  { label: "Gallery", href: "/gallery" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Marketplace", href: "/marketplace" },
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
  { id: "chibi", label: "Chibi", description: "Cute, proportionally exaggerated characters" },
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
