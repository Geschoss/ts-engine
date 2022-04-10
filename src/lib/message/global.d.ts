declare type IMessagePriority = 'NORMAL' | 'HIGH';

declare type IMessage = {
  code: string;
  priority: IMessagePriority;
  context: any;
  sender?: any;
};

declare type IPublisher = {
  send(code: string, sender: any, context?: any): void;
  sendPiority(code: string, sender: any, context?: any): void;
  subscribe(code: string, handler: IMessageHandler): void;
  unsubscribe(code: string, handler: IMessageHandler): void;
  update(time: number): void;
};

declare type IMessageHandler = (message: IMessage) => void;
