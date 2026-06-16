"use client";

import { useRef, useEffect } from "react";
import { Button } from "./ui/Button";
import { LoadingDots } from "./ui/LoadingDots";
import type { SceneImage } from "@/lib/types";

interface StoryEvent {
  text: string;
  type: string | null;
}

interface StoryBoxProps {
  events: StoryEvent[];
  sceneImages: SceneImage[];
  isLoading: boolean;
  error: string | null;
  shareUrl: string | null;
  isSaving: boolean;
  isEnding: boolean;
  onContinue: () => void;
  onTwist: () => void;
  onReset: () => void;
  onSave: () => void;
}

export function StoryBox({
  events,
  sceneImages,
  isLoading,
  error,
  shareUrl,
  isSaving,
  isEnding,
  onContinue,
  onTwist,
  onReset,
  onSave,
}: StoryBoxProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [events.length]);

  return (
    <div className="mx-auto max-w-lg px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold tracking-tight text-white">
          One Button Story
        </h1>
        <button
          onClick={onReset}
          className="text-xs text-gray-600 transition-colors hover:text-gray-400"
        >
          Reset
        </button>
      </div>

      <div
        ref={listRef}
        className="max-h-[60vh] overflow-y-auto rounded-xl border border-border bg-card scroll-smooth"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#1e1e29 transparent" }}
      >
        <div className="space-y-0">
          {events.map((ev, i) => {
            const img = sceneImages.find((s) => s.eventIndex === i);
            const isLast = i === events.length - 1;
            return (
              <div
                key={i}
                className={`animate-fade-in-up border-b border-border/50 last:border-0 ${isLast ? "" : ""}`}
              >
                <div className="px-5 py-4">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 shrink-0 text-[10px] font-medium text-gray-600 w-5 text-right">
                      {i + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm leading-relaxed text-gray-300">
                        {ev.text}
                      </p>
                      {ev.type === "twist" && (
                        <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-medium uppercase tracking-widest text-accent">
                          <span className="inline-block w-1 h-1 rounded-full bg-accent/60" />
                          Twist
                        </span>
                      )}
                    </div>
                  </div>
                  {img && (
                    <img
                      src={img.url}
                      alt=""
                      className="mt-3 ml-8 w-full rounded-lg border border-border"
                      loading="lazy"
                    />
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="shrink-0 text-[10px] font-medium text-gray-600 w-5 text-right">
                  {events.length + 1}
                </span>
                <LoadingDots />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-1 flex-1 rounded-full bg-border">
            <div
              className="h-full rounded-full bg-accent/70 transition-all duration-500 ease-out"
              style={{
                width: `${Math.min((events.length / 20) * 100, 100)}%`,
              }}
            />
          </div>
          <span className="text-xs tabular-nums text-gray-600">
            {events.length}/20
          </span>
        </div>
      </div>

      {error && (
        <p className="mb-4 animate-fade-in text-center text-sm text-red-400">
          {error}
        </p>
      )}

      {isEnding ? (
        <div className="py-10 text-center">
          <p className="mb-2 font-display text-3xl font-bold tracking-wide text-white/90">
            THE END
          </p>
          <p className="mb-6 text-sm text-gray-600">
            {events.length} events
            {sceneImages.length > 0 && ` \u00b7 ${sceneImages.length} scenes`}
          </p>
          <div className="flex justify-center gap-3">
            <Button
              variant="primary"
              onClick={onReset}
              className="px-8 py-3"
            >
              Play Again
            </Button>
            <Button
              variant="ghost"
              onClick={onSave}
              disabled={isSaving || !!shareUrl}
              className="border border-border px-6 py-3"
            >
              {isSaving ? "Saving..." : shareUrl ? "Saved" : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex gap-3">
            <Button
              variant="primary"
              onClick={onContinue}
              disabled={isLoading}
              className="flex-1 py-3"
            >
              {isLoading ? "..." : "Continue"}
            </Button>
            <Button
              variant="secondary"
              onClick={onTwist}
              disabled={isLoading}
              className="flex-1 py-3"
            >
              {isLoading ? "..." : "Twist"}
            </Button>
          </div>

          <Button
            variant="ghost"
            onClick={onSave}
            disabled={isSaving || !!shareUrl}
            className="w-full border border-border py-3"
          >
            {isSaving ? "Saving..." : shareUrl ? "Saved" : "Save & Share"}
          </Button>
        </div>
      )}

      {shareUrl && (
        <p className="mt-4 animate-fade-in text-center text-xs text-gray-600">
          {typeof window !== "undefined" &&
            `${window.location.origin}${shareUrl}`}
          <button
            onClick={() =>
              navigator.clipboard.writeText(
                typeof window !== "undefined"
                  ? `${window.location.origin}${shareUrl}`
                  : shareUrl
              )
            }
            className="ml-2 text-accent/70 transition-colors hover:text-accent"
          >
            [copy]
          </button>
        </p>
      )}
    </div>
  );
}
