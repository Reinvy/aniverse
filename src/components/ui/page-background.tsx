import { cn } from "@/lib/utils";

export interface PageBackgroundProps {
  /** Opacity of the starfield layer (default: 0.4) */
  starfieldOpacity?: number;
  /** Opacity of the grid overlay layer (default: 0.15) */
  gridOpacity?: number;
  /** Whether to include the scanline CRT overlay (default: true) */
  scanline?: boolean;
  /** Extra classes applied to the wrapper */
  className?: string;
}

/**
 * Reusable game-style background stack — AniVerse Design System v2.
 *
 * Renders the canonical page backdrop used by public sub-pages:
 * deep eclipse base + starfield dots + tech grid + CRT scanline.
 * All layers are pointer-events-none so content stays interactive.
 *
 * Usage:
 *   <PageBackground starfieldOpacity={0.4} gridOpacity={0.15} />
 */
export function PageBackground({
  starfieldOpacity = 0.4,
  gridOpacity = 0.15,
  scanline: showScanline = true,
  className,
}: PageBackgroundProps) {
  return (
    <div
      className={cn("pointer-events-none fixed inset-0", className)}
      aria-hidden="true"
    >
      <div className="absolute inset-0 bg-eclipse" />
      <div className="absolute inset-0 bg-starfield" style={{ opacity: starfieldOpacity }} />
      <div className="absolute inset-0 bg-grid" style={{ opacity: gridOpacity }} />
      {showScanline && <div className="absolute inset-0 scanline" />}
    </div>
  );
}

export default PageBackground;
