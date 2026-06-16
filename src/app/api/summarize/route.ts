import { NextResponse } from "next/server";
import { mistral, SUMMARIZER_SYSTEM_PROMPT } from "@/lib/ai";
import { toErrorResponse, ValidationError } from "@/lib/errors";

const SUMMARIZE_PROMPT = `Summarize the key events of this story in 3 sentences.

Focus on:
- Who the main character is and what they want.
- The main obstacle or conflict.
- What is currently happening.

Keep it tight and funny.`;

interface SummarizeBody {
  story: string[];
  setup: { character: string; goal: string; problem: string };
}

function validate(body: unknown): SummarizeBody {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body is required");
  }

  const b = body as Record<string, unknown>;

  if (
    !Array.isArray(b.story) ||
    b.story.length === 0 ||
    b.story.some((e) => typeof e !== "string")
  ) {
    throw new ValidationError("story must be a non-empty array of strings");
  }

  const setup = b.setup as Record<string, unknown> | undefined;
  if (
    !setup ||
    typeof setup.character !== "string" ||
    typeof setup.goal !== "string" ||
    typeof setup.problem !== "string"
  ) {
    throw new ValidationError("setup must include character, goal, and problem as strings");
  }

  return {
    story: b.story as string[],
    setup: { character: setup.character, goal: setup.goal, problem: setup.problem },
  };
}

async function summarize(story: string[], setup: SummarizeBody["setup"]): Promise<string> {
  const prompt = [
    `Character: ${setup.character}`,
    `Goal: ${setup.goal}`,
    `Problem: ${setup.problem}`,
    "",
    "Story:",
    ...story.map((e, i) => `${i + 1}. ${e}`),
    "",
    SUMMARIZE_PROMPT,
  ].join("\n");

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

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { story, setup } = validate(body);

    const summary = await summarize(story, setup);

    if (!summary) {
      return NextResponse.json(
        { error: "Summarization returned empty result", code: "AI_EMPTY" },
        { status: 502 }
      );
    }

    return NextResponse.json({ summary });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    const { error: message, code, status } = toErrorResponse(error);
    console.error("[summarize] %s: %s", code, message);

    return NextResponse.json({ error: message, code }, { status });
  }
}
