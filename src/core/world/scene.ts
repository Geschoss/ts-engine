import { Shader } from '../gl/shaders/shader';
import { SimObject } from './simObject';

export class Scene {
  root: SimObject;
  constructor() {
    this.root = new SimObject(0, '__ROOT__', this);
  }

  get loaded() {
    return this.root.loaded;
  }

  addObject(object: SimObject) {
    this.root.addChild(object);
  }
  getObjectByName(name: string) {
    return this.root.getObjectByName(name);
  }
  load() {
    this.root.load();
  }
  update(time: number) {
    this.root.update(time);
  }
  render(shader: Shader) {
    this.root.render(shader);
  }
}
