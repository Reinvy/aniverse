/**
 * AniVerse — Centralized Sort Field Configurations
 *
 * DRY: Defines allowed sort fields per entity so service layers
 * don't duplicate these arrays. Import and pass to buildOrderBy().
 */

export const ARTWORK_SORT_FIELDS = [
  "createdAt",
  "title",
  "updatedAt",
  "style",
] as const;

export const BLOG_ARTICLE_SORT_FIELDS = [
  "publishedAt",
  "title",
  "createdAt",
  "updatedAt",
] as const;

export const CHARACTER_SORT_FIELDS = [
  "createdAt",
  "name",
  "updatedAt",
] as const;

export const CHALLENGE_SORT_FIELDS = [
  "createdAt",
  "startsAt",
  "endsAt",
  "title",
  "rewardCoins",
] as const;

export const USER_SORT_FIELDS = [
  "createdAt",
  "name",
  "email",
  "role",
  "premiumTier",
] as const;

export type ArtworkSortField = (typeof ARTWORK_SORT_FIELDS)[number];
export type BlogArticleSortField = (typeof BLOG_ARTICLE_SORT_FIELDS)[number];
export type CharacterSortField = (typeof CHARACTER_SORT_FIELDS)[number];
export type ChallengeSortField = (typeof CHALLENGE_SORT_FIELDS)[number];
export type UserSortField = (typeof USER_SORT_FIELDS)[number];
