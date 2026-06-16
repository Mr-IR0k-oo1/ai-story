import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { StoryView } from "./StoryView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function SharedStoryPage({ params }: Props) {
  const { id } = await params;

  const story = await prisma.story.findUnique({ where: { id } });

  if (!story) {
    notFound();
  }

  let events: string[];
  try {
    events = JSON.parse(story.events) as string[];
  } catch {
    events = [];
  }

  if (!Array.isArray(events)) {
    events = [];
  }

  return (
    <div className="min-h-screen bg-gray-950 py-12 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-lg font-semibold text-white tracking-tight">
              One Button Story
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {events.length} event{events.length !== 1 ? "s" : ""}
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-gray-600">
            Read Only
          </span>
        </div>

        <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
          <div className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              {events.map((_, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="w-3 h-3 rounded-full border-2 border-gray-600 bg-gray-800 shrink-0" />
                  {i < events.length - 1 && (
                    <div className="w-px h-full min-h-[24px] bg-gray-800" />
                  )}
                </div>
              ))}
            </div>

            <div className="flex-1 min-w-0 space-y-6 pb-4">
              {events.map((line, i) => (
                <p
                  key={i}
                  className="text-[15px] leading-relaxed text-gray-300"
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>

        <StoryView createdAt={story.createdAt} id={story.id} />
      </div>
    </div>
  );
}
