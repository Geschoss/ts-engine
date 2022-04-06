import { MessageBus } from './messageBus';

export class Message implements IMessage {
  code: string;
  context: any;
  sender: any;
  priority: MessagePriority;

  constructor(
    code: string,
    sender: any,
    context?: any,
    priority: MessagePriority = 'NORMAL'
  ) {
    this.code = code;
    this.sender = sender;
    this.context = context;
    this.priority = priority;
  }

  static send(code: string, sender: any, context?: any) {
    MessageBus.post(new Message(code, sender, context));
  }
  static sendPiority(code: string, sender: any, context?: any) {
    MessageBus.post(new Message(code, sender, context, 'HIGH'));
  }
  static subscribe(code: string, handler: IMessageHandler) {
    MessageBus.addSubscription(code, handler);
  }
  static unsubscribe(code: string, handler: IMessageHandler) {
    MessageBus.removeSubscription(code, handler);
  }
}
