export interface ISendToQueue {
  exchangeType: string;
  exchangeName: string;
  queue: string;
  routingKey: string;
  payload: string;
}
