import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subscription } from './entities';
import { User } from '../users/user.entity';

@Injectable()
export class SubscriptionsRepository {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  public saveSubscription(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionRepository.save(subscription);
  }

  public getAllSubscriptions(user: User): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { user },
      relations: { location: true, user: true },
    });
  }

  public getSubscriptionByName(
    subscriptionName: string,
  ): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: {
        name: subscriptionName,
      },
      relations: {
        location: true,
      },
    });
  }

  public deleteSubscription(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionRepository.remove(subscription);
  }

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
