"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Wand2,
  Sparkles,
  Image,
  Sliders,
  RefreshCw,
  Download,
  Save,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { STYLE_PRESETS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";

const TOKEN_KEY = "aniverse_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/** Map our style IDs to Pollinations prompt prefixes */
const STYLE_PROMPTS: Record<string, string> = {
  "anime-classic": "classic cel-shaded anime style, ",
  "anime-modern": "modern clean high-detail anime aesthetic, ",
  watercolor: "soft watercolor painted style, ",
  cyberpunk: "cyberpunk neon-drenched futuristic, ",
  ghibli: "Studio Ghibli inspired, warm whimsical, ",
  "ghibli-background":
    "lush detailed Ghibli-style landscape background, ",
  "ghibli-character":
    "classic Miyazaki-era Ghibli character design, ",
  "retro-90s": "vibrant cel-shaded 1990s anime revival, ",
  "vhs-anime": "grainy VHS tape look with scanlines, ",
  chibi: "cute chibi style, proportionally exaggerated, ",
  "pixel-anime": "pixel-art fusion with anime-style, ",
  vaporwave:
    "vaporwave retro-futuristic neon, purple and pink hues, glitch, ",
  "dusty-pastel":
    "dusty pastel muted warm fantasy tones, soft lavender, ",
  caricature:
    "exaggerated playful caricature style, bold features, ",
  "sepia-nostalgia":
    "warm sepia-toned vintage anime, film grain, ",
  "pastel-goth":
    "pastel goth, dark romance with soft pastels, muted charcoals, blush pink, ",
};

/** Build the Pollinations image URL */
function buildPollinationsUrl(
  prompt: string,
  styleId: string | null,
  width: number,
  height: number,
): string {
  const stylePrefix = styleId ? STYLE_PROMPTS[styleId] || "" : "";
  const fullPrompt = encodeURIComponent(
    `${stylePrefix}${prompt}, anime artwork, high quality, detailed`.trim(),
  );
  const seed = Math.floor(Math.random() * 100000);
  return `https://image.pollinations.ai/prompt/${fullPrompt}?width=${width}&height=${height}&seed=${seed}&nologo=true`;
}

type SaveState = "idle" | "saving" | "saved" | "error";

export default function CreatePage() {
  const { user } = useAuth();
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 1024,
    height: 1024,
  });
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [saveError, setSaveError] = useState("");
  const [generatedTitle, setGeneratedTitle] = useState("");

  const selectedPreset = selectedStyle
    ? STYLE_PRESETS.find((s) => s.id === selectedStyle)
    : null;

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGeneratedImage(null);
    setSaveState("idle");
    setSaveError("");

    // Generate a title from the prompt (first few words)
    const words = prompt.trim().split(/\s+/);
    const title =
      words.length <= 4
        ? words
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ")
        : words
            .slice(0, 4)
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
            .join(" ") + "...";
    setGeneratedTitle(title);

    const imageUrl = buildPollinationsUrl(
      prompt,
      selectedStyle,
      imageDimensions.width,
      imageDimensions.height,
    );

    // Preload the image so we know it works
    const img = new window.Image();
    img.onload = () => {
      setGeneratedImage(imageUrl);
      setIsGenerating(false);
      setImageDimensions({
        width: img.naturalWidth,
        height: img.naturalHeight,
      });
    };
    img.onerror = () => {
      // Even on "error", the image might render - try anyway
      setGeneratedImage(imageUrl);
      setIsGenerating(false);
    };
    img.src = imageUrl;
  }, [prompt, selectedStyle, imageDimensions.width, imageDimensions.height]);

  const handleSave = useCallback(async () => {
    if (!generatedImage || !generatedTitle) return;
    setSaveState("saving");
    setSaveError("");

    const token = getToken();
    if (!token) {
      setSaveState("error");
      setSaveError("You must be logged in to save artworks.");
      return;
    }

    try {
      const res = await fetch("/api/artworks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: generatedTitle,
          prompt: prompt.trim(),
          style: selectedStyle || "ANIME",
          imageUrl: generatedImage,
          width: imageDimensions.width,
          height: imageDimensions.height,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.errors?.title || data.errors?.imageUrl || "Failed to save",
        );
      }

      setSaveState("saved");
    } catch (err) {
      setSaveState("error");
      setSaveError(
        err instanceof Error ? err.message : "Failed to save artwork",
      );
    }
  }, [generatedImage, generatedTitle, prompt, selectedStyle, imageDimensions]);

  const handleDownload = useCallback(() => {
    if (!generatedImage) return;
    // Open in a new tab for download
    const a = document.createElement("a");
    a.href = generatedImage;
    a.download = `${generatedTitle || "aniverse-artwork"}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [generatedImage, generatedTitle]);

  const handleReset = useCallback(() => {
    setGeneratedImage(null);
    setSaveState("idle");
    setSaveError("");
  }, []);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-xl font-bold text-white sm:text-2xl lg:text-3xl">
          Create Artwork
        </h1>
        <p className="mt-0.5 text-sm text-zinc-400">
          Describe your vision and let Pollinations AI bring it to life.
        </p>
      </motion.div>

      <div className="mt-6 sm:mt-8 grid gap-6 sm:gap-8 lg:grid-cols-5">
        {/* Left: Controls */}
        <motion.div
          className="lg:col-span-2 space-y-4 sm:space-y-6"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* Prompt input */}
          <Card className="border-zinc-800/60">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-violet-400" />
                Prompt
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <textarea
                placeholder="Describe the anime artwork you want to create..."
                className="min-h-[100px] sm:min-h-[120px] w-full rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs text-zinc-600">
                  {prompt.length} characters
                </span>
                <Badge variant="secondary" className="text-xs">
                  1 generation credit
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Style presets */}
          <Card className="border-zinc-800/60">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Sliders className="h-4 w-4 text-fuchsia-400" />
                Style
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="grid grid-cols-2 gap-2">
                {STYLE_PRESETS.map((style) => (
                  <button
                    key={style.id}
                    onClick={() =>
                      setSelectedStyle(
                        selectedStyle === style.id ? null : style.id,
                      )
                    }
                    className={cn(
                      "rounded-lg border p-3 sm:p-3 text-left transition-all duration-200",
                      selectedStyle === style.id
                        ? "border-violet-600 bg-violet-600/10 ring-1 ring-violet-500"
                        : "border-zinc-800 bg-zinc-800/30 hover:border-zinc-700",
                    )}
                  >
                    <p className="text-xs sm:text-sm font-medium text-white">
                      {style.label}
                    </p>
                    <p className="mt-0.5 text-[11px] sm:text-xs text-zinc-500">
                      {style.description}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resolution selector */}
          <Card className="border-zinc-800/60">
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Image className="h-4 w-4 text-blue-400" />
                Resolution
              </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "512×512", w: 512, h: 512 },
                  { label: "1024×1024", w: 1024, h: 1024 },
                  { label: "HD 1920×1080", w: 1920, h: 1080 },
                ].map((res) => (
                  <button
                    key={res.label}
                    onClick={() =>
                      setImageDimensions({ width: res.w, height: res.h })
                    }
                    className={cn(
                      "rounded-lg border p-2 text-center transition-all",
                      imageDimensions.width === res.w &&
                        imageDimensions.height === res.h
                        ? "border-violet-600 bg-violet-600/10 ring-1 ring-violet-500"
                        : "border-zinc-800 bg-zinc-800/30 hover:border-zinc-700",
                    )}
                  >
                    <p className="text-xs font-medium text-white">
                      {res.label}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Generate button */}
          <Button
            className="w-full gap-2 shadow-xl shadow-violet-600/20"
            size="lg"
            disabled={!prompt.trim() || isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate Artwork
              </>
            )}
          </Button>
        </motion.div>

        {/* Right: Preview */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <Card className="border-zinc-800/60 h-full">
            <CardHeader className="flex flex-row items-center justify-between p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                <Image className="h-4 w-4 text-blue-400" />
                Preview
              </CardTitle>
              {generatedImage && (
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleDownload}
                    title="Download image"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  {saveState !== "saved" && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={handleSave}
                      disabled={saveState === "saving"}
                      title="Save to gallery"
                    >
                      {saveState === "saving" ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={handleReset}
                    title="Reset"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="px-4 pb-4 sm:px-6 sm:pb-6">
              {saveState === "saved" && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/10 p-3 text-sm text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>Saved to your gallery!</span>
                </div>
              )}
              {saveState === "error" && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400">
                  <XCircle className="h-4 w-4 shrink-0" />
                  <span>{saveError || "Failed to save artwork"}</span>
                </div>
              )}

              <div className="flex aspect-square sm:aspect-[4/3] items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80 overflow-hidden">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-violet-400" />
                    <p className="mt-4 text-sm text-zinc-500">
                      Pollinations AI is creating your masterpiece...
                    </p>
                  </div>
                ) : generatedImage ? (
                  <div className="relative w-full h-full group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={generatedImage}
                      alt={generatedTitle || "Generated artwork"}
                      className="w-full h-full object-contain rounded-xl"
                    />
                    {/* Prompt overlay on hover */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-b-xl">
                      <p className="text-xs text-zinc-300 truncate">
                        {selectedPreset && (
                          <span className="text-violet-400 font-medium">
                            {selectedPreset.label}
                            {" — "}
                          </span>
                        )}
                        {prompt}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center px-8">
                    <Wand2 className="mx-auto h-12 w-12 text-zinc-700" />
                    <p className="mt-4 text-sm text-zinc-500">
                      Enter a prompt and select a style, then hit{" "}
                      <span className="text-violet-400 font-medium">
                        Generate
                      </span>{" "}
                      to create your AI artwork using Pollinations.
                    </p>
                    <div className="mt-6 flex flex-wrap justify-center gap-2">
                      {[
                        "samurai neon city",
                        "magical girl forest",
                        "cyberpunk catgirl",
                        "ghibli landscape",
                      ].map((ex) => (
                        <button
                          key={ex}
                          onClick={() => setPrompt(ex)}
                          className="rounded-full border border-zinc-800 bg-zinc-800/30 px-3 py-1.5 text-xs text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-colors"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Save button below preview (desktop fallback) */}
              {generatedImage && saveState !== "saved" && (
                <div className="mt-4 hidden sm:block">
                  <Button
                    className="w-full gap-2"
                    onClick={handleSave}
                    disabled={saveState === "saving"}
                  >
                    {saveState === "saving" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Save to My Gallery
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
