import { Injectable } from '@nestjs/common';
import { SubscriptionsRepository } from './subscriptions.repository';
import { Subscription } from './entities';
import { User } from '../users/user.entity';

@Injectable()
export class SubscriptionsService {
  constructor(
    private readonly subscriptionsRepository: SubscriptionsRepository,
  ) {}

  public saveSubscription(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionsRepository.saveSubscription(subscription);
  }

  public getAllSubscriptions(user: User): Promise<Subscription[]> {
    return this.subscriptionsRepository.getAllSubscriptions(user);
  }

  public getSubscriptionByName(
    subscriptionName: string,
  ): Promise<Subscription | null> {
    return this.subscriptionsRepository.getSubscriptionByName(subscriptionName);
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
