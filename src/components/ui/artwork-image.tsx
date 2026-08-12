"use client";

import * as React from "react";
import { ImageOff } from "lucide-react";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────
 * ArtworkImage — reusable game-style image with graceful states
 *
 * Design System v2: renders artwork/photos with a full lifecycle —
 * shimmer skeleton while loading, the image when ready, and a
 * game-style "signal lost" fallback panel when the URL fails
 * (Pollinations endpoints can time out or 4xx).
 *
 * Usage:
 *   <ArtworkImage src={art.imageUrl} alt={art.title}
 *     className="absolute inset-0 h-full w-full object-cover" />
 *
 * The root wrapper handles aspect/positioning; `className` is
 * applied to the <img> element itself.
 * ────────────────────────────────────────────────────────────── */

export interface ArtworkImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "src"> {
  /** Image URL. When null/empty the fallback panel renders. */
  src: string | null | undefined;
  /** Accessible alt text */
  alt: string;
  /** Classes for the wrapping container (sizing/positioning) */
  wrapperClassName?: string;
  /** Optional fallback icon size class (default h-8 w-8) */
  fallbackIconClassName?: string;
  /** Optional fallback label shown under the icon */
  fallbackLabel?: string;
}

export function ArtworkImage({
  src,
  alt,
  className,
  wrapperClassName,
  fallbackIconClassName,
  fallbackLabel,
  ...props
}: ArtworkImageProps) {
  const [status, setStatus] = React.useState<"loading" | "loaded" | "error">(
    src ? "loading" : "error",
  );

  // Reset state when the src changes (new page / new artwork).
  // Adjusting state during render is the React-recommended pattern for
  // deriving state from a changing prop (avoids effect cascades).
  const [prevSrc, setPrevSrc] = React.useState(src);
  if (prevSrc !== src) {
    setPrevSrc(src);
    setStatus(src ? "loading" : "error");
  }

  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden bg-[rgba(0,0,0,0.3)] text-white/10",
        wrapperClassName,
      )}
    >
      {src && status !== "error" ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            onLoad={() => setStatus("loaded")}
            onError={() => setStatus("error")}
            className={cn(
              "transition-opacity duration-500",
              status === "loaded" ? "opacity-100" : "opacity-0",
              className,
            )}
            {...props}
          />
          {/* Shimmer overlay while loading */}
          {status === "loading" && (
            <div
              aria-hidden="true"
              className="absolute inset-0 before:absolute before:inset-0 before:-translate-x-full
                before:bg-gradient-to-r before:from-transparent before:via-[rgba(230,194,128,0.08)]
                before:to-transparent before:animate-[shimmer_1.5s_infinite]"
            />
          )}
        </>
      ) : (
        /* Game-style fallback panel */
        <div
          role="img"
          aria-label={alt}
          className="relative flex flex-col items-center justify-center gap-1.5 p-4 text-center"
        >
          <span className="pointer-events-none absolute left-1.5 top-1.5 text-[8px] text-white/15">
            [SIG.LOST]
          </span>
          <ImageOff
            aria-hidden="true"
            className={cn("text-white/15", fallbackIconClassName ?? "h-8 w-8")}
          />
          {fallbackLabel && (
            <span className="sys-label text-white/20">{fallbackLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}

export default ArtworkImage;
