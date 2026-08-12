"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

// ─── Section Definitions ───────────────────────────────────────

export type SectionId = "hero" | "features" | "showcase" | "pricing" | "faq";

export interface SectionConfig {
  id: SectionId;
  label: string;
  labelJa: string;
  icon: string;
  shortDesc: string;
}

export const SECTIONS: SectionConfig[] = [
  { id: "hero",     label: "Home",     labelJa: "ホーム",   icon: "◈", shortDesc: "Welcome" },
  { id: "features", label: "Features", labelJa: "特徴",     icon: "◇", shortDesc: "Capabilities" },
  { id: "showcase", label: "Showcase", labelJa: "ショーケース", icon: "○", shortDesc: "Gallery" },
  { id: "pricing",  label: "Pricing",  labelJa: "料金",     icon: "◆", shortDesc: "Plans" },
  { id: "faq",      label: "About",    labelJa: "概要",     icon: "□", shortDesc: "FAQ / Info" },
];

/** Direction for entrance/exit animations — "none" means no dir change */
export type NavDirection = "left" | "right" | "up" | "down" | "none";

// ─── Context ───────────────────────────────────────────────────

interface SpatialContextValue {
  activeSection: SectionId;
  isTransitioning: boolean;
  navigateTo: (section: SectionId) => void;
  direction: NavDirection;
  /** Camera CSS transform for desktop spatial mode */
  cameraTransform: string;
}

const sectionOrder: SectionId[] = SECTIONS.map((s) => s.id);

/**
 * Map a URL hash (e.g. `#features`, `#pricing`) to a section id.
 * Header nav links (MAIN_NAV_LINKS) point to `/#features` and `/#pricing`,
 * so the spatial canvas must honor them as deep-link anchors instead of
 * always mounting on the hero node. Unknown/empty hashes → null (hero).
 */
function sectionFromHash(hash: string): SectionId | null {
  if (!hash || hash === "#" || hash === "#/") return null;
  const id = hash.replace(/^#\/?/, "") as SectionId;
  return SECTIONS.some((s) => s.id === id) ? id : null;
}

const SpatialContext = createContext<SpatialContextValue | null>(null);

export function useSpatial() {
  const ctx = useContext(SpatialContext);
  if (!ctx) throw new Error("useSpatial must be used within SpatialProvider");
  return ctx;
}

// ─── Provider ──────────────────────────────────────────────────

export function SpatialProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<NavDirection>("none");
  const directionRef = useRef<NavDirection>("none");

  const navigateTo = useCallback((section: SectionId) => {
    setActiveSection((prev) => {
      if (section === prev) return prev;

      const prevIdx = sectionOrder.indexOf(prev);
      const nextIdx = sectionOrder.indexOf(section);

      // Compute animation direction
      let dir: NavDirection = "none";
      if (nextIdx > prevIdx) dir = "right";
      else if (nextIdx < prevIdx) dir = "left";
      directionRef.current = dir;
      setDirection(dir);

      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 700);
      return section;
    });
  }, []);

  // Subtle camera transform for desktop spatial feel
  const cameraTransform = (() => {
    const offsets: Record<SectionId, string> = {
      hero:     "perspective(1200px) rotateX(0deg) rotateY(0deg) translateZ(0px)",
      features: "perspective(1200px) rotateX(2deg) rotateY(4deg) translateZ(50px)",
      showcase: "perspective(1200px) rotateX(1deg) rotateY(-3deg) translateZ(40px)",
      pricing:  "perspective(1200px) rotateX(-1deg) rotateY(2deg) translateZ(60px)",
      faq:      "perspective(1200px) rotateX(3deg) rotateY(0deg) translateZ(30px)",
    };
    return offsets[activeSection];
  })();

  // ─── Hash-anchor deep linking ─────────────────────────────────
  // Header nav links (MAIN_NAV_LINKS) point to /#features and /#pricing.
  // On mount with a section hash (or when the hash changes), navigate to
  // that section instead of always starting at hero. This makes the header
  // nav work from any page AND makes section state shareable via URL.
  useEffect(() => {
    const initial = sectionFromHash(window.location.hash);
    if (initial) setActiveSection(initial);

    const onHashChange = () => {
      const next = sectionFromHash(window.location.hash);
      if (next) navigateTo(next);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [navigateTo]);

  // Keep the URL hash in sync with the active section (replaceState, so HUD
  // navigation doesn't spam history entries) — deep links stay valid after
  // in-page navigation.
  useEffect(() => {
    const expected = `#${activeSection}`;
    if (window.location.hash !== expected) {
      window.history.replaceState(null, "", expected);
    }
  }, [activeSection]);

  return (
    <SpatialContext.Provider
      value={{ activeSection, isTransitioning, navigateTo, direction, cameraTransform }}
    >
      {children}
    </SpatialContext.Provider>
  );
}
