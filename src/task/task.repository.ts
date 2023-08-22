import { Injectable } from '@nestjs/common';
import { Subscription } from '../entities';
import { DataSource } from 'typeorm';

@Injectable()
export class TaskRepository {
  constructor(private dataSource: DataSource) {}

  private subscriptionRepository = this.dataSource.getRepository(Subscription);

  public getSubscriptionsByTime(
    hours: number,
    minutes: number,
  ): Promise<Subscription[]> {
    return this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('EXTRACT(HOUR FROM time) = :hours', { hours })
      .andWhere('EXTRACT(MINUTE FROM time) = :minutes', { minutes })
      .innerJoinAndSelect('subscription.location', 'location')
      .innerJoinAndSelect('subscription.user', 'user')
      .getMany();
  }
}
