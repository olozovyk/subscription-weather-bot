export interface IReceiveFromQueue {
  exchangeType: string;
  exchangeName: string;
  queue: string;
  routingKey: string;
  messageHandler: (message: string) => void;
}
