import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { UserRepository } from './user.repository';
import { IUser } from './user.interface';
import { User } from './user.entity';
import { Nullable } from '../../common/types';

@Injectable()
export class UserService {
  constructor(private readonly usersRepository: UserRepository) {}

  public saveUser(user: IUser): Promise<User> {
    return this.usersRepository.saveUser(user);
  }

  public getUserByChatId(chatId: number): Promise<Nullable<User>> {
    return this.usersRepository.getUserByChatId(chatId);
  }

  public setTimezone(chatId: number, timezone: string): Promise<UpdateResult> {
    return this.usersRepository.setTimezone(chatId, timezone);
  }
}
