export interface WorldState {
  character: string;
  goal: string;
  conflict: string;
  location: string;
  objects: string[];
}

export interface StoryState {
  world: WorldState;
  summary: string;
  recentEvents: string[];
  fullHistory: string[];
  turnCount: number;
}

export type StoryMode = "continue" | "twist";

export type EventType = "twist" | "ending";

export interface SceneImage {
  eventIndex: number;
  url: string;
}

export const RECENT_WINDOW = 8;
export const COMPRESS_INTERVAL = 10;
export const SCENE_INTERVAL = 5;
export const MAX_TURNS = 20;
export const MAX_SETUP_LENGTH = 100;
export const MAX_EVENTS = 200;
export const MAX_EVENT_WORDS = 25;

export const EVENT_TYPE_LABELS: Record<string, string> = {
  twist: "Twist",
  ending: "The End",
};

export const EVENT_TYPE_COLORS: Record<string, string> = {
  twist: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  ending: "text-white bg-white/10 border-white/30",
};

export function makeWorld(setup: {
  character: string;
  goal: string;
  problem: string;
}): WorldState {
  return {
    character: setup.character,
    goal: setup.goal,
    conflict: setup.problem,
    location: "a mysterious cave",
    objects: [],
  };
}

export function addEvent(state: StoryState, event: string): StoryState {
  const fullHistory = [...state.fullHistory, event];
  const recentEvents = [...state.recentEvents, event].slice(-RECENT_WINDOW);
  return {
    ...state,
    fullHistory,
    recentEvents,
    turnCount: state.turnCount + 1,
  };
}

export function shouldCompress(state: StoryState): boolean {
  return state.turnCount > 0 && state.turnCount % COMPRESS_INTERVAL === 0;
}

export function isEndingTurn(state: StoryState): boolean {
  return state.turnCount >= MAX_TURNS;
}

export function worldBlock(w: WorldState): string {
  const parts = [
    `Character: ${w.character}`,
    `Goal: ${w.goal}`,
    `Conflict: ${w.conflict}`,
    `Location: ${w.location}`,
  ];
  if (w.objects.length > 0) {
    parts.push(`Objects: ${w.objects.join(", ")}`);
  }
  return parts.join("\n");
}

export function memoryBlock(state: StoryState): string {
  const parts: string[] = [];
  parts.push(worldBlock(state.world));

  if (state.summary) {
    parts.push("");
    parts.push(`Story Summary:\n${state.summary}`);
  }

  if (state.recentEvents.length > 0) {
    parts.push("");
    parts.push(
      "Recent Events:\n" +
        state.recentEvents.map((e, i) => `${i + 1}. ${e}`).join("\n")
    );
  }

  return parts.join("\n");
}

export function wordCount(text: string): number {
  return text.split(/\s+/).filter(Boolean).length;
}

export function enforceWordLimit(text: string, max: number): string {
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= max) return text;
  return words.slice(0, max).join(" ") + "…";
}
