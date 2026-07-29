"use client";

import { useEffect, useRef } from "react";

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let particles: { x: number; y: number; size: number; speed: number; opacity: number; drift: number }[] = [];
    let mouseX = 0;
    let mouseY = 0;
    let devicePixel = 1;

    function resize() {
      if (!canvas) return;
      devicePixel = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * devicePixel;
      canvas.height = window.innerHeight * devicePixel;
      canvas.style.width = window.innerWidth + "px";
      canvas.style.height = window.innerHeight + "px";
      initParticles();
    }

    function initParticles() {
      if (!canvas) return;
      // Cap at 80 particles for performance
      const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas!.width,
        y: Math.random() * canvas!.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.4 + 0.05,
        drift: (Math.random() - 0.5) * 0.2,
      }));
    }

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const scale = devicePixel;

      // Connecting lines (shorter range = more subtle)
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 * scale) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(229, 197, 135, ${0.03 * (1 - dist / (120 * scale))})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        const dx = mouseX * scale - p.x;
        const dy = mouseY * scale - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, 1 - dist / 300) * 0.5;

        const px = p.x + dx * force * 0.02;
        const py = p.y + dy * force * 0.02;

        // Outer glow
        ctx.beginPath();
        ctx.arc(px, py, p.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 197, 135, ${p.opacity * 0.15})`;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(229, 197, 135, ${p.opacity})`;
        ctx.fill();

        // Bright inner
        ctx.beginPath();
        ctx.arc(px, py, p.size * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.5})`;
        ctx.fill();

        p.x += p.speed * 0.3;
        p.y += p.drift * 0.3;

        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;
        if (p.y > canvas.height) p.y = 0;
        if (p.y < 0) p.y = canvas.height;
      }

      animId = requestAnimationFrame(draw);
    }

    const handleMouse = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", handleMouse);
    resize();
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouse);
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none" />;
}
