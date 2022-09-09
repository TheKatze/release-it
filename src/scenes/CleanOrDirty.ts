import { Application } from "pixi.js";
import { IScene } from "../SceneManager";

export default class CleanOrDirty implements IScene {
  init(_app: Application): void {}
  update(_dx: number, _elapsed: number): void {}
}
