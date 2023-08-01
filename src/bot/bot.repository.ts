import { Injectable } from '@nestjs/common';
import { DataSource, UpdateResult } from 'typeorm';

import { Subscription, User } from '../entities';
import { UserDto } from './dto';

@Injectable()
export class BotRepository {
  constructor(private dataSource: DataSource) {}
  private userRepository = this.dataSource.getRepository(User);
  private subscriptionRepository = this.dataSource.getRepository(Subscription);

  public saveUser(user: UserDto): Promise<User> {
    return this.userRepository.save(user);
  }

  public getUserByChatId(chatId: number): Promise<User | null> {
    return this.userRepository.findOneBy({ chatId });
  }

  public saveSubscription(subscription: Subscription): Promise<Subscription> {
    return this.subscriptionRepository.save(subscription);
  }

  public getAllSubscriptions(user: User): Promise<Subscription[]> {
    return this.subscriptionRepository.find({
      where: { user },
      relations: { location: true, user: true },
    });
  }

  public setTimezone(chatId: number, timezone: string): Promise<UpdateResult> {
    return this.userRepository.update({ chatId }, { timezone });
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
}
