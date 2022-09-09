import { Application } from "pixi.js";
import SceneManager, { IScene } from "../SceneManager";
import * as Pixi from "pixi.js";
import GrumpyMonk from "./GrumpyMonk";

export default class Happiness implements IScene {
  public catching = false;
  public timeout = false;
  public move = Math.cos;

  public location = { x: 0, y: 0 };

  private setMouseLocation(mouse: MouseEvent) {
    this.location = { x: mouse.x, y: mouse.y };
  }

  private catcher: Pixi.Container;
  private happiness: Pixi.Sprite;
  private catcher1: Pixi.Sprite;
  private catcher2: Pixi.Sprite;

  constructor() {
    this.catcher = new Pixi.Container();
    this.happiness = Pixi.Sprite.from("happiness-face.png");

    this.catcher1 = Pixi.Sprite.from("happiness1.png");
    this.catcher2 = Pixi.Sprite.from("happiness2.png");
  }

  init(app: Application): void {
    this.happiness.anchor.set(0.5);
    this.catcher1.anchor.set(0.5);
    this.catcher2.anchor.set(0.0, 0.5);

    this.catcher.addChild(this.catcher1);
    this.catcher.addChild(this.catcher2);

    const background = new Pixi.Sprite(Pixi.Texture.WHITE);
    background.interactive = true;

    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    this.catcher.pivot = {
      x: this.catcher.width / 2,
      y: this.catcher.height / 2,
    };
    this.catcher.scale.set(0.2, 0.2);
    this.location = { x: app.screen.width / 2, y: app.screen.height / 2 };
    this.catcher.position = this.location;
    app.stage.addChild(this.catcher);

    this.happiness.position = {
      x: app.screen.width / 2,
      y: app.screen.height / 2,
    };
    this.happiness.scale.set(0.2, 0.2);
    app.stage.addChild(this.happiness);

    this.catcher2.visible = false;

    window.addEventListener("mousemove", this.setMouseLocation.bind(this));

    background.on("click", () => {
      if (this.timeout) return;

      this.catching = true;
      this.timeout = true;

      setTimeout(() => (this.catching = false), 200);
      setTimeout(() => (this.timeout = false), 500);
    });

    setTimeout(() => {
      window.removeEventListener("mousemove", this.setMouseLocation);
      SceneManager.push(new GrumpyMonk());
    }, 10000);
  }

  update(_dx: number, elapsed: number): void {
    this.catcher1.visible = !this.catching;
    this.catcher2.visible = this.catching;

    this.happiness.x -= this.move(elapsed / 40) * 5;
    this.happiness.y += this.move(elapsed / 20) * 3;

    this.catcher.position = this.location;

    if (this.catching) {
      const xOffset = 280;
      const yOffset = -80;
      const hitbox = new Pixi.Rectangle(
        this.location.x + xOffset,
        this.location.y + yOffset,
        10,
        10
      );
      if (this.happiness.getBounds().intersects(hitbox)) {
        this.move = Math.sin;
        this.happiness.x += 150;
        this.happiness.y -= 70;
      }
    }
  }
}
