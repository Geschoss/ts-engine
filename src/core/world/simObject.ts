import { Shader } from '../gl/shaders/shader';
import { Matrix4x4 } from '../math/matrix4x4';
import { Transform } from '../math/transform';
import { Scene } from './scene';

export class SimObject {
  readonly id: number;
  readonly name: string;
  loaded: boolean = false;
  children: SimObject[] = [];
  components: IComponent[] = [];
  behaviors: IBehavior[] = [];
  scene: Scene;
  parent?: SimObject;

  localMatrix: Matrix4x4 = Matrix4x4.identity();
  worldMatrix: Matrix4x4 = Matrix4x4.identity();

  transform: Transform = new Transform();

  constructor(id: number, name: string, scene: Scene) {
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
  getBehaviortByname(name: string): IBehavior | undefined {
    for (let behavior of this.behaviors) {
      if (behavior.name === name) {
        return behavior;
      }
    }
    for (let child of this.children) {
      let behavior = child.getBehaviortByname(name);
      if (behavior !== undefined) {
        return behavior;
      }
    }
    return undefined;
  }
  getComponentByname(name: string): IComponent | undefined {
    for (let component of this.components) {
      if (component.name === name) {
        return component;
      }
    }
    for (let child of this.children) {
      let component = child.getComponentByname(name);
      if (component !== undefined) {
        return component;
      }
    }
    return undefined;
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
  addComponent(component: IComponent) {
    this.components.push(component);
    component.setOwner(this);
  }
  addBehavior(behavior: IBehavior) {
    this.behaviors.push(behavior);
    behavior.setOwner(this);
  }
  load() {
    this.loaded = true;
    for (let comp of this.components) {
      comp.load();
    }
    for (let child of this.children) {
      child.load();
    }
  }
  updateReady() {
    for (let comp of this.components) {
      comp.updateReady();
    }
    for (let behavior of this.behaviors) {
      behavior.updateReady();
    }
    for (let child of this.children) {
      child.updateReady();
    }
  }
  update(time: number) {
    this.localMatrix = this.transform.getTransformationMatrix();
    this.updateWorldMatrix();
    for (let comp of this.components) {
      comp.update(time);
    }
    for (let behavior of this.behaviors) {
      behavior.update(time);
    }
    for (let child of this.children) {
      child.update(time);
    }
  }
  render(shader: Shader) {
    for (let comp of this.components) {
      comp.render(shader);
    }
    for (let child of this.children) {
      child.render(shader);
    }
  }
  protected onAdded(scene: Scene) {
    this.scene = scene;
  }

  private updateWorldMatrix() {
    if (this.parent !== undefined) {
      this.worldMatrix = Matrix4x4.multiply(
        this.parent.worldMatrix,
        this.localMatrix
      );
    } else {
      this.worldMatrix.copyFrom(this.localMatrix);
    }
  }
}
