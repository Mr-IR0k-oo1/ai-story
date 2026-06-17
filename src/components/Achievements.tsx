"use client";

import type { Achievement } from "@/types/world";

interface AchievementsProps {
  achievements: Achievement[];
}

const ACHIEVEMENT_DEFS: Record<string, string> = {
  "first-twist": "Twist-Master — Used your first twist",
  "chaos-agent": "Chaos Agent — Used 5 twists",
  "story-explorer": "Story Explorer — Witnessed 10 events",
  "tale-weaver": "Tale Weaver — Witnessed 25 events",
  collector: "Collector — Collected 5 items",
  wanderer: "Wanderer — Visited 3 locations",
};

export function Achievements({ achievements }: AchievementsProps) {
  if (achievements.length === 0) return null;

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-2">
        <p className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
          Achievements
        </p>
      </div>
      <div className="divide-y divide-border/50">
        {achievements.map((a) => (
          <div key={a.id} className="px-4 py-2">
            <p className="text-xs text-accent">
              {ACHIEVEMENT_DEFS[a.id] || a.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
