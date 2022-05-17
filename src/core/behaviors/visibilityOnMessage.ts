import { pickOrError } from '../../lib/ramda';
import { MessageBus } from '../message/bus';
import { BaseBehavior } from './base';

export class VisibilityOnMessageBehaviorData implements IBehaviorData {
  name!: string;
  messageCode!: string;
  visible!: boolean;
  setFromJson(json: any) {
    this.name = pickOrError<string>(
      'name',
      'Name must be defined in behavior data.',
      json
    );
    this.messageCode = pickOrError<string>(
      'messageCode',
      "VisibilityOnMessageBehaviorData requires 'messageCode' to be defined",
      json
    );

    this.visible = pickOrError<boolean>(
      'visible',
      "VisibilityOnMessageBehaviorData requires 'messageCode' to be defined",
      json
    );
  }
}

export class VisibilityOnMessageBehaviorBuilder implements IBehaviorBuilder {
  type = 'visibilityOnMessage';
  buildFromJson(json: any) {
    let data = new VisibilityOnMessageBehaviorData();
    data.setFromJson(json);
    return new VisibilityOnMessageBehavior(data);
  }
}

export class VisibilityOnMessageBehavior extends BaseBehavior {
  messageCode: string;
  visible: boolean;
  constructor(data: VisibilityOnMessageBehaviorData) {
    super(data);
    this.messageCode = data.messageCode;
    this.visible = data.visible;
    MessageBus.subscribe(this.messageCode, (message) => {
      if (message.code === this.messageCode) {
        this.owner.isVisible = this.visible;
      }
    });
  }
}
