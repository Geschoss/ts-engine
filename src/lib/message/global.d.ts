declare type IMessagePriority = 'NORMAL' | 'HIGH';

declare type IMessage<E extends string = string> = {
  code: E;
  priority: IMessagePriority;
  context: any;
  sender?: any;
};

declare type IPublisher = {
  send<E extends string>(code: E, sender: any, context?: any): void;
  sendPiority<E extends string>(code: E, sender: any, context?: any): void;
  subscribe<E extends string>(code: E, handler: IMessageHandler): void;
  unsubscribe<E extends string>(code: E, handler: IMessageHandler): void;
  update(time: number): void;
};

declare type IMessageHandler<E = string> = (message: IMessage<E>) => void;
