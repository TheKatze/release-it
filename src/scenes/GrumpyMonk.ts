import { Application } from "pixi.js";
import SceneManager, { IScene } from "../SceneManager";
import * as Pixi from "pixi.js";
import CleanOrDirty from "./CleanOrDirty";

const monk = new Pixi.Container();

const background = new Pixi.Sprite(Pixi.Texture.WHITE);
background.interactive = true;

const zen = Pixi.Sprite.from("monk-zen.png");
const mad = Pixi.Sprite.from("monk-mad.png");
const pissed = Pixi.Sprite.from("monk-pissed.png");
const angery = Pixi.Sprite.from("monk-angery.png");
const fire = Pixi.Sprite.from("fire.png");

zen.anchor.set(0.5);
mad.anchor.set(0.5);
pissed.anchor.set(0.5);
angery.anchor.set(0.5);
fire.anchor.set(0.5);

mad.visible = false;
pissed.visible = false;
angery.visible = false;
fire.visible = false;

monk.addChild(zen);
monk.addChild(mad);
monk.addChild(pissed);
monk.addChild(angery);
monk.addChild(fire);

const stone = Pixi.Sprite.from("stone.png");
stone.anchor.set(0.5);
stone.scale.set(0.1);
stone.visible = false;

export default class GrumpyMonk implements IScene {
  private movementMultiplier = 1;
  private flying = false;
  private flyingTime = 0;
  private hitCount = 0;
  private timescale = 1;

  init(app: Application): void {
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    monk.pivot = { x: monk.width / 2, y: monk.height / 2 };
    monk.scale.set(0.2, 0.2);
    monk.position = { x: app.screen.width / 2, y: app.screen.height / 2 };
    app.stage.addChild(monk);

    app.stage.addChild(stone);

    background.on("click", (event: Pixi.InteractionEvent) => {
      if (this.flying) return;
      this.flying = true;
      this.flyingTime = 0;

      stone.scale.set(0.1);
      stone.x = event.data.global.x;
      stone.y = event.data.global.y;
    });
  }
  update(dx: number, elapsed: number): void {
    monk.x -=
      Math.cos((elapsed * this.timescale) / 40) * 1.2 * this.movementMultiplier;
    monk.y +=
      Math.cos((elapsed * this.timescale) / 20) * 0.5 * this.movementMultiplier;

    stone.visible = this.flying;
    if (this.flying) {
      this.flyingTime += dx;
      stone.scale.set(stone.scale.x * 0.95);
      stone.y -= Math.sin((this.flyingTime + 5) / 10) * 10;
    }

    if (this.flyingTime >= 50 && this.flying) {
      this.flying = false;
      stone.visible = false;

      const hit = stone.getBounds().intersects(monk.getBounds());

      if (hit && this.hitCount < 4) {
        this.hitCount++;
        zen.visible = false;
        mad.visible = false;
        pissed.visible = false;
        angery.visible = false;

        switch (this.hitCount) {
          case 1:
            mad.visible = true;
            this.movementMultiplier = 4;
            break;
          case 2:
            pissed.visible = true;
            this.movementMultiplier = 8;
            break;
          case 3:
            angery.visible = true;
            this.movementMultiplier = 10;
            break;
          case 4:
            angery.visible = true;
            fire.visible = true;
            this.movementMultiplier = 2;
            this.timescale = 40;
            setTimeout(() => {
              SceneManager.push(new CleanOrDirty());
            }, 2000);
            break;
        }
      }
    }
  }
}
