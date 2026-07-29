"use client";

import { useCallback, useRef, useEffect, useState } from "react";
import { useSpatial, SECTIONS, type SectionId } from "@/lib/spatial-store";
import { useIsMobile } from "@/lib/use-mobile";
import { audioSynth } from "./AudioSynth";

// ─── Simple FPS counter (mock) ─────────────────────────────────

function useFpsMock() {
  const [fps] = useState(() => Math.floor(55 + Math.random() * 10));
  return fps;
}

// ─── HUD Frame Corner Decorations ──────────────────────────────

function HUDCorner({ position }: { position: "tl" | "tr" | "bl" | "br" }) {
  const posStyles: Record<string, string> = {
    tl: "top-0 left-0 border-t-2 border-l-2",
    tr: "top-0 right-0 border-t-2 border-r-2",
    bl: "bottom-0 left-0 border-b-2 border-l-2",
    br: "bottom-0 right-0 border-b-2 border-r-2",
  };
  return (
    <div
      className={`fixed z-30 pointer-events-none w-6 h-6 md:w-8 md:h-8 ${posStyles[position]} border-[rgba(229,197,135,0.12)]`}
    />
  );
}

// ─── Coordinate Ticker ─────────────────────────────────────────

function CoordTicker() {
  const { activeSection } = useSpatial();
  const idx = SECTIONS.findIndex((s) => s.id === activeSection);
  // Animate coord on section change
  return (
    <span className="text-[9px] font-mono tracking-widest text-white/15 hidden md:inline">
      POS: [X:{(idx * 104 + 200).toString().padStart(3, "0")} Y:{(idx * 88 + 150).toString().padStart(3, "0")}]
    </span>
  );
}

// ─── Section Progress Dots ─────────────────────────────────────

