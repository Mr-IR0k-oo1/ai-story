"use client";

import { useRef, useEffect } from "react";
import { createGame } from "@/game/Game";
import { WorldScene } from "@/game/WorldScene";
import type { WorldState } from "@/types/world";

interface WorldViewProps {
  world: WorldState;
}

export function WorldView({ world }: WorldViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const worldRef = useRef<WorldState>(world);

  worldRef.current = world;

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return;

    const game = createGame(containerRef.current);
    gameRef.current = game;

    return () => {
      game.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    const game = gameRef.current;
    if (!game) return;

    const scene = game.scene.getScene("WorldScene") as WorldScene | null;
    if (scene && scene.scene.isActive()) {
      scene.updateWorld(world);
    } else {
      const check = setInterval(() => {
        const s = game.scene.getScene("WorldScene") as WorldScene | null;
        if (s && s.scene.isActive()) {
          s.updateWorld(world);
          clearInterval(check);
        }
      }, 50);
      setTimeout(() => clearInterval(check), 2000);
    }
  }, [world]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-xl border border-border"
      style={{ aspectRatio: "16 / 9", minHeight: 200 }}
    />
  );
}
