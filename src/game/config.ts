export interface LocationVisual {
  bg: number;
  bgName: string;
  decos: { emoji: string; x: number; y: number }[];
}

function hsl(h: number, s: number, l: number): number {
  const c = Phaser.Display.Color.HSLToColor(h / 360, s / 100, l / 100);
  return Phaser.Display.Color.GetColor(c.red, c.green, c.blue);
}

import Phaser from "phaser";

export const LOCATION_VISUALS: Record<string, LocationVisual> = {
  "Forest of Missing Spoons": {
    bg: hsl(120, 30, 12),
    bgName: "dark forest green",
    decos: [
      { emoji: "🌲", x: 0.1, y: 0.2 },
      { emoji: "🌲", x: 0.85, y: 0.15 },
      { emoji: "🌿", x: 0.5, y: 0.7 },
      { emoji: "🍄", x: 0.7, y: 0.6 },
    ],
  },
  "Moon Market": {
    bg: hsl(270, 25, 10),
    bgName: "deep purple night",
    decos: [
      { emoji: "🌙", x: 0.8, y: 0.1 },
      { emoji: "⭐", x: 0.15, y: 0.08 },
      { emoji: "⭐", x: 0.4, y: 0.05 },
      { emoji: "🏪", x: 0.3, y: 0.3 },
      { emoji: "🏪", x: 0.6, y: 0.35 },
    ],
  },
  "Dragon Castle": {
    bg: hsl(0, 25, 10),
    bgName: "dark crimson",
    decos: [
      { emoji: "🏰", x: 0.4, y: 0.1 },
      { emoji: "🔥", x: 0.2, y: 0.5 },
      { emoji: "🔥", x: 0.7, y: 0.45 },
      { emoji: "🗡️", x: 0.5, y: 0.6 },
    ],
  },
  "Whispering Gorge": {
    bg: hsl(30, 25, 10),
    bgName: "deep canyon brown",
    decos: [
      { emoji: "🏜️", x: 0.5, y: 0.2 },
      { emoji: "🪨", x: 0.15, y: 0.4 },
      { emoji: "🪨", x: 0.8, y: 0.35 },
      { emoji: "🌵", x: 0.9, y: 0.65 },
      { emoji: "💨", x: 0.3, y: 0.15 },
    ],
  },
  "Library of Lost Recipes": {
    bg: hsl(40, 20, 10),
    bgName: "warm amber",
    decos: [
      { emoji: "📚", x: 0.2, y: 0.2 },
      { emoji: "📚", x: 0.7, y: 0.15 },
      { emoji: "🕯️", x: 0.5, y: 0.25 },
      { emoji: "🧑‍🍳", x: 0.8, y: 0.6 },
      { emoji: "📖", x: 0.3, y: 0.55 },
    ],
  },
  "Clockmaker's Alley": {
    bg: hsl(190, 30, 9),
    bgName: "deep teal",
    decos: [
      { emoji: "🕰️", x: 0.2, y: 0.2 },
      { emoji: "⏰", x: 0.7, y: 0.15 },
      { emoji: "⚙️", x: 0.5, y: 0.5 },
      { emoji: "🔧", x: 0.3, y: 0.6 },
      { emoji: "⏳", x: 0.8, y: 0.5 },
    ],
  },
  "Goblin Bazaar": {
    bg: hsl(150, 20, 9),
    bgName: "murky green",
    decos: [
      { emoji: "🏴‍☠️", x: 0.1, y: 0.1 },
      { emoji: "🛒", x: 0.3, y: 0.3 },
      { emoji: "🛒", x: 0.7, y: 0.25 },
      { emoji: "💎", x: 0.5, y: 0.5 },
      { emoji: "💰", x: 0.8, y: 0.6 },
    ],
  },
  "Sea of Forgotten Laundry": {
    bg: hsl(210, 25, 9),
    bgName: "deep navy",
    decos: [
      { emoji: "🌊", x: 0.5, y: 0.3 },
      { emoji: "👕", x: 0.2, y: 0.5 },
      { emoji: "🧦", x: 0.7, y: 0.55 },
      { emoji: "👖", x: 0.4, y: 0.6 },
      { emoji: "🚢", x: 0.8, y: 0.2 },
    ],
  },
  "The Great Attic": {
    bg: hsl(25, 15, 10),
    bgName: "dusty brown",
    decos: [
      { emoji: "📦", x: 0.2, y: 0.3 },
      { emoji: "📦", x: 0.7, y: 0.25 },
      { emoji: "🕸️", x: 0.5, y: 0.1 },
      { emoji: "🪑", x: 0.4, y: 0.6 },
      { emoji: "💡", x: 0.8, y: 0.15 },
    ],
  },
  "Crystal Methane Marshes": {
    bg: hsl(160, 25, 8),
    bgName: "bog cyan",
    decos: [
      { emoji: "💎", x: 0.2, y: 0.3 },
      { emoji: "💎", x: 0.7, y: 0.25 },
      { emoji: "🪷", x: 0.5, y: 0.5 },
      { emoji: "🐸", x: 0.8, y: 0.6 },
      { emoji: "🪨", x: 0.3, y: 0.65 },
    ],
  },
  "Emperor's Waiting Room": {
    bg: hsl(45, 20, 10),
    bgName: "regal gold",
    decos: [
      { emoji: "👑", x: 0.5, y: 0.1 },
      { emoji: "🪑", x: 0.2, y: 0.4 },
      { emoji: "🪑", x: 0.7, y: 0.4 },
      { emoji: "💤", x: 0.4, y: 0.55 },
      { emoji: "⏳", x: 0.8, y: 0.12 },
    ],
  },
};

export const PROFESSION_EMOJI: Record<string, string> = {
  "Moon Tax Collector": "🧙",
  Pirate: "🏴‍☠️",
  Goat: "🐐",
  Wizard: "🧙‍♂️",
  Chef: "👨‍🍳",
  Knight: "🛡️",
  Detective: "🔍",
  Farmer: "👨‍🌾",
  Doctor: "👨‍⚕️",
  Engineer: "🔧",
};

export function getEmoji(profession: string): string {
  return PROFESSION_EMOJI[profession] || "🧑";
}

export function inventoryEmoji(item: string): string {
  const lower = item.toLowerCase();
  if (lower.includes("moon")) return "🌙";
  if (lower.includes("spoon")) return "🥄";
  if (lower.includes("calculator")) return "🔢";
  if (lower.includes("rock") || lower.includes("stone")) return "🪨";
  if (lower.includes("key")) return "🔑";
  if (lower.includes("coin") || lower.includes("gold")) return "🪙";
  if (lower.includes("book") || lower.includes("scroll")) return "📜";
  if (lower.includes("potion") || lower.includes("bottle")) return "🧪";
  if (lower.includes("ring")) return "💍";
  if (lower.includes("sword") || lower.includes("blade")) return "⚔️";
  if (lower.includes("shield")) return "🛡️";
  if (lower.includes("crown")) return "👑";
  if (lower.includes("map")) return "🗺️";
  if (lower.includes("compass")) return "🧭";
  if (lower.includes("lamp") || lower.includes("lantern")) return "🪔";
  return "📦";
}
