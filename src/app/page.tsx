"use client";

import { useState, useEffect, useCallback } from "react";
import { createWorld } from "@/lib/createWorld";
import dynamic from "next/dynamic";

const WorldView = dynamic(() => import("@/components/WorldView").then((m) => m.WorldView), {
  ssr: false,
  loading: () => (
    <div className="aspect-video rounded-xl border border-border bg-card flex items-center justify-center">
      <p className="text-xs text-gray-600">Loading world...</p>
    </div>
  ),
});
import { StoryFeed } from "@/components/StoryFeed";
import { CharacterCard } from "@/components/CharacterCard";
import { LocationCard } from "@/components/LocationCard";
import { InventoryCard } from "@/components/InventoryCard";
import { ActionBar } from "@/components/ActionBar";
import { DailyEvent } from "@/components/DailyEvent";
import { MemoryBook } from "@/components/MemoryBook";
import { Achievements } from "@/components/Achievements";
import type { WorldState } from "@/types/world";

const STORAGE_KEY = "one-button-story-world";

function loadWorld(): WorldState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as WorldState;
  } catch {
    return null;
  }
}

function saveWorld(world: WorldState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(world));
  } catch {}
}

function todayStr(): string {
  return new Date().toISOString().split("T")[0];
}

export default function Home() {
  const [world, setWorld] = useState<WorldState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // Daily event state
  const [dailyPhase, setDailyPhase] = useState<"idle" | "event" | "loading" | "result">("idle");
  const [dailyEvent, setDailyEvent] = useState<{ title: string; description: string; choices: string[] } | null>(null);
  const [dailyConsequence, setDailyConsequence] = useState<string | null>(null);
  const [dailyItem, setDailyItem] = useState<string | null>(null);
  const [dailyError, setDailyError] = useState<string | null>(null);

  // Panels
  const [showMemories, setShowMemories] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = loadWorld();
    const w = saved ?? createWorld();
    setWorld(w);

    // Check for daily event
    const today = todayStr();
    if (!w.dailyEvent || w.dailyEvent.date !== today) {
      fetchDailyEvent(w);
    }
  }, []);

  useEffect(() => {
    if (mounted && world) saveWorld(world);
  }, [world, mounted]);

  const buildDailyContext = useCallback((w: WorldState): string => {
    return [
      `Player: ${w.player.name} (${w.player.profession})`,
      `Location: ${w.location.name} — ${w.location.description}`,
      `Inventory: ${w.inventory.join(", ") || "none"}`,
      `Events seen: ${w.stats.eventsSeen}`,
      w.memories.length > 0 ? `Recent memories: ${w.memories.slice(-2).map((m) => m.text).join(" | ")}` : "",
    ].filter(Boolean).join("\n");
  }, []);

  const fetchDailyEvent = useCallback(async (w: WorldState) => {
    setDailyPhase("loading");
    try {
      const context = buildDailyContext(w);
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ context }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setDailyEvent({ title: data.title, description: data.description, choices: data.choices });
      setDailyPhase("event");
    } catch (err) {
      setDailyError(err instanceof Error ? err.message : "Failed to load daily event");
      setDailyPhase("idle");
    }
  }, []);

  const handleDailyChoice = useCallback(async (index: number) => {
    if (!dailyEvent || !world) return;

    setDailyPhase("loading");
    const choice = dailyEvent.choices[index];

    try {
      const res = await fetch("/api/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: dailyEvent.title,
          description: dailyEvent.description,
          choice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      setDailyConsequence(data.consequence);
      setDailyItem(data.item?.name || null);
      setDailyPhase("result");

      // Save daily event result into world state
      setWorld((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          inventory: data.item?.name && !prev.inventory.includes(data.item.name)
            ? [...prev.inventory, data.item.name]
            : prev.inventory,
          dailyEvent: {
            date: todayStr(),
            title: dailyEvent.title,
            description: dailyEvent.description,
            choices: dailyEvent.choices,
            chosenIndex: index,
            consequence: data.consequence,
            resolved: true,
          },
          stats: {
            ...prev.stats,
            itemsCollected: data.item?.name && !prev.inventory.includes(data.item.name)
              ? prev.stats.itemsCollected + 1
              : prev.stats.itemsCollected,
          },
        };
      });
    } catch (err) {
      setDailyError(err instanceof Error ? err.message : "Failed");
      setDailyPhase("event");
    }
  }, [dailyEvent, world]);

  const handleDismissDaily = useCallback(() => {
    setDailyPhase("idle");
    setDailyEvent(null);
    setDailyConsequence(null);
    setDailyItem(null);
    setDailyError(null);
  }, []);

  const generateEvent = useCallback(
    async (mode: "continue" | "twist") => {
      if (!world || isLoading) return;

      setIsLoading(true);
      setError(null);

      try {
        const res = await fetch("/api/continue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ world, mode }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

        setWorld(data.world);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
    [world, isLoading]
  );

  const handleReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setWorld(createWorld());
    setError(null);
    setDailyPhase("idle");
    setDailyEvent(null);
  }, []);

  if (!mounted || !world) return null;

  return (
    <div className="mx-auto max-w-lg px-4 py-6">
      {/* Daily Event Overlay */}
      {dailyPhase !== "idle" && (
        <DailyEvent
          event={dailyEvent}
          phase={dailyPhase === "loading" ? "loading" : dailyPhase as "event" | "result"}
          consequence={dailyConsequence}
          newItemName={dailyItem}
          error={dailyError}
          onChoice={handleDailyChoice}
          onDismiss={handleDismissDaily}
        />
      )}

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-xl font-bold tracking-tight text-white">
          One Button Story
        </h1>
        <button
          onClick={handleReset}
          className="text-xs text-gray-600 transition-colors hover:text-gray-400"
        >
          Reset
        </button>
      </div>

      {/* World View */}
      <WorldView world={world} />

      {/* Story Feed */}
      <div className="mt-4">
        <StoryFeed events={world.story} />
      </div>

      {/* Info Cards */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        <CharacterCard player={world.player} />
        <LocationCard location={world.location} />
        <InventoryCard items={world.inventory} />
      </div>

      {/* Actions */}
      <div className="mt-4">
        <ActionBar
          isLoading={isLoading}
          error={error}
          onContinue={() => generateEvent("continue")}
          onTwist={() => generateEvent("twist")}
        />
      </div>

      {/* Bottom toggles */}
      <div className="mt-4 flex gap-3">
        <button
          onClick={() => setShowMemories(!showMemories)}
          className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-gray-400 transition-colors hover:text-gray-200"
        >
          {showMemories ? "Hide" : "View"} Memories ({world.memories.length})
        </button>
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="flex-1 rounded-lg border border-border bg-card px-3 py-2 text-xs font-medium text-gray-400 transition-colors hover:text-gray-200"
        >
          {showAchievements ? "Hide" : "View"} Achievements ({world.achievements.length})
        </button>
      </div>

      {showMemories && (
        <div className="mt-3 animate-fade-in">
          <MemoryBook memories={world.memories} />
        </div>
      )}

      {showAchievements && (
        <div className="mt-3 animate-fade-in">
          <Achievements achievements={world.achievements} />
        </div>
      )}
    </div>
  );
}
