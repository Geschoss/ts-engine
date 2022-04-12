import { Shader } from '../gl/shaders/shader';
import { SimObject } from '../world/simObject';

export abstract class BaseComponent {
  name!: string;
  owner!: SimObject;
  constructor(name: string) {}
  setOwner(owner: SimObject) {
    this.owner = owner;
  }
  load() {}
  update(time: number) {}
  render(shader: Shader) {}
}
