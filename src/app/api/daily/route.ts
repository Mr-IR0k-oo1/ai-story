import { NextResponse } from "next/server";
import { mistral, DAILY_SYSTEM_PROMPT } from "@/lib/ai";
import { AIError, toErrorResponse } from "@/lib/errors";

export async function POST(request: Request) {
  try {
    let worldContext = "Generate today's daily event.";
    try {
      const body = await request.json() as { context?: string };
      if (body.context) worldContext = body.context;
    } catch {}

    const completion = await mistral.chat.complete({
      model: "mistral-small-latest",
      messages: [
        { role: "system", content: DAILY_SYSTEM_PROMPT },
        { role: "user", content: worldContext },
      ],
      maxTokens: 300,
      temperature: 0.9,
    });

    const content = completion.choices?.[0]?.message?.content;
    const raw = typeof content === "string" ? content.trim() : "";
    if (!raw) throw new AIError("AI returned empty response.");

    let cleaned = raw;
    if (cleaned.startsWith("```json")) cleaned = cleaned.slice(7);
    else if (cleaned.startsWith("```")) cleaned = cleaned.slice(3);
    if (cleaned.endsWith("```")) cleaned = cleaned.slice(0, -3);

    const parsed = JSON.parse(cleaned.trim()) as {
      title: string;
      description: string;
      choices: string[];
    };

    if (!parsed.title || !parsed.description || !Array.isArray(parsed.choices) || parsed.choices.length !== 3) {
      throw new Error("Invalid response structure");
    }

    return NextResponse.json({
      title: parsed.title.trim(),
      description: parsed.description.trim(),
      choices: parsed.choices.map((c: string) => c.trim()),
    });
  } catch (error) {
    const { error: message, code, status } = toErrorResponse(error);
    console.error("[daily] %s: %s", code, message);
    return NextResponse.json({ error: message, code }, { status });
  }
}
