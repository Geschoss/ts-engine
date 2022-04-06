import { MessageSubscriptionNode } from './messageSubscriptionNode';

export class MessageBus {
  private static subscriptiions: Map<string, IMessageHandler[]> = new Map();
  private static normalMessageQueue: MessageSubscriptionNode[] = [];
  private static normalQueueMessagePerUpdate: number = 10;

  private constructor() {}

  static addSubscription(code: string, handler: IMessageHandler) {
    let handlers = MessageBus.subscriptiions.get(code);
    if (!handlers) {
      handlers = [];
      MessageBus.subscriptiions.set(code, handlers);
    }
    if (handlers.indexOf(handler)) {
      console.warn(`Attempting to add a duplicate handler to code ${code}`);
    } else {
      handlers.push(handler);
    }
  }

  static removeSubscription(code: string, handler: IMessageHandler) {
    let handlers = MessageBus.subscriptiions.get(code);
    if (!handlers) {
      console.warn(
        `Cannot unsubscribe handler from code ${code}. Becaus that code is not subscribed to.`
      );
      return;
    }
    let nodeIndex = handlers.indexOf(handler);
    if (nodeIndex !== -1) {
      handlers.splice(nodeIndex, 1);
    }
  }

  static post(message: IMessage) {
    console.log('Message posted:');
    console.log({ message });

    let handlers = MessageBus.subscriptiions.get(message.code);
    if (!handlers) {
      console.warn(`Cannot find handlers for ${message.code}`);
      return;
    }
    for (let h of handlers) {
      if (message.priority === 'HIGH') {
        h.onMessage(message);
      } else {
        MessageBus.normalMessageQueue.push(
          new MessageSubscriptionNode(message, h)
        );
      }
    }
  }

  static update(time: number) {
    if (MessageBus.normalMessageQueue.length === 0) {
      return;
    }

    let messageLimit = Math.min(
      MessageBus.normalQueueMessagePerUpdate,
      MessageBus.normalMessageQueue.length
    );

    for (let i = 0; i < messageLimit; i++) {
      let node = MessageBus.normalMessageQueue.pop();
      node?.handler.onMessage(node.message);
    }
  }
}
