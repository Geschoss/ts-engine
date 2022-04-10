import { Publisher } from '../../lib/message/publisher';

const subscriptions = new Map<string, IMessageHandler[]>();

export const MessageBus = new Publisher({
  subscriptions,
  messageQueue: [],
  queueMessagePerUpdate: 10,
});
