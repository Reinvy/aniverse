## What
Added "Photo-to-Anime" feature to AniVerse — new style presets, trending style showcase, and landing page feature card.
Capitalizes on the viral AI caricature trend identified by Agent A1's market research.

## Why
- Agent A1 market research (2026-07-26) identified "AI caricature trend going viral" as the #1 opportunity
- PixAI at 15M users validates massive demand for anime-style photo transformation
- Photo-to-anime is the top trending AI art format on social media (Instagram, TikTok, X)
- Positions AniVerse as a leader in the AI caricature / photo-to-anime space

## Changes
| File | Change |
|------|--------|
| `src/lib/constants.ts` | Added `photo-to-anime` and `caricature` style presets; added `photo-to-anime` trending style with "HOT" badge |
| `src/app/page.tsx` | Replaced "Safe & Private" feature with "Photo-to-Anime™" feature card using Camera icon; cleaned up unused Shield import |

## How to Test
1. Visit landing page → verify "Photo-to-Anime™" feature card appears in the features grid (sky-cyan gradient, Camera icon)
2. Scroll to "Trending Now" section → verify "Photo-to-Anime" appears with "HOT" badge
3. Navigate to create page → verify "Photo-to-Anime" and "Anime Caricature" style presets are selectable

## Environment Variables Affected
None.
