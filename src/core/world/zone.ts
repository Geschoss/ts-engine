import { Shader } from '../gl/shaders/shader';
import { Scene } from './scene';
export type ZoneState = 'UNINITIALIZED' | 'LOADING' | 'UPDATING';
export class Zone {
  id: number;
  name: string;
  description: string;
  scene: Scene;
  state: ZoneState;
  constructor(id: number, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.scene = new Scene();
    this.state = 'UNINITIALIZED';
  }
  load() {
    this.state = 'LOADING';
    this.scene.load();
    this.state = 'UPDATING';
  }
  update(time: number) {
    if (this.state === 'UPDATING') {
      this.scene.update(time);
    }
  }
  render(shader: Shader) {
    if (this.state === 'UPDATING') {
      this.scene.render(shader);
    }
  }
  
  unload() {}
  onActivated() {}
  onDeactivated() {}
}
