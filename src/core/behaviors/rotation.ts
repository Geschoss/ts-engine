import { isDefined } from '../../lib/ramda';
import { Vector3 } from '../math/vector3';
import { BaseBehavior } from './base';

export class RotationBehaviorData implements IBehaviorData {
  name!: string;
  rotation: Vector3 = Vector3.zero();

  setFromJson(json: any): void {
    let name = json.name;
    if (!isDefined(name)) {
      throw new Error('Name must be defined in behavior data.');
    }
    this.name = String(name);
    let rotation = json.rotation;
    if (isDefined(rotation)) {
      this.rotation.setFromJson(rotation);
    }
  }
}

export class RotationBehavior extends BaseBehavior {
  private rotation: Vector3;
  constructor(data: RotationBehaviorData) {
    super(data);
    this.rotation = data.rotation;
  }
  update(time: number) {
    this.owner.transform.rotation.add(this.rotation);
    super.update(time);
  }
}

export class RotationBehaviorBuilder implements IBehaviorBuilder {
  type = 'rotation';
  buildFromJson(json: any): IBehavior {
    let data = new RotationBehaviorData();
    data.setFromJson(json);
    return new RotationBehavior(data);
  }
}
