import { isDefined } from '../../lib/ramda';
import { Vector2 } from '../math/vector2';
import { MessageBus } from '../message/bus';
import { BaseBehavior } from './base';

export class ScrollBehaviorData implements IBehaviorData {
  name!: string;
  startMessage!: string;
  stopMessage!: string;
  resetMessage!: string;
  minResetY!: number;
  maxResetY!: number;

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

    let minResetY = json.minResetY;
    if (isDefined(minResetY)) {
      this.minResetY = minResetY;
    }

    let maxResetY = json.maxResetY;
    if (isDefined(maxResetY)) {
      this.maxResetY = maxResetY;
    }
  }
}

export class ScrollBehavior extends BaseBehavior {
  startMessage!: string;
  stopMessage!: string;
  resetMessage!: string;
  minResetY!: number;
  maxResetY!: number;

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
    this.minResetY = data.minResetY;
    this.maxResetY = data.maxResetY;

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

    let scrolly = this.minResetY !== undefined && this.maxResetY !== undefined;
    if (
      this.owner.transform.position.x <= this.minPosition.x &&
      (scrolly ||
        (!scrolly && this.owner.transform.position.y <= this.minPosition.y))
    ) {
      this.reset();
    }
  }

  private reset() {
    if (this.minResetY !== undefined && this.maxResetY !== undefined) {
      this.owner.transform.position.set(
        this.resetPosition.x,
        this.getRandomY()
      );
    } else {
      this.owner.transform.position.copyFrom(this.resetPosition.toVector3());
    }
  }
  private initial() {
    this.owner.transform.position.copyFrom(this.initialPosition.toVector3());
  }

  getRandomY() {
    return (
      Math.floor(Math.random() * (this.maxResetY - this.minResetY + 1)) +
      this.minResetY
    );
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
