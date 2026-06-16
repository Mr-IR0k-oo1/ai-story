"use client";

import { useState, useCallback } from "react";
import { SetupForm } from "@/components/SetupForm";
import { StoryBox } from "@/components/StoryBox";
import {
  SCENE_INTERVAL,
  type WorldState,
  type StoryMode,
  type SceneImage,
  type EventType,
} from "@/lib/types";

interface StoryEvent {
  text: string;
  type: EventType | null;
}

interface ClientState {
  events: StoryEvent[];
  world: WorldState;
  summary: string;
  sceneImages: SceneImage[];
  isEnding: boolean;
}

const DEFAULT_WORLD: WorldState = {
  character: "Goat accountant",
  goal: "Deliver taxes",
  conflict: "Dragon stole calculator",
  location: "a mysterious cave",
  objects: [],
};

export default function Home() {
  const [setup, setSetup] = useState({
    character: DEFAULT_WORLD.character,
    goal: DEFAULT_WORLD.goal,
    problem: DEFAULT_WORLD.conflict,
  });
  const [story, setStory] = useState<ClientState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);


  const handleStart = useCallback(
    (formData: { character: string; goal: string; problem: string }) => {
      const { character, goal, problem } = formData;

      setSetup({ character, goal, problem });
      setStory({
        events: [{ text: "You wake up in a mysterious cave.", type: null }],
        world: {
          character,
          goal,
          conflict: problem,
          location: "a mysterious cave",
          objects: [],
        },
        summary: "",
        sceneImages: [],
        isEnding: false,
      });
      setShareUrl(null);
      setError(null);
    },
    []
  );

  const generateEvent = useCallback(
    async (mode: StoryMode) => {
      if (!story || story.isEnding) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/continue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            setup,
            events: story.events.map((e) => e.text),
            world: story.world,
            summary: story.summary,
            mode,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || `Request failed (${res.status})`);
        }

        const newEvent: StoryEvent = {
          text: data.text,
          type: data.eventType ?? null,
        };
        const newEvents = [...story.events, newEvent];
        const nextTurnCount = newEvents.length;

        if (nextTurnCount > 0 && nextTurnCount % SCENE_INTERVAL === 0) {
          const eventIndex = nextTurnCount - 1;

          fetch("/api/scene", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              events: newEvents.map((e) => e.text),
              world: data.state?.world ?? story.world,
            }),
          })
            .then((r) => r.json())
            .then((sceneData) => {
              if (sceneData.imageUrl) {
                setStory((prev) => {
                  if (!prev) return prev;
                  return {
                    ...prev,
                    sceneImages: [
                      ...prev.sceneImages,
                      { eventIndex, url: sceneData.imageUrl },
                    ],
                  };
                });
              }
            })
            .catch(() => {});
        }

        setStory((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            events: newEvents,
            world: data.state?.world ?? prev.world,
            summary: data.state?.summary ?? prev.summary,
            isEnding: data.isEnding === true,
          };
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [story, setup]
  );

  const saveStory = useCallback(async () => {
    if (!story || isSaving) return;

    setIsSaving(true);

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          events: story.events.map((e) => e.text),
          world: story.world,
          summary: story.summary,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Save failed");
      }

      setShareUrl(data.url);
    } catch {
      const text = story.events.map((e) => e.text).join("\n\n");
      try {
        await navigator.clipboard.writeText(text);
        setError("Story copied to clipboard (save unavailable in this deployment)");
      } catch {
        setError("Could not save or copy story");
      }
    } finally {
      setIsSaving(false);
    }
  }, [story, isSaving]);

  const reset = useCallback(() => {
    setStory(null);
      setShareUrl(null);
      setError(null);
      setIsLoading(false);
  }, []);

  if (!story) {
    return <SetupForm onSubmit={handleStart} />;
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <StoryBox
        events={story.events}
        sceneImages={story.sceneImages}
        isLoading={isLoading}
        error={error}
        shareUrl={shareUrl}
        isSaving={isSaving}
        isEnding={story.isEnding}
        onContinue={() => generateEvent("continue")}
        onTwist={() => generateEvent("twist")}
        onReset={reset}
        onSave={saveStory}
      />
    </div>
  );
}