function SectionProgress() {
  const { activeSection } = useSpatial();
  return (
    <div className="hidden md:flex items-center gap-1">
      {SECTIONS.map((s) => (
        <span
          key={s.id}
          className={`w-1 h-1 rounded-full transition-all duration-500 ${
            s.id === activeSection
              ? "bg-[#E5C587] shadow-[0_0_6px_rgba(229,197,135,0.5)] w-3"
              : "bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Main HSR Navbar ───────────────────────────────────────────

export function HSRNavbar() {
  const { activeSection, navigateTo, isTransitioning } = useSpatial();
  const isMobile = useIsMobile();
  const fps = useFpsMock();
  const audioInited = useRef(false);
  const [muted, setMuted] = useState(true);
  const navRef = useRef<HTMLDivElement>(null);

  // Init audio context on first user interaction
  const ensureAudio = useCallback(() => {
    if (!audioInited.current) {
      audioInited.current = true;
      audioSynth.unmute();
      setMuted(false);
    }
  }, []);

  const handleNavClick = useCallback(
    (id: SectionId) => {
      ensureAudio();
      if (!isTransitioning && id !== activeSection) {
        audioSynth.click();
        navigateTo(id);
      }
    },
    [activeSection, isTransitioning, navigateTo, ensureAudio]
  );

  const handleHover = useCallback(() => {
    if (!muted || audioInited.current) audioSynth.hover();
  }, [muted]);

  const toggleMute = useCallback(() => {
    const nowMuted = audioSynth.toggle();
    setMuted(nowMuted);
    audioInited.current = true;
    if (!nowMuted) audioSynth.confirm();
  }, []);

  // Cleanup
  useEffect(() => {
    return () => audioSynth.dispose();
  }, []);

  return (
    <>
      {/* ─── HUD Corner Brackets ─────────────────────────────── */}
      <HUDCorner position="tl" />
      <HUDCorner position="tr" />
      <HUDCorner position="bl" />
      <HUDCorner position="br" />

      {/* ─── Top-Left: System Status ─────────────────────────── */}
      <div className="fixed top-3 left-3 md:top-5 md:left-5 z-50 flex items-center gap-2 md:gap-3">
        <div className="flex items-center gap-1.5 md:gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-sm border border-white/[0.06] bg-black/50 backdrop-blur-xl">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shadow-[0_0_8px_rgba(45,212,191,0.5)] animate-pulse" />
          <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-white/30">
            SYS.ONLINE
          </span>
          <span className="hidden sm:inline text-[9px] md:text-[10px] font-mono tracking-wider text-white/15">
            // {fps} FPS
          </span>
          <CoordTicker />
        </div>
      </div>

      {/* ─── Top-Right: Mute + Section Tag ───────────────────── */}
      <div className="fixed top-3 right-3 md:top-5 md:right-5 z-50 flex items-center gap-2 md:gap-3">
        <div className="hidden md:flex items-center gap-2 px-2 py-1 md:px-3 md:py-1.5 rounded-sm border border-white/[0.06] bg-black/50 backdrop-blur-xl">
          <span className="text-[9px] font-mono tracking-widest text-white/20">
            {activeSection.toUpperCase()} // {(SECTIONS.findIndex((s) => s.id === activeSection) + 1).toString().padStart(2, "0")}
          </span>
          <SectionProgress />
        </div>
        <button
          onClick={toggleMute}
          className="h-7 w-7 md:h-8 md:w-8 flex items-center justify-center rounded-sm border border-white/10 bg-black/50 backdrop-blur-xl text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-300 text-[10px] md:text-xs font-mono"
          aria-label={muted ? "Enable sound" : "Mute sound"}
        >
          {muted ? "🔇" : "🔊"}
        </button>
      </div>

      {/* ─── Desktop: HSR Express Menu (bottom-center) ───────── */}
      {!isMobile && (
        <nav
          ref={navRef}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-0.5 md:gap-1 px-1.5 md:px-2 py-1 md:py-1.5 rounded-sm border border-white/[0.08] bg-black/60 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,0,0,0.6)]">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleNavClick(sec.id)}
                  onMouseEnter={handleHover}
                  disabled={isTransitioning}
                  className={`
                    relative flex flex-col items-center gap-0.5
                    px-3 md:px-5 py-2 md:py-2.5 min-w-[56px] md:min-w-[72px]
                    transition-all duration-500
                    ${isActive ? "text-[#E5C587]" : "text-white/25 hover:text-white/50"}
                    ${isTransitioning ? "pointer-events-none" : ""}
                    group
                  `}
                  style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}
                >
                  {/* Active diamond */}
                  {isActive && (
                    <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] md:text-[9px] text-[#E5C587] animate-pulse">
                      ✦
                    </span>
                  )}
                  <span className="text-base md:text-lg leading-none font-light">{sec.icon}</span>
                  <span className="text-[8px] md:text-[10px] font-medium tracking-widest uppercase">
                    {sec.label}
                  </span>
                  {/* Active glow bar */}
                  <span
                    className={`
                      absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full
                      transition-all duration-500
                      ${isActive ? "w-3/4 bg-gradient-to-r from-transparent via-[#E5C587] to-transparent" : "w-0"}
                    `}
                  />
                  {/* Subtle border on hover */}
                  <span className="absolute inset-0 rounded-sm border border-transparent group-hover:border-white/[0.04] transition-all duration-300 pointer-events-none" />
                </button>
              );
            })}
          </div>
        </nav>
      )}

      {/* ─── Mobile: Sticky Bottom Tab Bar ───────────────────── */}
      {isMobile && (
        <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.06] bg-black/80 backdrop-blur-2xl">
          <div className="flex items-center justify-around px-1 pb-[env(safe-area-inset-bottom,0px)]">
            {SECTIONS.map((sec) => {
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => handleNavClick(sec.id)}
                  onMouseEnter={handleHover}
                  disabled={isTransitioning}
                  className={`
                    relative flex flex-col items-center gap-0.5
                    py-2 px-2 flex-1
                    transition-all duration-300 min-h-[52px] min-w-[52px]
                    ${isActive ? "text-[#E5C587]" : "text-white/25"}
                    ${isTransitioning ? "pointer-events-none" : ""}
                  `}
                >
                  {isActive && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2px] rounded-full bg-[#E5C587]" />
                  )}
                  <span className={`text-lg leading-none ${isActive ? "drop-shadow-[0_0_8px_rgba(229,197,135,0.5)]" : ""}`}>
                    {sec.icon}
                  </span>
                  <span className={`text-[8px] font-medium tracking-widest uppercase ${isActive ? "opacity-100" : "opacity-50"}`}>
                    {sec.label}
                  </span>
                </button>
              );
            })}
          </div>
        </nav>
      )}
    </>
  );
}
