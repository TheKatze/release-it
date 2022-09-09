import { Application } from "pixi.js";
import SceneManager, { IScene } from "../SceneManager";
import * as Pixi from "pixi.js";
import Finale from "./Finale";

export default class CleanOrDirty implements IScene {
  private open = false;
  private win = false;
  init(app: Application): void {
    const background = new Pixi.Sprite(Pixi.Texture.WHITE);
    background.interactive = true;

    const dishwasher = new Pixi.Container();
    const dishwasherPrompt = Pixi.Sprite.from("cleanordirty.png");
    dishwasherPrompt.anchor.set(0.5);
    const dishwasherClean = Pixi.Sprite.from("cleanordirty-clean.png");
    dishwasherClean.anchor.set(0.5);
    const dishwasherDirty = Pixi.Sprite.from("cleanordirty-dirty.png");
    dishwasherDirty.anchor.set(0.5);

    dishwasherClean.visible = false;
    dishwasherDirty.visible = false;

    dishwasher.addChild(dishwasherPrompt);
    dishwasher.addChild(dishwasherClean);
    dishwasher.addChild(dishwasherDirty);
    background.width = app.screen.width;
    background.height = app.screen.height;
    app.stage.addChild(background);

    dishwasher.pivot = { x: dishwasher.width / 2, y: dishwasher.height / 2 };
    dishwasher.position = { x: app.screen.width / 2, y: app.screen.height / 2 };
    dishwasher.scale.set(0.2, 0.2);
    app.stage.addChild(dishwasher);

    background.on("click", () => {
      if (this.open || this.win) return;

      this.open = true;
      dishwasherPrompt.visible = false;

      const clean = Math.random() > 0.5;

      if (clean) {
        dishwasherClean.visible = true;
      } else {
        dishwasherDirty.visible = true;
      }

      setTimeout(() => {
        SceneManager.push(new Finale());
      }, 2000);
    });
  }
  update(_dx: number, _elapsed: number): void {}
}
