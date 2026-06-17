import { NextResponse } from "next/server";
import { mistral, RESOLVE_SYSTEM_PROMPT } from "@/lib/ai";
import { AIError, toErrorResponse, ValidationError } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { title?: string; description?: string; choice?: string };

    if (!body.title || !body.description || !body.choice) {
      throw new ValidationError("title, description, and choice are required");
    }

    const prompt = `Event: ${body.title}
Description: ${body.description}
Choice made: ${body.choice}

Generate the consequence.`;

    const completion = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: RESOLVE_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      maxTokens: 250,
      temperature: 0.8,
    });

    const content = completion.choices?.[0]?.message?.content;
    const raw = typeof content === "string" ? content.trim() : "";
    if (!raw) throw new AIError("AI returned empty response.");

    let cleaned = raw;
    if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
    else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
    if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);

    const parsed = JSON.parse(cleaned.trim()) as {
      consequence: string;
      item: { name: string; description: string } | null;
    };

    if (!parsed.consequence) throw new Error("Missing consequence");

    return NextResponse.json({
      consequence: parsed.consequence.trim(),
      item: parsed.item
        ? { name: parsed.item.name?.trim() || "Mysterious Object", description: parsed.item.description?.trim() || "" }
        : null,
    });
  } catch (error) {
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Invalid JSON", code: "INVALID_JSON" }, { status: 400 });
    }
    const { error: message, code, status } = toErrorResponse(error);
    console.error("[resolve] %s: %s", code, message);
    return NextResponse.json({ error: message, code }, { status });
  }
}
