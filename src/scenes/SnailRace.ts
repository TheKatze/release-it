import { Application } from "pixi.js";
import SceneManager, { IScene } from "../SceneManager";
import * as Pixi from "pixi.js";
import Happiness from "./Happiness";

class SnailRace implements IScene {
  private amountClicks = 0;
  private isDead() {
    return this.amountClicks > 25;
  }

  private opponent: Pixi.Container;
  private opponentSnail1: Pixi.Sprite;
  private opponentSnail2: Pixi.Sprite;
  private player: Pixi.Container;
  private playerSnail1: Pixi.Sprite;
  private playerSnail2: Pixi.Sprite;
  private dead: Pixi.Sprite;

  constructor() {
    this.opponent = new Pixi.Container();
    this.opponentSnail1 = Pixi.Sprite.from("sneil1.png");
    this.opponentSnail2 = Pixi.Sprite.from("sneil2.png");
    this.player = new Pixi.Container();
    this.playerSnail1 = Pixi.Sprite.from("sneil1.png");
    this.playerSnail2 = Pixi.Sprite.from("sneil2.png");
    this.dead = Pixi.Sprite.from("sneil-dead.png");
  }

  init(app: Application): void {
    this.opponentSnail1.anchor.set(0.5);
    this.opponentSnail2.anchor.set(0.5);

    this.opponent.addChild(this.opponentSnail1);
    this.opponent.addChild(this.opponentSnail2);

    this.playerSnail1.anchor.set(0.5);
    this.playerSnail2.anchor.set(0.5);
    this.dead.anchor.set(0.5);

    this.player.addChild(this.playerSnail1);
    this.player.addChild(this.playerSnail2);
    this.player.addChild(this.dead);
    this.player.interactive = true;

    this.playerSnail2.visible = false;
    this.dead.visible = false;
    this.opponent.pivot = {
      x: this.opponent.width / 2,
      y: this.opponent.height / 2,
    };
    this.opponent.scale.set(0.2, 0.2);
    this.opponent.position = {
      x: app.screen.width,
      y: app.screen.height / 2.2,
    };
    app.stage.addChild(this.opponent);

    this.player.pivot = { x: this.player.width / 2, y: this.player.height / 2 };
    this.player.scale.set(0.2, 0.2);
    this.player.position = {
      x: app.screen.width / 1.2,
      y: app.screen.height / 1.8,
    };
    app.stage.addChild(this.player);
    this.player.on("pointerdown", () => {
      if (this.isDead()) return;
      this.amountClicks++;
      this.player.x -= 3;
      const tick = this.amountClicks % 2 === 1;
      this.playerSnail1.visible = !tick;
      this.playerSnail2.visible = tick;

      if (this.isDead()) {
        this.playerSnail1.visible = false;
        this.playerSnail2.visible = false;
        this.dead.visible = true;
        setTimeout(() => {
          SceneManager.push(new Happiness());
        }, 3000);
      }
    });
  }
  update(dx: number, elapsed: number): void {
    this.opponent.x -= dx;

    const animationSpeed = 50;
    const tick = elapsed % animationSpeed > animationSpeed / 2;
    this.opponentSnail1.visible = !tick;
    this.opponentSnail2.visible = tick;
  }
}

export default SnailRace;
