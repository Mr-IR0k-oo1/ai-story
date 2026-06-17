import type { WorldState } from "@/types/world";

export function createWorld(): WorldState {
  return {
    player: {
      name: "Vox",
      profession: "Moon Tax Collector",
      level: 1,
    },
    location: {
      name: "Forest of Missing Spoons",
      description: "A strange forest where spoons vanish.",
    },
    inventory: ["Rusty Calculator", "Moon Rock"],
    memories: [],
    story: ["You arrive at the Forest of Missing Spoons."],
    stats: {
      eventsSeen: 1,
      itemsCollected: 2,
      locationsVisited: ["Forest of Missing Spoons"],
      twistsUsed: 0,
    },
    achievements: [],
    dailyEvent: null,
  };
}
