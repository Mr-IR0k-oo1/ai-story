"use client";

import type { MemoryEntry } from "@/types/world";

interface MemoryBookProps {
  memories: MemoryEntry[];
}

export function MemoryBook({ memories }: MemoryBookProps) {
  if (memories.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-2">
        <p className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
          Memories
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {memories.slice().reverse().map((m, i) => (
          <div key={i} className="flex gap-3 px-4 py-2">
            <span className="shrink-0 text-[10px] text-gray-600 w-6 pt-0.5">
              Day {m.day}
            </span>
            <p className="text-xs text-gray-400">{m.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
