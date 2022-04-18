import { Shader } from '../gl/shaders/shader';
import { Scene } from './scene';
import { SimObject } from './simObject';

type SibObject = Partial<{
  name?: string;
  transform?: TransformJson;
  children?: SibObject[];
}>;
type ZoneData = {
  objects?: SibObject[];
};
export type ZoneState = 'UNINITIALIZED' | 'LOADING' | 'UPDATING';
export class Zone {
  id: number;
  name: string;
  description: string;
  scene: Scene;
  state: ZoneState;
  globalID: number = 0;

  constructor(id: number, name: string, description: string) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.scene = new Scene();
    this.state = 'UNINITIALIZED';
  }
  initialize(fileData: ZoneData) {
    let objects = fileData.objects;
    if (objects === undefined) {
      throw new Error(`Zone initialization error: objects not present.`);
    } else {
      for (let object of objects) {
        this.loadSimObject(object, this.scene.root);
      }
    }
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

  private loadSimObject(dataSections: SibObject, parent: SimObject) {
    let name = dataSections.name;
    if (name === undefined) {
      name = '';
      console.warn(`Zone has not name.`);
    }
    let simObject = new SimObject(this.globalID++, name, this.scene);

    let transform = dataSections.transform;
    if (transform !== undefined) {
      simObject.transform.setFromJson(transform);
    }

    let children = dataSections.children;
    if (children !== undefined) {
      for (let object of children) {
        this.loadSimObject(object, simObject);
      }
    }

    if (parent !== undefined) {
      parent.addChild(simObject);
    }
  }
}
