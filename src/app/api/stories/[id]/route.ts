import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { toErrorResponse, NotFoundError, ValidationError } from "@/lib/errors";

const ID_REGEX = /^[0-9a-f]{8}$/;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!ID_REGEX.test(id)) {
      throw new ValidationError("Invalid story ID format");
    }

    const story = await prisma.story.findUnique({ where: { id } });

    if (!story) {
      throw new NotFoundError("Story not found");
    }

    let events: string[];
    let world: unknown;

    try {
      events = JSON.parse(story.events) as string[];
      world = JSON.parse(story.world);
    } catch {
      return NextResponse.json(
        { error: "Stored story data is corrupted", code: "CORRUPTED_DATA" },
        { status: 500 }
      );
    }

    if (!Array.isArray(events) || events.some((e) => typeof e !== "string")) {
      return NextResponse.json(
        { error: "Stored story data is corrupted", code: "CORRUPTED_DATA" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: story.id,
      events,
      world,
      summary: story.summary,
      createdAt: story.createdAt.toISOString(),
    });
  } catch (error) {
    const { error: message, code, status } = toErrorResponse(error);
    if (status === 500) {
      console.error("[load-story] %s: %s", code, message);
    }
    return NextResponse.json({ error: message, code }, { status });
  }
}
