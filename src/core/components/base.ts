import { Shader } from '../gl/shaders/shader';
import { SimObject } from '../world/simObject';

export abstract class BaseComponent implements IComponent {
  name!: string;
  owner!: SimObject;
  data!: IComponentData;

  constructor(data: IComponentData) {
    this.data = data;
    this.name = data.name;
  }
  setOwner(owner: SimObject) {
    this.owner = owner;
  }
  load() {}
  
  updateReady() {}
  update(time: number) {}
  render(shader: Shader) {}
}
