import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Subscription } from './entities';
import { User } from '../user/user.entity';
import { Nullable } from '../../common/types';

@Injectable()
export class SubscriptionRepository {
  constructor(
    @InjectRepository(Subscription)
    private subscriptionRepository: Repository<Subscription>,
  ) {}

  public saveSubscription(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionRepository.save(subscription);
  }

  public getAllSubscriptionsByUser(user: User): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { user },
      relations: { location: true, user: true },
    });
  }

  public getSubscriptionByName(
    subscriptionName: string,
    chatId: number,
  ): Promise<Nullable<Subscription>> {
    return this.subscriptionRepository
      .createQueryBuilder('subscription')
      .innerJoin('subscription.user', 'user')
      .where('subscription.name = :subscriptionName', {
        subscriptionName,
      })
      .andWhere('user.chatId = :chatId', { chatId })
      .getOne();
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
