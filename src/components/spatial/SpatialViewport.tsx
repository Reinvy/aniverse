"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useSpatial, type SectionId } from "@/lib/spatial-store";
import { useIsMobile } from "@/lib/use-mobile";
import { SectionComponents } from "./SpatialCanvasContent";
import { ParticleBackground } from "./ParticleBackground";
import { HSRNavbar } from "./HSRNavbar";

// ─── Shared easing ─────────────────────────────────────────────

const EASE_PREMIUM: [number, number, number, number] = [0.19, 1, 0.22, 1];

// ─── Direction-aware slide variants for AnimatePresence ────────

function getVariants(direction: string, isMobile: boolean) {
  if (isMobile) {
    // Mobile: simple fade + vertical slide
    return {
      initial: { opacity: 0, y: 16 },
      animate: { opacity: 1, y: 0 },
      exit: { opacity: 0, y: -8 },
    };
  }

  // Desktop: camera-perspective spatial transition
  const x = direction === "right" ? 60 : direction === "left" ? -60 : 0;
  return {
    initial: {
      opacity: 0,
      x,
      scale: 0.97,
      rotateY: direction === "right" ? -5 : direction === "left" ? 5 : 0,
      filter: "blur(4px)",
    },
    animate: {
      opacity: 1,
      x: 0,
      scale: 1,
      rotateY: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.6,
        ease: EASE_PREMIUM,
      },
    },
    exit: {
      opacity: 0,
      x: direction === "right" ? -30 : direction === "left" ? 30 : 0,
      scale: 0.95,
      filter: "blur(2px)",
      transition: {
        duration: 0.3,
        ease: EASE_PREMIUM,
      },
    },
  };
}

// ─── Fallback Gradient (if canvas fails) ───────────────────────

function FallbackBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B0D17] via-[#121526] to-[#0f141f]" />
      <div className="absolute inset-0 bg-starfield opacity-30" />
      <div className="scanline absolute inset-0 opacity-20" />
    </div>
  );
}

// ─── Grid Overlay ──────────────────────────────────────────────

function GridOverlay() {
  return (
    <div className="fixed inset-0 z-[1] pointer-events-none">
      <div className="absolute inset-0 bg-grid opacity-[0.02]" />
      <div className="scanline absolute inset-0 opacity-[0.03]" />
    </div>
  );
}

// ─── Main Viewport ─────────────────────────────────────────────

export function SpatialViewport() {
  const { activeSection, direction } = useSpatial();
  const isMobile = useIsMobile();

  const ActiveComponent = SectionComponents[activeSection];
  const variants = getVariants(direction, isMobile ?? false);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#05080F]">
      {/* Background layers */}
      <ParticleBackground />
      <FallbackBackground />
      <GridOverlay />

      {/* Camera perspective layer (desktop only) */}
      <div
        className={`absolute inset-0 z-10 ${isMobile ? "" : "perspective-1200"}`}
        style={
          !isMobile
            ? {
                perspective: "1200px",
                transformStyle: "preserve-3d",
              }
            : undefined
        }
      >
        {/* Scrollable content area on mobile */}
        <div
          className={`absolute inset-0 flex items-center justify-center ${
            isMobile ? "bottom-[72px] top-0 overflow-y-auto pb-4" : ""
          }`}
          style={
            isMobile
              ? { WebkitOverflowScrolling: "touch" }
              : undefined
          }
        >
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeSection}
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full"
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              {ActiveComponent && <ActiveComponent />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* HUD Nav always on top */}
      <div className="relative z-50">
        <HSRNavbar />
      </div>
    </div>
  );
}
