export class MessageSubscriptionNode {
  message: IMessage;
  handler: IMessageHandler;

  constructor(message: IMessage, handler: IMessageHandler) {
    this.message = message;
    this.handler = handler;
  }
}
