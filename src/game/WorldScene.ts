import Phaser from "phaser";
import { LOCATION_VISUALS, getEmoji, inventoryEmoji } from "./config";
import type { WorldState } from "@/types/world";

export class WorldScene extends Phaser.Scene {
  private bg!: Phaser.GameObjects.Rectangle;
  private decos: Phaser.GameObjects.Text[] = [];
  private char!: Phaser.GameObjects.Text;
  private itemSprites: Phaser.GameObjects.Text[] = [];
  private locLabel!: Phaser.GameObjects.Text;
  private currentLocation = "";
  private currentEmoji = "";
  private floatingTween: Phaser.Tweens.Tween | null = null;
  private entranceTween: Phaser.Tweens.Tween | null = null;

  constructor() {
    super({ key: "WorldScene" });
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.bg = this.add.rectangle(w / 2, h / 2, w, h, 0x0a0a0f);
    this.bg.setOrigin(0.5);

    this.locLabel = this.add.text(w / 2, 10, "", {
      fontSize: "11px",
      color: "#6b6b80",
      fontFamily: "sans-serif",
    });
    this.locLabel.setOrigin(0.5, 0);

    this.char = this.add.text(w / 2, h * 0.65, "", {
      fontSize: "36px",
    });
    this.char.setOrigin(0.5);
    this.char.setScale(0);

    this.currentLocation = "";
    this.currentEmoji = "";
  }

  updateWorld(world: WorldState) {
    const w = this.scale.width;
    const h = this.scale.height;
    const locName = world.location.name;

    if (locName !== this.currentLocation) {
      this.currentLocation = locName;
      this.renderLocation(locName, w, h);
    }

    const emoji = getEmoji(world.player.profession);
    if (emoji !== this.currentEmoji) {
      this.currentEmoji = emoji;
      this.char.setText(emoji);
      this.playEntranceAnimation();
    }

    this.renderInventory(world.inventory, w, h);
  }

  private playEntranceAnimation() {
    if (this.entranceTween) {
      this.entranceTween.stop();
      this.entranceTween = null;
    }

    this.char.setScale(0);
    this.char.setAlpha(1);

    this.entranceTween = this.tweens.add({
      targets: this.char,
      scale: { from: 0, to: 1 },
      duration: 400,
      ease: "Back.easeOut",
      onComplete: () => {
        this.entranceTween = null;
        this.startIdleFloat();
      },
    });
  }

  private startIdleFloat() {
    if (this.floatingTween) return;

    this.floatingTween = this.tweens.add({
      targets: this.char,
      y: this.char.y - 4,
      duration: 1800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });
  }

  private stopIdleFloat() {
    if (this.floatingTween) {
      this.floatingTween.stop();
      this.floatingTween = null;
    }
  }

  private renderLocation(locName: string, w: number, h: number) {
    const vis = LOCATION_VISUALS[locName];
    const bgColor = vis ? vis.bg : 0x0a0a0f;

    // Fade transition
    this.tweens.add({
      targets: this.bg,
      alpha: 0,
      duration: 300,
      onComplete: () => {
        this.bg.setFillStyle(bgColor);
        this.tweens.add({
          targets: this.bg,
          alpha: 1,
          duration: 300,
        });
      },
    });

    this.locLabel.setText(locName);

    // Remove old decos
    this.decos.forEach((d) => d.destroy());
    this.decos = [];

    // Add new decos
    if (vis) {
      vis.decos.forEach((deco) => {
        const t = this.add.text(w * deco.x, h * deco.y, deco.emoji, {
          fontSize: "24px",
        });
        t.setOrigin(0.5);
        this.decos.push(t);
      });
    }
  }

  private renderInventory(inventory: string[], w: number, h: number) {
    this.itemSprites.forEach((s) => s.destroy());
    this.itemSprites = [];

    const items = inventory.slice(0, 4);
    items.forEach((item, i) => {
      const x = 30 + i * 36;
      const y = h - 30;
      const t = this.add.text(x, y, inventoryEmoji(item), {
        fontSize: "18px",
      });
      t.setOrigin(0.5);
      this.itemSprites.push(t);
    });
  }
}
