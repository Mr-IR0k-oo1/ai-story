import { Mistral } from "@mistralai/mistralai";
import OpenAI from "openai";
import { env } from "./env";

export const mistral = new Mistral({
  apiKey: env.MISTRAL_API_KEY,
});

const openai = env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: env.OPENAI_API_KEY })
  : null;

export const STORYTELLER_SYSTEM_PROMPT = `You are an absurd comedy storyteller.

Rules:
- Continue the story by exactly one event.
- Maximum 20 words.
- Make it funny.
- Maintain consistency with the established story.
- Recurring characters should behave consistently.
- End with suspense.
- The story should reach a conclusion around 18-20 events total.
- Output ONLY the event text, nothing else.`;

export const TWIST_SYSTEM_PROMPT = `You are an absurd comedy storyteller introducing a TWIST.

Rules:
- Introduce a surprising turn of events.
- Maximum 20 words.
- The twist must feel unexpected but coherent with the story.
- Do NOT resolve the main conflict — escalate it.
- Maintain the existing character, goal, and conflict.
- Increase tension or humor.
- End with suspense.
- Output ONLY the event text, nothing else.`;

export const ENDING_SYSTEM_PROMPT = `You are an absurd comedy storyteller concluding a story.

Rules:
- Write the FINAL event of the story.
- Maximum 20 words.
- Resolve the main goal and conflict.
- Give a satisfying, funny conclusion.
- End with a clear sense of finality.
- Output ONLY the event text, nothing else.`;

export const SUMMARIZER_SYSTEM_PROMPT =
  "You compress story plots into 3 tight sentences. Keep it funny.";

export const SCENE_DESCRIBER_SYSTEM_PROMPT = `You are a visual scene describer.

Given the story context, write a detailed visual description of the current scene for an AI image generator.

Rules:
- Describe the setting/location, characters, objects, lighting, and mood.
- Keep it under 100 words.
- Focus on the most visually interesting moment.
- Return JSON with a "description" field.`;

export async function generateSceneImage(
  storyContext: string
): Promise<string> {
  if (!openai) return "";

  const descCompletion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: SCENE_DESCRIBER_SYSTEM_PROMPT },
      {
        role: "user",
        content: `Generate a scene description for:\n\n${storyContext}`,
      },
    ],
    max_tokens: 150,
    temperature: 0.7,
    response_format: { type: "json_object" },
  });

  const descRaw = descCompletion.choices[0]?.message?.content?.trim();
  if (!descRaw) return "";

  let description: string;
  try {
    const parsed = JSON.parse(descRaw) as { description?: string };
    description = parsed.description || "";
  } catch {
    description = descRaw;
  }

  if (!description) return "";

  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: description,
    n: 1,
    size: "1024x1024",
    quality: "standard",
  });

  return image.data?.[0]?.url ?? "";
}
