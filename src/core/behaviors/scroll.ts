import { isDefined } from '../../lib/ramda';
import { InputManager } from '../input/manager';
import { Vector2 } from '../math/vector2';
import { MessageBus } from '../message/bus';
import { BaseBehavoir } from './base';

export class ScrollBehaviorData implements IBehaviorData {
  name!: string;
  startMessage!: string;
  stopMessage!: string;
  resetMessage!: string;

  velocity: Vector2 = Vector2.zero();
  minPosition: Vector2 = Vector2.zero();
  resetPosition: Vector2 = Vector2.zero();

  setFromJson(json: any): void {
    let name = json.name;
    if (!isDefined(name)) {
      throw new Error('Name must be defined in behavior data.');
    }
    this.name = String(name);

    let startMessage = json.startMessage;
    if (isDefined(startMessage)) {
      this.startMessage = String(startMessage);
    }

    let stopMessage = json.stopMessage;
    if (isDefined(stopMessage)) {
      this.stopMessage = String(stopMessage);
    }

    let resetMessage = json.resetMessage;
    if (isDefined(resetMessage)) {
      this.resetMessage = String(resetMessage);
    }

    let velocity = json.velocity;
    if (!isDefined(velocity)) {
      throw new Error('velocity must be defined in behavior data.');
    }
    this.velocity.setFromJson(velocity);

    let minPosition = json.minPosition;
    if (!isDefined(minPosition)) {
      throw new Error('minPosition must be defined in behavior data.');
    }
    this.minPosition.setFromJson(minPosition);

    let resetPosition = json.resetPosition;
    if (!isDefined(resetPosition)) {
      throw new Error('resetPosition must be defined in behavior data.');
    }
    this.resetPosition.setFromJson(resetPosition);
  }
}

export class ScrollBehavior extends BaseBehavoir {
  startMessage!: string;
  stopMessage!: string;
  resetMessage!: string;

  velocity: Vector2 = Vector2.zero();
  minPosition: Vector2 = Vector2.zero();
  resetPosition: Vector2 = Vector2.zero();

  isScrolling = false;
  initialPosition = Vector2.zero();

  constructor(data: ScrollBehaviorData) {
    super(data);
    this.startMessage = data.startMessage;
    this.stopMessage = data.stopMessage;
    this.resetMessage = data.resetMessage;

    this.velocity.copyFrom(data.velocity);
    this.minPosition.copyFrom(data.minPosition);
    this.resetPosition.copyFrom(data.resetPosition);
  }

  updateReady() {
    super.updateReady();

    if (isDefined(this.startMessage)) {
      MessageBus.subscribe(this.startMessage, () => {
        this.isScrolling = true;
      });
    }
    if (isDefined(this.stopMessage)) {
      MessageBus.subscribe(this.stopMessage, () => {
        this.isScrolling = false;
      });
    }
    if (isDefined(this.resetMessage)) {
      MessageBus.subscribe(this.resetMessage, () => {
        this.initial();
      });
    }

    this.initialPosition.copyFrom(this.owner.transform.position.toVector2());
  }
  update(time: number) {
    if (this.isScrolling) {
      this.owner.transform.position.add(
        this.velocity
          .clone()
          .scale(time / 1000)
          .toVector3()
      );
    }

    if (
      this.owner.transform.position.x <= this.minPosition.x &&
      this.owner.transform.position.y <= this.minPosition.y
    ) {
      this.reset();
    }
    super.update(time);
  }

  private reset() {
    this.owner.transform.position.copyFrom(this.resetPosition.toVector3());
  }
  private initial() {
    this.owner.transform.position.copyFrom(this.initialPosition.toVector3());
  }
}

export class ScrollBehaviorBuilder implements IBehaviorBuilder {
  type = 'scroll';
  buildFromJson(json: any): IBehavior {
    let data = new ScrollBehaviorData();
    data.setFromJson(json);
    return new ScrollBehavior(data);
  }
}
