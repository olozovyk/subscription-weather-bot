import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDto } from './types/user.dto';
import { Subscription } from '../entities/subscription.entity';

@Injectable()
export class BotRepository {
  constructor(private dataSource: DataSource) {}
  private userRepository = this.dataSource.getRepository(User);
  private subscriptionRepository = this.dataSource.getRepository(Subscription);

  public saveUser(user: UserDto) {
    return this.userRepository.insert(user);
  }

  public getUserByChatId(chatId: number) {
    return this.userRepository.findOneBy({ chatId });
  }

  public saveSubscription(subscription: Subscription) {
    return this.subscriptionRepository.save(subscription);
  }

  public getAllSubscriptions(user: User) {
    return this.subscriptionRepository.find({
      where: { user },
      relations: { location: true, user: true },
    });
  }

  public setTimezone(chatId: number, timezone: string) {
    return this.userRepository.update({ chatId }, { timezone });
  }
}
