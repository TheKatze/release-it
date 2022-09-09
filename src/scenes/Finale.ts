import { Application } from "pixi.js";
import { IScene } from "../SceneManager";
import * as Pixi from "pixi.js";

export default class Finale implements IScene {
  init(app: Application): void {
    const catcher = new Pixi.Container();

    const catcherSmile = Pixi.Sprite.from("happiness-face.png");
    catcherSmile.anchor.set(0.5);
    catcherSmile.x += 500;
    catcherSmile.y -= 300;
    const catcherBody = Pixi.Sprite.from("happiness1.png");
    catcherBody.anchor.set(0.5);

    catcher.addChild(catcherSmile);
    catcher.addChild(catcherBody);

    const fin = Pixi.Sprite.from("fin.png");
    fin.anchor.set(0.5);

    catcher.scale.set(0.2);
    catcher.pivot = { x: catcher.width / 2, y: catcher.height / 2 };
    catcher.position = { x: app.screen.width / 2, y: app.screen.height / 2 };
    app.stage.addChild(catcher);

    fin.scale.set(0.2);
    fin.pivot = { x: fin.width / 2, y: fin.height / 2 };
    fin.position = { x: app.screen.width / 2, y: app.screen.height / 6 };
    app.stage.addChild(fin);
  }
  update(_dx: number, _elapsed: number): void {}
}
