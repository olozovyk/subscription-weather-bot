import { Injectable, Logger } from '@nestjs/common';
import * as amqplib from 'amqplib';

import { logCaughtError } from '../common/utils';
import {
  IConfigureParams,
  IConfigureReturn,
  IReceiveFromQueue,
  ISendToQueue,
} from './types';

@Injectable()
export class RabbitMQService {
  private logger = new Logger(RabbitMQService.name);

  private async configure({
    exchangeType,
    exchangeName,
    queue,
    bindingKey,
  }: IConfigureParams): Promise<IConfigureReturn | void> {
    try {
      const connection = await amqplib.connect('amqp://localhost');
      const channel = await connection.createChannel();

      await channel.assertExchange(exchangeName, exchangeType, {
        durable: true,
      });

      await channel.assertQueue(queue, {
        durable: true,
      });

      await channel.bindQueue(queue, exchangeName, bindingKey);

      return {
        connection,
        channel,
      };
    } catch (e) {
      logCaughtError(e, this.logger);
    }
  }

  public async sendToQueue({
    exchangeType,
    exchangeName,
    queue,
    routingKey,
    payload,
  }: ISendToQueue): Promise<void> {
    try {
      const configRes = await this.configure({
        exchangeType,
        exchangeName,
        queue,
        bindingKey: routingKey,
      });

      if (!configRes) {
        throw new Error('amqp connection problem');
      }

      const { connection, channel } = configRes;
      channel.publish(exchangeName, routingKey, Buffer.from(payload));

      setTimeout(() => {
        connection.close();
      }, 500);
    } catch (e) {
      logCaughtError(e, this.logger);
    }
  }

  public async receiveFromQueue({
    exchangeType,
    exchangeName,
    queue,
    routingKey,
    messageHandler,
  }: IReceiveFromQueue) {
    try {
      const configRes = await this.configure({
        exchangeType,
        exchangeName,
        queue,
        bindingKey: routingKey,
      });

      if (!configRes) {
        throw new Error('amqp connection problem');
      }

      const { channel } = configRes;

      await channel.consume(
        queue,
        msg => {
          if (!msg) {
            return;
          }

          messageHandler(msg.content.toString());
          channel.ack(msg);
        },
        {
          noAck: false,
        },
      );
    } catch (e) {
      logCaughtError(e, this.logger);
    }
  }
}
