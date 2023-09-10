import { Injectable } from '@nestjs/common';
import { SubscriptionRepository } from './subscription.repository';
import { Subscription } from './entities';
import { User } from '../user/user.entity';
import { Nullable } from '../../common/types';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionRepository,
  ) {}

  public saveSubscription(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionsRepository.saveSubscription(subscription);
  }

  public getAllSubscriptionsByUser(user: User): Promise<Subscription[]> {
    return this.subscriptionsRepository.getAllSubscriptionsByUser(user);
  }

  public getSubscriptionByName(
    subscriptionName: string,
    chatId: number,
  ): Promise<Nullable<Subscription>> {
    return this.subscriptionsRepository.getSubscriptionByName(
      subscriptionName,
      chatId,
    );
  }

  public deleteSubscription(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionsRepository.deleteSubscription(subscription);
  }

  public getSubscriptionsByTime(
    hours: number,
    minutes: number,
  ): Promise<Subscription[]> {
    return this.subscriptionsRepository.getSubscriptionsByTime(hours, minutes);
  }
}
