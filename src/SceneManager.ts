import * as Pixi from "pixi.js";

class SceneManager {
  private scenes: IScene[] = [];
  private elapsed = 0;

  constructor(public app: Pixi.Application) {}

  push(scene: IScene, replace: boolean = true) {
    app.stage.removeChildren();
    this.elapsed = 0;
    scene.init(app);
    this.scenes.splice(0, replace ? 1 : 0, scene);
  }

  update(dx: number) {
    this.elapsed += dx;
    this.scenes[0]?.update(dx, this.elapsed);
  }
}

export interface IScene {
  init(app: Pixi.Application): void;
  update(dx: number, elapsed: number): void;
}

const app = new Pixi.Application({
  antialias: true,
  backgroundColor: 0xffffff,
  resizeTo: window,
});

document.body.appendChild(app.view);

const manager = new SceneManager(app);

app.ticker.add((dt) => {
  manager.update(dt);
});

export default manager;
