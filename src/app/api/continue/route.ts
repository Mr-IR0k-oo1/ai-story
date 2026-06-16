import { NextResponse } from "next/server";
import { processEvent, createEngine } from "@/lib/engine";
import {
  RECENT_WINDOW,
  MAX_SETUP_LENGTH,
  MAX_EVENTS,
  type WorldState,
  type StoryMode,
  type EventType,
} from "@/lib/types";
import { ValidationError, toErrorResponse } from "@/lib/errors";

interface ContinueBody {
  setup: { character: string; goal: string; problem: string };
  events: string[];
  world: WorldState;
  summary: string;
  mode: StoryMode;
}

function validate(body: unknown): ContinueBody {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body is required");
  }

  const b = body as Record<string, unknown>;
  const setup = b.setup as Record<string, unknown> | undefined;

  if (
    !setup ||
    typeof setup.character !== "string" ||
    typeof setup.goal !== "string" ||
    typeof setup.problem !== "string"
  ) {
    throw new ValidationError(
      "setup must include character, goal, and problem as strings"
    );
  }

  const character = setup.character.trim();
  const goal = setup.goal.trim();
  const problem = setup.problem.trim();

  if (!character || !goal || !problem) {
    throw new ValidationError(
      "character, goal, and problem cannot be empty"
    );
  }

  if (character.length > MAX_SETUP_LENGTH) {
    throw new ValidationError(
      `character exceeds ${MAX_SETUP_LENGTH} characters`
    );
  }
  if (goal.length > MAX_SETUP_LENGTH) {
    throw new ValidationError(`goal exceeds ${MAX_SETUP_LENGTH} characters`);
  }
  if (problem.length > MAX_SETUP_LENGTH) {
    throw new ValidationError(
      `problem exceeds ${MAX_SETUP_LENGTH} characters`
    );
  }

  const events = b.events;
  if (!Array.isArray(events) || events.some((e) => typeof e !== "string")) {
    throw new ValidationError("events must be an array of strings");
  }
  if (events.length > MAX_EVENTS) {
    throw new ValidationError(
      `story exceeds maximum of ${MAX_EVENTS} events`
    );
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
      "world must include character, goal, conflict, and location as strings"
    );
  }

  const mode = b.mode;
  if (mode !== "continue" && mode !== "twist") {
    throw new ValidationError("mode must be 'continue' or 'twist'");
  }

  return {
    setup: { character, goal, problem },
    events: events as string[],
    world: world as unknown as WorldState,
    summary: typeof b.summary === "string" ? b.summary.trim() : "",
    mode: mode as StoryMode,
  };
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { setup, events, world, summary, mode } = validate(body);

    let state = createEngine(setup);
    state.world = world;
    state.summary = summary;
    state.recentEvents = events.slice(-RECENT_WINDOW);
    state.fullHistory = events;
    state.turnCount = events.length;

    const { state: updated, text, isEnding, eventType } = await processEvent(
      state,
      mode
    );

    return NextResponse.json({
      text,
      mode,
      isEnding,
      eventType,
      state: {
        world: updated.world,
        summary: updated.summary,
        recentEvents: updated.recentEvents,
        turnCount: updated.turnCount,
      },
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    const { error: message, code, status } = toErrorResponse(error);
    console.error("[continue] %s: %s", code, message);

    return NextResponse.json({ error: message, code }, { status });
  }
}
