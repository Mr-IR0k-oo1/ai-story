import { memoryBlock, type StoryState } from "./types";

export function buildStoryPrompt(state: StoryState): string {
  const block = memoryBlock(state);
  return `${block}

Write the next event (under 25 words):`;
}
