import * as amqplib from 'amqplib';

export interface IConfigureParams {
  exchangeType: string;
  exchangeName: string;
  queue: string;
  bindingKey: string;
}

export interface IConfigureReturn {
  connection: amqplib.Connection;
  channel: amqplib.Channel;
}
