"use client";

import { useState } from "react";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setImages([]);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setImages(data.images);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to generate images");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-12 font-mono">
      <div className="w-full max-w-3xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-fuchsia-500 to-pink-500 bg-clip-text text-transparent">
            warhol-but-high
          </h1>
          <p className="text-muted-foreground text-sm">
            generate 3 images from a single prompt, powered by grok
          </p>
        </div>

        <form onSubmit={handleGenerate} className="flex gap-3">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="describe what you want to see..."
            className="flex-1 rounded-lg border border-border bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !prompt.trim()}
            className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                  />
                </svg>
                generating...
              </span>
            ) : (
              "generate"
            )}
          </button>
        </form>

        {error && (
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl border border-border bg-muted animate-pulse"
              />
            ))}
          </div>
        )}

        {images.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {images.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square rounded-xl border border-border overflow-hidden hover:border-primary/50 transition-all"
              >
                <img
                  src={url}
                  alt={`Generated image ${i + 1}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-end justify-center pb-3 opacity-0 group-hover:opacity-100">
                  <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">
                    open full size ↗
                  </span>
                </div>
              </a>
            ))}
          </div>
        )}

        {!loading && images.length === 0 && !error && (
          <div className="text-center py-20 text-muted-foreground text-sm">
            type a prompt and hit generate to create 3 images ✨
          </div>
        )}
      </div>
    </main>
  );
}
