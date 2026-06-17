"use client";

import type { Player } from "@/types/world";

interface CharacterCardProps {
  player: Player;
}

export function CharacterCard({ player }: CharacterCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
        Character
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{player.name}</p>
      <p className="text-xs text-gray-400">{player.profession}</p>
    </div>
  );
}
