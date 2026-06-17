import { NextResponse } from "next/server";
import { continueStory } from "@/lib/engine";
import { toErrorResponse, ValidationError } from "@/lib/errors";
import type { WorldState } from "@/types/world";

interface ContinueBody {
  world: WorldState;
  mode: "continue" | "twist";
}

function validate(body: unknown): ContinueBody {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body is required");
  }

  const b = body as Record<string, unknown>;
  const world = b.world as Record<string, unknown> | undefined;

  if (!world || typeof world.player !== "object" || typeof world.location !== "object") {
    throw new ValidationError("world must include player and location");
  }

  const mode = b.mode;
  if (mode !== "continue" && mode !== "twist") {
    throw new ValidationError("mode must be 'continue' or 'twist'");
  }

  return { world: world as unknown as WorldState, mode };
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    const { world, mode } = validate(body);

    const updated = await continueStory(world, mode);

    return NextResponse.json({ world: updated });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON", code: "INVALID_JSON" },
        { status: 400 }
      );
    }
    const { error: message, code, status } = toErrorResponse(error);
    console.error("[continue] %s: %s", code, message);
    return NextResponse.json({ error: message, code }, { status });
  }
}
