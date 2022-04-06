declare interface IAsset {
  readonly name: string;
  readonly data: any;
}

declare interface IAssetLoader {
  readonly supportedExtensions: string[];
  loadAsset(assetName: string): void;
}

declare interface IMessageHandler {
  onMessage(message: IMessage): void;
}

declare type MessagePriority = 'NORMAL' | 'HIGH';
declare abstract class IMessage {
  code: string;
  context: any;
  sender: any;
  priority: MessagePriority;

  static send(code: string, sender: any, context?: any): void;
  static sendPiority(code: string, sender: any, context?: any): void;
  static subscribe(code: string, handler: IMessageHandler): void;
  static unsubscribe(code: string, handler: IMessageHandler): void;
}
