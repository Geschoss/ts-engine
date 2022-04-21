import { isDefined } from '../../lib/ramda';
import { InputManager } from '../input/manager';
import { BaseBehavoir } from './base';

export class KeyboardBehaviorData implements IBehaviorData {
  name!: string;
  speed: number = 0.1;

  setFromJson(json: any): void {
    let name = json.name;
    if (!isDefined(name)) {
      throw new Error('Name must be defined in behavior data.');
    }
    this.name = String(name);
    let speed = json.speed;
    if (isDefined(speed)) {
      this.speed = speed;
    }
  }
}

export class KeyboardBehavior extends BaseBehavoir {
  speed: number = 0.1;
  constructor(data: KeyboardBehaviorData) {
    super(data);
    this.speed = data.speed;
  }
  update(time: number) {
    if (InputManager.isKeyDown(InputManager.Keys.LEFT)) {
      this.owner.transform.position.x -= this.speed;
    }
    if (InputManager.isKeyDown(InputManager.Keys.RIGHT)) {
      this.owner.transform.position.x += this.speed;
    }
    if (InputManager.isKeyDown(InputManager.Keys.UP)) {
      this.owner.transform.position.y -= this.speed;
    }
    if (InputManager.isKeyDown(InputManager.Keys.DOWN)) {
      this.owner.transform.position.y += this.speed;
    }
    super.update(time);
  }
}

export class KeyboardBehaviorBuilder implements IBehaviorBuilder {
  type = 'keyboard';
  buildFromJson(json: any): IBehavior {
    let data = new KeyboardBehaviorData();
    data.setFromJson(json);
    return new KeyboardBehavior(data);
  }
}
