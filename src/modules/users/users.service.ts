import { Injectable } from '@nestjs/common';
import { UpdateResult } from 'typeorm';

import { UsersRepository } from './users.repository';
import { IUser } from './user.interface';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public saveUser(user: IUser): Promise<User> {
    return this.usersRepository.saveUser(user);
  }

  public getUserByChatId(chatId: number): Promise<User | null> {
    return this.usersRepository.getUserByChatId(chatId);
  }

  public setTimezone(chatId: number, timezone: string): Promise<UpdateResult> {
    return this.usersRepository.setTimezone(chatId, timezone);
  }
}
