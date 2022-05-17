import { isDefined } from "../../lib/ramda";
import { Vector2 } from "../math/vector2";
import { MessageBus } from "../message/bus";
import { BaseBehavior } from "./base";

type MouseContext = {
  position: Vector2
}

export class MouseClickBehaviorData implements IBehaviorData {
  name!: string;
  width!: number;
  height!: number;
  messageCode!: string;
  
  setFromJson(json: any) {
    const name = json.name;
    if (!isDefined(name)) {
      throw new Error(`Name must be defined in behavior data.`)
    }
    this.name = String(name);
    
    const width = json.width;
    if (!isDefined(width)) {
      throw new Error("Width must be defined in behavior data.");
    }
    this.width = Number(width);

    const height = json.height;
    if (!isDefined(height)) {
      throw new Error("Height must be defined in behavior data.");
    }
    this.height = Number(height);

    const messageCode = json.messageCode;
    if (!isDefined(messageCode)) {
      throw new Error("messageCode must be defined in behavior data.");
    }
    this.messageCode = String(messageCode);
  }
} 

export class MouseClickBehaviorBuilder implements IBehaviorBuilder {
  type = 'mouseClick';
  buildFromJson(json: any) {
    let data = new MouseClickBehaviorData();
    data.setFromJson(json);
    return new MouseClickBehavior(data);
  }
}

export class MouseClickBehavior extends BaseBehavior {
  width!: number;
  height!: number;
  messageCode!: string;
  constructor(data: MouseClickBehaviorData) {
    super(data);
    this.width = data.width;
    this.height = data.height;
    this.messageCode = data.messageCode;
    MessageBus.subscribe("MOUSE_UP", (message: IMessage) => {
      if (!this.owner.isVisible) {
        return;
      }
      let context = message.context as MouseContext;
      let worldPos = this.owner.getWorldPosition();
      let extentsX = worldPos.x + this.width;
      let extentsY = worldPos.y + this.height;
      if (context.position.x >= worldPos.x && context.position.x <= extentsX &&
        context.position.y >= worldPos.y && context.position.y <= extentsY) {
          MessageBus.send(this.messageCode, this)
        }
    })
  }
}