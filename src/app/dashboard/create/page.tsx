"use client";

import { useState } from "react";
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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { STYLE_PRESETS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export default function CreatePage() {
  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    // Simulate generation delay
    await new Promise((r) => setTimeout(r, 2000));
    setGeneratedImage("mock");
    setIsGenerating(false);
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-2xl font-bold text-white sm:text-3xl">
          Create Artwork
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Describe your vision and let AI bring it to life.
        </p>
      </motion.div>

      <div className="mt-8 grid gap-8 lg:grid-cols-5">
        {/* Left: Controls */}
        <motion.div
          className="lg:col-span-2 space-y-6"
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          {/* Prompt input */}
          <Card className="border-zinc-800/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-violet-400" />
                Prompt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <textarea
                placeholder="Describe the anime artwork you want to create..."
                className="min-h-[120px] w-full rounded-lg border border-zinc-700 bg-zinc-800/50 p-3 text-sm text-zinc-100 placeholder:text-zinc-500 resize-none focus:outline-none focus:ring-2 focus:ring-violet-500"
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
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Sliders className="h-4 w-4 text-fuchsia-400" />
                Style
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                      "rounded-lg border p-3 text-left transition-all duration-200",
                      selectedStyle === style.id
                        ? "border-violet-600 bg-violet-600/10 ring-1 ring-violet-500"
                        : "border-zinc-800 bg-zinc-800/30 hover:border-zinc-700",
                    )}
                  >
                    <p className="text-sm font-medium text-white">
                      {style.label}
                    </p>
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {style.description}
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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Image className="h-4 w-4 text-blue-400" />
                Preview
              </CardTitle>
              {generatedImage && (
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon-sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="flex aspect-square items-center justify-center rounded-xl bg-gradient-to-br from-zinc-800/80 to-zinc-900/80">
                {isGenerating ? (
                  <div className="text-center">
                    <Loader2 className="mx-auto h-10 w-10 animate-spin text-violet-400" />
                    <p className="mt-4 text-sm text-zinc-500">
                      Creating your masterpiece...
                    </p>
                  </div>
                ) : generatedImage ? (
                  <div className="text-center">
                    <Image className="mx-auto h-16 w-16 text-emerald-400" />
                    <p className="mt-3 text-sm text-zinc-400 font-medium">
                      Artwork generated!
                    </p>
                    <p className="text-xs text-zinc-600 mt-1">
                      Use the buttons above to save or export
                    </p>
                  </div>
                ) : (
                  <div className="text-center px-8">
                    <Wand2 className="mx-auto h-12 w-12 text-zinc-700" />
                    <p className="mt-4 text-sm text-zinc-500">
                      Enter a prompt and select a style, then hit{" "}
                      <span className="text-violet-400 font-medium">
                        Generate
                      </span>{" "}
                      to see your creation here.
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
                          className="rounded-full border border-zinc-800 bg-zinc-800/30 px-3 py-1 text-xs text-zinc-500 hover:border-zinc-700 hover:text-zinc-300 transition-colors"
                        >
                          {ex}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
