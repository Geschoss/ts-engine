import { isDefined } from '../../lib/ramda';
import { BehaviorManager } from '../behaviors/manager';
import { ComponentManager } from '../components/manager';
import { Shader } from '../gl/shaders/shader';
import { Scene } from './scene';
import { SimObject } from './simObject';

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
  initialize(fileData: IZoneData) {
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
    this.scene.root.updateReady();

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

  private loadSimObject(dataSections: ISimObjectJson, parent: SimObject) {
    let name = dataSections.name;
    if (!isDefined(name)) {
      name = '';
      console.warn(`Zone has not name.`);
    }
    let simObject = new SimObject(this.globalID++, name, this.scene);

    let transform = dataSections.transform;
    if (isDefined(transform)) {
      simObject.transform.setFromJson(transform);
    }

    let components = dataSections.components;
    if (isDefined(components)) {
      for (let componentData of components) {
        let component = ComponentManager.extractComponent(componentData);
        simObject.addComponent(component);
      }
    }

    let behaviors = dataSections.behaviors;
    if (isDefined(behaviors)) {
      for (let behaviorData of behaviors) {
        let behavior = BehaviorManager.extractBehavior(behaviorData);
        simObject.addBehavior(behavior);
      }
    }

    let children = dataSections.children;
    if (isDefined(children)) {
      for (let object of children) {
        this.loadSimObject(object, simObject);
      }
    }

    if (isDefined(parent)) {
      parent.addChild(simObject);
    }
  }
}
