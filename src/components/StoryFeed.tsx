"use client";

import { useRef, useEffect } from "react";

interface StoryFeedProps {
  events: string[];
}

export function StoryFeed({ events }: StoryFeedProps) {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [events.length]);

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-2">
        <p className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
          Story Feed
        </p>
      </div>
      <div
        ref={listRef}
        className="max-h-[40vh] overflow-y-auto px-4 py-3 space-y-2 scroll-smooth"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#1e1e29 transparent" }}
      >
        {events.map((event, i) => (
          <p
            key={i}
            className="animate-fade-in-up text-sm leading-relaxed text-gray-300"
          >
            {event}
          </p>
        ))}
      </div>
    </div>
  );
}
