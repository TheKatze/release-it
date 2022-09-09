import { Application } from "pixi.js";
import SceneManager, { IScene } from "../SceneManager";
import * as Pixi from "pixi.js";
import CleanOrDirty from "./CleanOrDirty";

export default class GrumpyMonk implements IScene {
  private movementMultiplier = 1;
  private flying = false;
  private flyingTime = 0;
  private hitCount = 0;
  private timescale = 1;

  private stone: Pixi.Sprite;
  private monk: Pixi.Container;
  private zen: Pixi.Sprite;
  private mad: Pixi.Sprite;
  private pissed: Pixi.Sprite;
  private angery: Pixi.Sprite;
  private fire: Pixi.Sprite;

  constructor() {
    this.stone = Pixi.Sprite.from("stone.png");
    this.monk = new Pixi.Container();
    this.zen = Pixi.Sprite.from("monk-zen.png");
    this.mad = Pixi.Sprite.from("monk-mad.png");
    this.pissed = Pixi.Sprite.from("monk-pissed.png");
    this.angery = Pixi.Sprite.from("monk-angery.png");
    this.fire = Pixi.Sprite.from("fire.png");
  }

  init(app: Application): void {
    const background = new Pixi.Sprite(Pixi.Texture.WHITE);
    background.interactive = true;

    this.zen.anchor.set(0.5);
    this.mad.anchor.set(0.5);
    this.pissed.anchor.set(0.5);
    this.angery.anchor.set(0.5);
    this.fire.anchor.set(0.5);

    this.mad.visible = false;
    this.pissed.visible = false;
    this.angery.visible = false;
    this.fire.visible = false;

    this.monk.addChild(this.zen);
    this.monk.addChild(this.mad);
    this.monk.addChild(this.pissed);
    this.monk.addChild(this.angery);
    this.monk.addChild(this.fire);

    this.stone.anchor.set(0.5);
    this.stone.scale.set(0.1);
    this.stone.visible = false;

    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    this.monk.pivot = { x: this.monk.width / 2, y: this.monk.height / 2 };
    this.monk.scale.set(0.2, 0.2);
    this.monk.position = { x: app.screen.width / 2, y: app.screen.height / 2 };
    app.stage.addChild(this.monk);

    app.stage.addChild(this.stone);

    background.on("click", (event: Pixi.InteractionEvent) => {
      if (this.flying) return;
      this.flying = true;
      this.flyingTime = 0;

      this.stone.scale.set(0.1);
      this.stone.x = event.data.global.x;
      this.stone.y = event.data.global.y;
    });
  }
  update(dx: number, elapsed: number): void {
    this.monk.x -=
      Math.cos((elapsed * this.timescale) / 40) * 1.2 * this.movementMultiplier;
    this.monk.y +=
      Math.cos((elapsed * this.timescale) / 20) * 0.5 * this.movementMultiplier;

    this.stone.visible = this.flying;
    if (this.flying) {
      this.flyingTime += dx;
      this.stone.scale.set(this.stone.scale.x * 0.95);
      this.stone.y -= Math.sin((this.flyingTime + 5) / 10) * 10;
    }

    if (this.flyingTime >= 50 && this.flying) {
      this.flying = false;
      this.stone.visible = false;

      const hit = this.stone.getBounds().intersects(this.monk.getBounds());

      if (hit && this.hitCount < 4) {
        this.hitCount++;
        this.zen.visible = false;
        this.mad.visible = false;
        this.pissed.visible = false;
        this.angery.visible = false;

        switch (this.hitCount) {
          case 1:
            this.mad.visible = true;
            this.movementMultiplier = 4;
            break;
          case 2:
            this.pissed.visible = true;
            this.movementMultiplier = 8;
            break;
          case 3:
            this.angery.visible = true;
            this.movementMultiplier = 10;
            break;
          case 4:
            this.angery.visible = true;
            this.fire.visible = true;
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
