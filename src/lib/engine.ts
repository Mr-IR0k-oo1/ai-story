import { mistral, SYSTEM_PROMPT } from "./ai";
import { AIError } from "./errors";
import type { WorldState, Achievement, MemoryEntry } from "@/types/world";

interface ContinueResult {
  event: string;
  memory: string | null;
  inventoryChanges: string[];
  locationChange: string | null;
  locationDescription: string | null;
}

const MAX_RETRIES = 2;

function buildPrompt(world: WorldState, mode: "continue" | "twist"): string {
  const parts = [
    "Current World State",
    "---",
    `Player: ${world.player.name} (${world.player.profession}), Level ${world.player.level}`,
    `Location: ${world.location.name}`,
    `Location Description: ${world.location.description}`,
  ];

  if (world.inventory.length > 0) {
    parts.push(`Inventory: ${world.inventory.join(", ")}`);
  }

  if (world.memories.length > 0) {
    const recent = world.memories.slice(-3).map((m) => m.text).join(" | ");
    parts.push(`Recent Memories: ${recent}`);
  }

  parts.push("---");
  const recentStory = world.story.slice(-5).map((s, i) => `${i + 1}. ${s}`).join("\n");
  parts.push(`Recent Story:\n${recentStory}`);

  if (mode === "twist") {
    parts.push("\nThis is a TWIST. Escalate the situation unexpectedly.");
  }

  parts.push("\nGenerate the next event as JSON:");
  return parts.join("\n");
}

function cleanJSON(raw: string): string {
  let cleaned = raw.trim();
  if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
  else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
  if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);
  return cleaned.trim();
}

async function callAI(prompt: string): Promise<string> {
  const completion = await mistral.chat.complete({
    model: "mistral-small-latest",
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    maxTokens: 250,
    temperature: 0.9,
  });

  const content = completion.choices?.[0]?.message?.content;
  const raw = typeof content === "string" ? content.trim() : "";
  if (!raw) throw new AIError("AI returned empty response.");
  return raw;
}

function parseResult(raw: string): ContinueResult {
  const parsed = JSON.parse(cleanJSON(raw)) as Record<string, unknown>;

  if (typeof parsed.event !== "string" || !parsed.event.trim()) {
    throw new Error("Missing or invalid event");
  }

  return {
    event: parsed.event.trim(),
    memory: typeof parsed.memory === "string" && parsed.memory.trim() ? parsed.memory.trim() : null,
    inventoryChanges: Array.isArray(parsed.inventoryChanges)
      ? parsed.inventoryChanges.filter((i): i is string => typeof i === "string" && i.trim().length > 0)
      : [],
    locationChange: typeof parsed.locationChange === "string" && parsed.locationChange.trim()
      ? parsed.locationChange.trim()
      : null,
    locationDescription: typeof parsed.locationDescription === "string" && parsed.locationDescription.trim()
      ? parsed.locationDescription.trim()
      : null,
  };
}

function checkAchievements(world: WorldState): Achievement[] {
  const newAchievements: Achievement[] = [];
  const existing = new Set(world.achievements.map((a) => a.id));
  const now = Date.now();

  if (!existing.has("first-twist") && world.stats.twistsUsed >= 1) {
    newAchievements.push({ id: "first-twist", title: "Twist-Master", unlockedAt: now });
  }
  if (!existing.has("chaos-agent") && world.stats.twistsUsed >= 5) {
    newAchievements.push({ id: "chaos-agent", title: "Chaos Agent", unlockedAt: now });
  }
  if (!existing.has("story-explorer") && world.stats.eventsSeen >= 10) {
    newAchievements.push({ id: "story-explorer", title: "Story Explorer", unlockedAt: now });
  }
  if (!existing.has("tale-weaver") && world.stats.eventsSeen >= 25) {
    newAchievements.push({ id: "tale-weaver", title: "Tale Weaver", unlockedAt: now });
  }
  if (!existing.has("collector") && world.stats.itemsCollected >= 5) {
    newAchievements.push({ id: "collector", title: "Collector", unlockedAt: now });
  }
  if (!existing.has("wanderer") && world.stats.locationsVisited.length >= 3) {
    newAchievements.push({ id: "wanderer", title: "Wanderer", unlockedAt: now });
  }

  return newAchievements;
}

export async function continueStory(
  world: WorldState,
  mode: "continue" | "twist" = "continue"
): Promise<WorldState> {
  const prompt = buildPrompt(world, mode);
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const raw = await callAI(prompt);
      const result = parseResult(raw);

      const newLocation = result.locationChange ? result.locationChange : null;
      const locationsVisited = newLocation && !world.stats.locationsVisited.includes(newLocation)
        ? [...world.stats.locationsVisited, newLocation]
        : world.stats.locationsVisited;

      const newStats = {
        eventsSeen: world.stats.eventsSeen + 1,
        itemsCollected: world.stats.itemsCollected + result.inventoryChanges.filter(
          (i) => !world.inventory.includes(i)
        ).length,
        locationsVisited,
        twistsUsed: world.stats.twistsUsed + (mode === "twist" ? 1 : 0),
      };

      const memoryEntry: MemoryEntry | null = result.memory
        ? { day: world.stats.eventsSeen, text: result.memory }
        : null;

      const locDescription = result.locationDescription || world.location.description;

      const updated: WorldState = {
        player: { ...world.player, level: world.player.level },
        location: newLocation
          ? { name: newLocation, description: locDescription }
          : result.locationDescription
            ? { ...world.location, description: result.locationDescription }
            : { ...world.location },
        inventory: [
          ...world.inventory,
          ...result.inventoryChanges.filter((i) => !world.inventory.includes(i)),
        ],
        memories: memoryEntry
          ? [...world.memories, memoryEntry]
          : [...world.memories],
        story: [...world.story, result.event],
        stats: newStats,
        achievements: world.achievements,
        dailyEvent: world.dailyEvent,
      };

      const newAchievements = checkAchievements(updated);
      if (newAchievements.length > 0) {
        updated.achievements = [...updated.achievements, ...newAchievements];
      }

      return updated;
    } catch (err) {
      lastError = err instanceof Error ? err : new Error("Parse failed");
    }
  }

  throw new AIError(lastError?.message || "Failed to generate story event after retries");
}

export function createWorldFromSetup(data: {
  name: string;
  profession: string;
  locationName: string;
  locationDescription: string;
  inventoryItems: string[];
}): WorldState {
  return {
    player: {
      name: data.name,
      profession: data.profession,
      level: 1,
    },
    location: {
      name: data.locationName,
      description: data.locationDescription,
    },
    inventory: data.inventoryItems,
    memories: [],
    story: [`You arrive at ${data.locationName}.`],
    stats: {
      eventsSeen: 1,
      itemsCollected: data.inventoryItems.length,
      locationsVisited: [data.locationName],
      twistsUsed: 0,
    },
    achievements: [],
    dailyEvent: null,
  };
}
