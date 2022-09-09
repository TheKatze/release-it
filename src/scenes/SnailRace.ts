import { Application } from "pixi.js";
import SceneManager, { IScene } from "../SceneManager";
import * as Pixi from "pixi.js";
import Happiness from "./Happiness";

const opponent = new Pixi.Container();
const opponentSnail1 = Pixi.Sprite.from("sneil1.png");
const opponentSnail2 = Pixi.Sprite.from("sneil2.png");
opponentSnail1.anchor.set(0.5);
opponentSnail2.anchor.set(0.5);

opponent.addChild(opponentSnail1);
opponent.addChild(opponentSnail2);

const player = new Pixi.Container();
const playerSnail1 = Pixi.Sprite.from("sneil1.png");
const playerSnail2 = Pixi.Sprite.from("sneil2.png");
const dead = Pixi.Sprite.from("sneil-dead.png");
playerSnail1.anchor.set(0.5);
playerSnail2.anchor.set(0.5);
dead.anchor.set(0.5);

player.addChild(playerSnail1);
player.addChild(playerSnail2);
player.addChild(dead);
player.interactive = true;

playerSnail2.visible = false;
dead.visible = false;

class SnailRace implements IScene {
  private amountClicks = 0;
  private isDead() {
    return this.amountClicks > 25;
  }

  init(app: Application): void {
    opponent.pivot = { x: opponent.width / 2, y: opponent.height / 2 };
    opponent.scale.set(0.2, 0.2);
    opponent.position = { x: app.screen.width, y: app.screen.height / 2.2 };
    app.stage.addChild(opponent);

    player.pivot = { x: player.width / 2, y: player.height / 2 };
    player.scale.set(0.2, 0.2);
    player.position = { x: app.screen.width / 1.2, y: app.screen.height / 1.8 };
    app.stage.addChild(player);
    player.on("pointerdown", () => {
      if (this.isDead()) return;
      this.amountClicks++;
      player.x -= 3;
      const tick = this.amountClicks % 2 === 1;
      playerSnail1.visible = !tick;
      playerSnail2.visible = tick;

      if (this.isDead()) {
        playerSnail1.visible = false;
        playerSnail2.visible = false;
        dead.visible = true;
        setTimeout(() => {
          SceneManager.push(new Happiness());
        }, 3000);
      }
    });
  }
  update(dx: number, elapsed: number): void {
    opponent.x -= dx;

    const animationSpeed = 50;
    const tick = elapsed % animationSpeed > animationSpeed / 2;
    opponentSnail1.visible = !tick;
    opponentSnail2.visible = tick;
  }
}

export default SnailRace;
