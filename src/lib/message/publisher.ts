import { isDefined } from '../ramda';

type PublisherConf = {
  subscriptions: Map<string, IMessageHandler[]>;
  messageQueue?: IMessage[];
  queueMessagePerUpdate?: number;
};

export class Publisher implements IPublisher {
  subscriptions: Map<string, IMessageHandler[]>;
  messageQueue: IMessage[];
  queueMessagePerUpdate: number;

  constructor({
    subscriptions,
    messageQueue = [],
    queueMessagePerUpdate = 10,
  }: PublisherConf) {
    this.subscriptions = subscriptions;
    this.messageQueue = messageQueue;
    this.queueMessagePerUpdate = queueMessagePerUpdate;
  }

  private notify(message: IMessage) {
    let handlers = this.subscriptions.get(message.code);
    if (!handlers) {
      console.warn(`Cannot find handlers for ${message.code}`);
      return;
    }
    for (let h of handlers) {
      h(message);
    }
  }

  private post(message: IMessage) {
    console.log('Message posted:', message);
    if (message.priority === 'HIGH') {
      this.notify(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  send(code: string, context?: any) {
    this.post({ code, context, priority: 'NORMAL' });
  }
  sendPiority(code: string, context?: any) {
    this.post({ code, context, priority: 'HIGH' });
  }
  subscribe(code: string, handler: IMessageHandler) {
    let handlers = this.subscriptions.get(code);
    if (!isDefined(handlers)) {
      handlers = [];
      this.subscriptions.set(code, handlers);
    }
    if (handlers.indexOf(handler) > -1) {
      console.warn(`Attempting to add a duplicate handler to code ${code}`);
    } else {
      handlers.push(handler);
    }
  }
  unsubscribe(code: string, handler: IMessageHandler) {
    let handlers = this.subscriptions.get(code);
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

  update(time: number) {
    if (this.messageQueue.length === 0) {
      return;
    }
    let messageLimit = Math.min(
      this.queueMessagePerUpdate,
      this.messageQueue.length
    );
    for (let i = 0; i < messageLimit; i++) {
      let message = this.messageQueue.pop();
      if (message) {
        this.notify(message);
      }
    }
  }
}
