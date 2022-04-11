import { Shader } from '../gl/shaders/shader';
import { Matrix4x4 } from '../math/matrix4x4';
import { Transform } from '../math/transform';
import { Scene } from './scene';

export class SimObject {
  readonly id: number;
  readonly name: string;
  loaded: boolean = false;
  children: SimObject[] = [];
  
  scene?: Scene;
  parent?: SimObject;

  readonly localMatrix: Matrix4x4 = Matrix4x4.identity();
  readonly worldMatrix: Matrix4x4 = Matrix4x4.identity();

  transform: Transform = new Transform();

  constructor(id: number, name: string, scene?: Scene) {
    this.id = id;
    this.name = name;
    this.scene = scene;
  }

  addChild(child: SimObject) {
    child.parent = this;
    this.children.push(child);
    child.onAdded(this.scene);
  }
  removeChild(child: SimObject) {
    let index = this.children.indexOf(child);
    if (index > -1) {
      child.parent = undefined;
      this.children.slice(index, 1);
    }
  }
  getObjectByName(name: string): SimObject | undefined {
    if (this.name === name) {
      return this;
    }
    for (let child of this.children) {
      let result = child.getObjectByName(name);
      if (result !== undefined) {
        return result;
      }
    }
    return undefined;
  }
  load() {
    this.loaded = true;
    for (let child of this.children) {
      child.load();
    }
  }
  update(time: number) {
    for (let child of this.children) {
      child.update(time);
    }
  }
  render(shader: Shader) {
    for (let child of this.children) {
      child.render(shader);
    }
  }
  protected onAdded(scene: Scene) {
    this.scene = scene;
  }
}
