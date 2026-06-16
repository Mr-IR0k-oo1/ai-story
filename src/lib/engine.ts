import {
  mistral,
  STORYTELLER_SYSTEM_PROMPT,
  TWIST_SYSTEM_PROMPT,
  ENDING_SYSTEM_PROMPT,
  SUMMARIZER_SYSTEM_PROMPT,
} from "./ai";
import {
  makeWorld,
  addEvent,
  shouldCompress,
  isEndingTurn,
  enforceWordLimit,
  MAX_EVENT_WORDS,
  type StoryState,
  type StoryMode,
  type EventType,
} from "./types";
import { buildStoryPrompt } from "./prompt";
import { AIError } from "./errors";

const COMPRESS_PROMPT = `Summarize the key events of this story so far in 3 sentences.

Focus on:
- Who the main character is and what they want.
- The main obstacle or conflict.
- What is currently happening.

Keep it tight and funny.`;

async function compressSummary(state: StoryState): Promise<string> {
  const context = state.summary
    ? [`Previous summary: ${state.summary}`, "", ...state.recentEvents]
    : state.recentEvents;

  const prompt = `${COMPRESS_PROMPT}\n\n${context.join("\n")}`;

  const completion = await mistral.chat.complete({
    model: "mistral-small-latest",
    messages: [
      { role: "system", content: SUMMARIZER_SYSTEM_PROMPT },
      { role: "user", content: prompt },
    ],
    maxTokens: 120,
    temperature: 0.5,
  });

  const content = completion.choices?.[0]?.message?.content;
  return typeof content === "string" ? content.trim() : "";
}

async function generateEventText(
  systemPrompt: string,
  userPrompt: string,
  temperature: number
): Promise<string> {
  const completion = await mistral.chat.complete({
    model: "mistral-small-latest",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    maxTokens: 60,
    temperature,
  });

  const content = completion.choices?.[0]?.message?.content;
  const raw = typeof content === "string" ? content.trim() : "";

  if (!raw) {
    throw new AIError("AI returned an empty response. Please try again.");
  }

  return enforceWordLimit(raw, MAX_EVENT_WORDS);
}

export async function processEvent(
  state: StoryState,
  mode: StoryMode
): Promise<{
  state: StoryState;
  text: string;
  isEnding: boolean;
  eventType: EventType | null;
}> {
  const isLastTurn = mode !== "twist" && isEndingTurn(state);

  const prompt = buildStoryPrompt(state);
  const systemPrompt = isLastTurn
    ? ENDING_SYSTEM_PROMPT
    : mode === "twist"
      ? TWIST_SYSTEM_PROMPT
      : STORYTELLER_SYSTEM_PROMPT;
  const temperature = mode === "twist" ? 1.0 : isLastTurn ? 0.7 : 0.9;

  const text = await generateEventText(systemPrompt, prompt, temperature);

  let updated = addEvent(state, text);

  if (shouldCompress(updated)) {
    try {
      const summary = await compressSummary(updated);
      if (summary) {
        updated = { ...updated, summary };
      }
    } catch {
      // Compression is non-critical
    }
  }

  const eventType: EventType | null = isLastTurn
    ? "ending"
    : mode === "twist"
      ? "twist"
      : null;

  return {
    state: updated,
    text,
    isEnding: isLastTurn,
    eventType,
  };
}

export function createEngine(setup: {
  character: string;
  goal: string;
  problem: string;
}): StoryState {
  return {
    world: makeWorld(setup),
    summary: "",
    recentEvents: [],
    fullHistory: [],
    turnCount: 0,
  };
}
