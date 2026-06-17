"use client";

import type { Location } from "@/types/world";

interface LocationCardProps {
  location: Location;
}

export function LocationCard({ location }: LocationCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card px-4 py-3">
      <p className="text-[10px] font-medium tracking-wide text-gray-500 uppercase">
        Location
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{location.name}</p>
      <p className="text-xs text-gray-500">{location.description}</p>
    </div>
  );
}
