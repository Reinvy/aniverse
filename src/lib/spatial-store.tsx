"use client";

import React, { createContext, useContext, useState, useCallback, useRef } from "react";

export type SectionId = "hero" | "features" | "showcase" | "pricing" | "docs";

interface SpatialContextValue {
  activeSection: SectionId;
  previousSection: SectionId | null;
  isTransitioning: boolean;
  navigateTo: (section: SectionId) => void;
  cameraStyle: React.CSSProperties;
  sectionRefs: React.MutableRefObject<Map<SectionId, HTMLDivElement | null>>;
}

const sectionPositions: Record<SectionId, { x: number; y: number; scale: number; rotateX: number; rotateY: number }> = {
  hero:     { x: 0, y: 0, scale: 1,     rotateX: 0,   rotateY: 0 },
  features: { x: -120, y: 0, scale: 0.85, rotateX: 0,  rotateY: 8 },
  showcase: { x: 120, y: 0, scale: 0.85,  rotateX: 0,  rotateY: -8 },
  pricing:  { x: 0, y: -80, scale: 0.8,  rotateX: 6,  rotateY: 0 },
  docs:     { x: 0, y: 80, scale: 0.8,   rotateX: -6, rotateY: 0 },
};

const SpatialContext = createContext<SpatialContextValue | null>(null);

export function useSpatial() {
  const ctx = useContext(SpatialContext);
  if (!ctx) throw new Error("useSpatial must be used within SpatialCanvas");
  return ctx;
}

export function SpatialProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState<SectionId>("hero");
  const [previousSection, setPreviousSection] = useState<SectionId | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const sectionRefs = useRef(new Map<SectionId, HTMLDivElement | null>());

  const navigateTo = useCallback((section: SectionId) => {
    if (section === activeSection || isTransitioning) return;
    setPreviousSection(activeSection);
    setIsTransitioning(true);
    setActiveSection(section);
    setTimeout(() => setIsTransitioning(false), 800);
  }, [activeSection, isTransitioning]);

  const pos = sectionPositions[activeSection];
  const cameraStyle: React.CSSProperties = {
    transform: `translate3d(${pos.x}px, ${pos.y}px, 0) scale(${pos.scale}) rotateX(${pos.rotateX}deg) rotateY(${pos.rotateY}deg)`,
    transition: "transform 0.8s cubic-bezier(0.19, 1, 0.22, 1)",
    transformStyle: "preserve-3d",
    perspective: "1200px",
    minHeight: "100vh",
    width: "100%",
  };

  return (
    <SpatialContext.Provider value={{ activeSection, previousSection, isTransitioning, navigateTo, cameraStyle, sectionRefs }}>
      {children}
    </SpatialContext.Provider>
  );
}

export { sectionPositions };
