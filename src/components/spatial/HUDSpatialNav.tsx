"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useSpatial, type SectionId } from "@/lib/spatial-store";

const sections: { id: SectionId; label: string; icon: string }[] = [
  { id: "hero",     label: "Home",     icon: "◈" },
  { id: "features", label: "Features", icon: "◇" },
  { id: "showcase", label: "Showcase", icon: "○" },
  { id: "pricing",  label: "Pricing",  icon: "◆" },
  { id: "docs",     label: "About",    icon: "□" },
];

export function HUDSpatialNav() {
  const { activeSection, navigateTo, isTransitioning } = useSpatial();
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(true);

  const playHover = useCallback(() => {
    if (muted) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800 + Math.random() * 400;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch {}
  }, [muted]);

  const playClick = useCallback(() => {
    if (muted) return;
    try {
      if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      osc.type = "square";
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.15);
    } catch {}
  }, [muted]);

  // Cleanup audio context on unmount
  useEffect(() => {
    return () => { audioCtxRef.current?.close(); };
  }, []);

  return (
    <>
      {/* Mute toggle — top right */}
      <button
        onClick={() => setMuted(!muted)}
        className="fixed top-6 right-6 z-[100] h-8 w-8 flex items-center justify-center rounded-sm border border-white/10 bg-black/40 text-white/40 hover:text-white/70 hover:border-white/20 transition-all duration-300 text-xs font-mono"
        aria-label={muted ? "Enable sound" : "Mute sound"}
      >
        {muted ? "🔇" : "🔊"}
      </button>

      {/* HUD Navigation — bottom center, HSR Express Menu style */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]">
        <div className="flex items-center gap-1 px-2 py-1.5 rounded-sm border border-white/10 bg-black/60 backdrop-blur-2xl shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          {sections.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => { if (!isTransitioning && !isActive) { playClick(); navigateTo(sec.id); } }}
                onMouseEnter={playHover}
                disabled={isTransitioning || isActive}
                className={`
                  relative flex flex-col items-center gap-0.5 px-4 py-2
                  transition-all duration-500 ease-out
                  ${isActive
                    ? "text-[#E5C587]"
                    : "text-white/30 hover:text-white/60"
                  }
                  ${isTransitioning ? "pointer-events-none" : ""}
                `}
                style={{ transitionTimingFunction: "cubic-bezier(0.19, 1, 0.22, 1)" }}
              >
                {/* Active diamond indicator */}
                {isActive && (
                  <span className="absolute -top-1 left-1/2 -translate-x-1/2 text-[8px] text-[#E5C587] animate-pulse">
                    ✦
                  </span>
                )}
                <span className="text-lg leading-none font-light">{sec.icon}</span>
                <span className="text-[10px] font-medium tracking-widest uppercase">
                  {sec.label}
                </span>
                {/* Active glow underline */}
                <span
                  className={`
                    absolute -bottom-0.5 left-1/2 -translate-x-1/2 h-[2px] rounded-full
                    transition-all duration-500 ease-out
                    ${isActive ? "w-3/4 bg-gradient-to-r from-transparent via-[#E5C587] to-transparent" : "w-0"}
                  `}
                />
              </button>
            );
          })}
        </div>
      </nav>

      {/* Section indicator — top left HUD */}
      <div className="fixed top-6 left-6 z-[100]">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-sm border border-white/10 bg-black/40 backdrop-blur-xl">
          <span className="text-[10px] font-mono tracking-widest text-white/30">
            SYS.ONLINE
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#2DD4BF] shadow-[0_0_8px_rgba(45,212,191,0.5)] animate-pulse" />
          <span className="text-[10px] font-mono tracking-wider text-white/20">
            {activeSection.toUpperCase()} // {(sections.findIndex(s => s.id === activeSection) + 1).toString().padStart(2, "0")}
          </span>
        </div>
      </div>
    </>
  );
}
