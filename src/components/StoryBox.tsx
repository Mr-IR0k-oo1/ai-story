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
        <h1 className="text-lg font-semibold text-white">One Button Story</h1>
        <button
          onClick={onReset}
          className="text-sm text-gray-600 hover:text-gray-300 transition-colors"
        >
          Reset
        </button>
      </div>

      <div
        ref={listRef}
        className="max-h-[60vh] overflow-y-auto space-y-4 scroll-smooth"
      >
        {events.map((ev, i) => {
          const img = sceneImages.find((s) => s.eventIndex === i);
          return (
            <div key={i} className="animate-fade-in-up">
              <p className="text-[15px] leading-relaxed text-gray-200">
                {ev.text}
              </p>
              {ev.type === "twist" && (
                <span className="mt-1 inline-block text-[10px] uppercase tracking-widest text-amber-500/70">
                  * twist
                </span>
              )}
              {img && (
                <img
                  src={img.url}
                  alt=""
                  className="mt-3 w-full rounded-lg border border-gray-800"
                  loading="lazy"
                />
              )}
              {i < events.length - 1 && (
                <hr className="mt-4 border-gray-800/50" />
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="animate-fade-in-up pt-2">
            <LoadingDots />
          </div>
        )}
      </div>

      <div className="mt-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="h-1 flex-1 rounded-full bg-gray-800">
            <div
              className="h-full rounded-full bg-gray-500 transition-all duration-300"
              style={{
                width: `${Math.min((events.length / 20) * 100, 100)}%`,
              }}
            />
          </div>
          <span className="text-xs text-gray-600">
            {events.length}/{20}
          </span>
        </div>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-400">{error}</p>
      )}

      {isEnding ? (
        <div className="py-10 text-center">
          <p className="mb-2 text-2xl font-bold text-white/80 tracking-wide">
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
              className="border border-gray-800 px-6 py-3"
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
            className="w-full border border-gray-800 py-3"
          >
            {isSaving ? "Saving..." : shareUrl ? "Saved" : "Save & Share"}
          </Button>
        </div>
      )}

      {shareUrl && (
        <p className="mt-4 text-center text-xs text-gray-600">
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
            className="ml-2 text-gray-400 hover:text-gray-200 transition-colors"
          >
            [copy]
          </button>
        </p>
      )}
    </div>
  );
}
