import Phaser from "phaser";
import { WorldScene } from "./WorldScene";

export function createGame(container: HTMLDivElement): Phaser.Game {
  const rect = container.getBoundingClientRect();
  const width = Math.min(rect.width, 800);
  const height = Math.round(width * 0.5625);

  return new Phaser.Game({
    type: Phaser.AUTO,
    parent: container,
    width,
    height,
    backgroundColor: "#0a0a0f",
    scene: [WorldScene],
    scale: {
      mode: Phaser.Scale.NONE,
    },
  });
}
