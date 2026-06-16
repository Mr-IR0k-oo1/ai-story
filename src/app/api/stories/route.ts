import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateUniqueId } from "@/lib/id";
import { toErrorResponse, ValidationError } from "@/lib/errors";

const MAX_EVENTS = 200;

interface SaveBody {
  events: string[];
  world: {
    character: string;
    goal: string;
    conflict: string;
    location: string;
    objects?: string[];
  };
  summary?: string;
}

function validate(body: unknown): SaveBody {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Request body is required");
  }

  const b = body as Record<string, unknown>;
  const events = b.events;

  if (
    !Array.isArray(events) ||
    events.length === 0 ||
    events.some((e) => typeof e !== "string")
  ) {
    throw new ValidationError("events must be a non-empty array of strings");
  }

  if (events.length > MAX_EVENTS) {
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
      "world must include character, goal, conflict, and location as strings"
    );
  }

  return {
    events: events as string[],
    world: world as SaveBody["world"],
    summary: typeof b.summary === "string" ? b.summary : "",
  };
}

export async function POST(request: Request) {
  try {
    if (!prisma) {
      return NextResponse.json(
        { error: "Story saving is not available in this deployment", code: "STORAGE_UNAVAILABLE" },
        { status: 503 }
      );
    }
    const db = prisma;

    const body: unknown = await request.json();
    const { events, world, summary } = validate(body);

    const id = await generateUniqueId(async (id) => {
      const existing = await db.story.findUnique({ where: { id } });
      return existing !== null;
    });

    await db.story.create({
      data: {
        id,
        events: JSON.stringify(events),
        world: JSON.stringify(world),
        summary,
      },
    });

    return NextResponse.json({ id, url: `/story/${id}` });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "Invalid JSON in request body", code: "INVALID_JSON" },
        { status: 400 }
      );
    }

    const { error: message, code, status } = toErrorResponse(error);
    console.error("[save-story] %s: %s", code, message);

    return NextResponse.json({ error: message, code }, { status });
  }
}
