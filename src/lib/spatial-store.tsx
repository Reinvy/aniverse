"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

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
  const directionRef = useRef<NavDirection>("none");

  const navigateTo = useCallback((section: SectionId) => {
    setActiveSection((prev) => {
      if (section === prev) return prev;

      const prevIdx = sectionOrder.indexOf(prev);
      const nextIdx = sectionOrder.indexOf(section);

      // Compute animation direction
      if (nextIdx > prevIdx) directionRef.current = "right";
      else if (nextIdx < prevIdx) directionRef.current = "left";
      else directionRef.current = "none";

      setIsTransitioning(true);
      setTimeout(() => setIsTransitioning(false), 700);
      return section;
    });
  }, []);

  const direction = directionRef.current;

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

  return (
    <SpatialContext.Provider
      value={{ activeSection, isTransitioning, navigateTo, direction, cameraTransform }}
    >
      {children}
    </SpatialContext.Provider>
  );
}
