import { NextResponse } from "next/server";
import { generateSceneImage } from "@/lib/ai";
import { toErrorResponse, ValidationError, AIError } from "@/lib/errors";
import { RECENT_WINDOW, MAX_EVENTS } from "@/lib/types";

interface SceneBody {
  events: string[];
  world: {
    character: string;
    goal: string;
    conflict: string;
    location: string;
    objects?: string[];
  };
}

function validate(body: unknown): SceneBody {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body is required");
  }

  const b = body as Record<string, unknown>;

  if (
    !Array.isArray(b.events) ||
    b.events.length === 0 ||
    b.events.some((e) => typeof e !== "string")
  ) {
    throw new ValidationError("events must be a non-empty array of strings");
  }

  if (b.events.length > MAX_EVENTS) {
    throw new ValidationError(`story exceeds maximum of ${MAX_EVENTS} events`);
  }

  const world = b.world as Record<string, unknown> | undefined;
  if (
    !world ||
    typeof world.character !== "string" ||
    typeof world.goal !== "string" ||
    typeof world.conflict !== "string" ||
    typeof world.location !== "string"
  ) {
    throw new ValidationError(
      "world must include character, goal, conflict, and location"
    );
  }

  return {
    events: b.events as string[],
    world: {
      character: world.character as string,
      goal: world.goal as string,
      conflict: world.conflict as string,
      location: world.location as string,
      objects: Array.isArray(world.objects) ? (world.objects as string[]) : [],
    },
  };
}

function buildStoryContext(body: SceneBody): string {
  const recent = body.events.slice(-RECENT_WINDOW);
  return [
    `Character: ${body.world.character}`,
    `Goal: ${body.world.goal}`,
    `Conflict: ${body.world.conflict}`,
    `Location: ${body.world.location}`,
    body.world.objects && body.world.objects.length > 0
      ? `Objects: ${body.world.objects.join(", ")}`
      : "",
    "",
    "Story so far:",
    ...recent.map((e, i) => `${i + 1}. ${e}`),
    "",
    `Illustrate the latest event: "${body.events[body.events.length - 1]}"`,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const validated = validate(body);

    const storyContext = buildStoryContext(validated);
    const imageUrl = await generateSceneImage(storyContext);

    if (!imageUrl) {
      throw new AIError("Image generation returned empty");
    }

    return NextResponse.json({ imageUrl });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    const { error: message, code, status } = toErrorResponse(error);
    console.error("[scene] %s: %s", code, message);

    return NextResponse.json({ error: message, code }, { status });
  }
}
