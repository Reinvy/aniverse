"use client";

import * as React from "react";
import { ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * ScrollToTop — game-style floating "back to top" button with a
 * celestial-gold scroll-progress ring (AniVerse Design System v2).
 *
 * - Appears after the user scrolls past `showAfter` px (fade + rise)
 * - Outer conic-gradient ring fills 0° → 360° as the page is scrolled
 * - Diamond indicator (◆) micro-detail + monospace sys-label tooltip
 * - Smooth scroll to top; falls back to instant when the user prefers
 *   reduced motion (scroll-behavior is also globally disabled there)
 */
export function ScrollToTop({
  className,
  showAfter = 480,
  label = "TOP // RETURN",
}: {
  className?: string;
  /** Scroll depth (px) after which the button becomes visible */
  showAfter?: number;
  /** Tooltip label shown on hover */
  label?: string;
}) {
  const [progress, setProgress] = React.useState(0);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    let raf = 0;

    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        const pct =
          docHeight > 0
            ? Math.min(100, Math.max(0, (scrollTop / docHeight) * 100))
            : 0;
        setProgress(pct);
        setVisible(scrollTop > showAfter);
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [showAfter]);

  const handleClick = () => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Back to top"
      className={cn(
        "group fixed bottom-6 right-5 z-40 flex h-12 w-12 items-center justify-center rounded-full",
        "transition-all duration-300 premium-transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgba(229,197,135,0.5)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#05080F]",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
        className,
      )}
      style={{
        background: `conic-gradient(#e6c280 ${progress * 3.6}deg, rgba(255,255,255,0.08) 0deg)`,
      }}
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <span className="relative flex h-[42px] w-[42px] items-center justify-center rounded-full border border-[rgba(229,197,135,0.25)] bg-[#0b0f19]/95 shadow-[0_0_20px_rgba(229,197,135,0.12)] backdrop-blur-xl">
        <ChevronUp className="h-5 w-5 text-[#e6c280] transition-transform duration-300 group-hover:-translate-y-0.5" />
        <span
          aria-hidden="true"
          className="absolute right-1.5 top-0.5 text-[8px] text-[#e6c280]/70"
        >
          ◆
        </span>
      </span>

      {/* Hover tooltip — monospace HUD label */}
      <span className="sys-label pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-[4px] border border-[rgba(229,197,135,0.2)] bg-[#0b0f19]/95 px-2 py-1 text-[10px] tracking-wider text-[#e6c280] opacity-0 backdrop-blur-xl transition-opacity duration-200 group-hover:opacity-100">
        {label}
      </span>
    </button>
  );
}

export default ScrollToTop;
