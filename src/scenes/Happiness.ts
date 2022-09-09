import { Application } from "pixi.js";
import SceneManager, { IScene } from "../SceneManager";
import * as Pixi from "pixi.js";
import GrumpyMonk from "./GrumpyMonk";

const catcher = new Pixi.Container();

const background = new Pixi.Sprite(Pixi.Texture.WHITE);
background.interactive = true;

const happiness = Pixi.Sprite.from("happiness-face.png");

happiness.anchor.set(0.5);

const catcher1 = Pixi.Sprite.from("happiness1.png");
catcher1.anchor.set(0.5);
const catcher2 = Pixi.Sprite.from("happiness2.png");
catcher2.anchor.set(0.0, 0.5);
catcher2.visible = false;

catcher.addChild(catcher1);
catcher.addChild(catcher2);

export default class Happiness implements IScene {
  public catching = false;
  public timeout = false;

  public location = { x: 0, y: 0 };

  private setMouseLocation(mouse: MouseEvent) {
    this.location = { x: mouse.x, y: mouse.y };
  }

  init(app: Application): void {
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    catcher.pivot = { x: catcher.width / 2, y: catcher.height / 2 };
    catcher.scale.set(0.2, 0.2);
    catcher.position = { x: app.screen.width / 4, y: app.screen.height / 2 };
    app.stage.addChild(catcher);

    happiness.position = { x: app.screen.width / 2, y: app.screen.height / 2 };
    happiness.scale.set(0.2, 0.2);
    app.stage.addChild(happiness);

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
    catcher1.visible = !this.catching;
    catcher2.visible = this.catching;

    happiness.x -= Math.cos(elapsed / 40) * 5;
    happiness.y += Math.cos(elapsed / 20) * 3;

    catcher.x = this.location.x;
    catcher.y = this.location.y;
  }
}
