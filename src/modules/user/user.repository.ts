import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { User } from './user.entity';
import { IUser } from './user.interface';
import { Nullable } from '../../common/types';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly usersRepository: Repository<User>,
  ) {}

  public saveUser(user: IUser): Promise<User> {
    return this.usersRepository.save(user);
  }

  public getUserByChatId(chatId: number): Promise<Nullable<User>> {
    return this.usersRepository.findOneBy({ chatId });
  }

  public setTimezone(chatId: number, timezone: string): Promise<UpdateResult> {
    return this.usersRepository.update({ chatId }, { timezone });
  }
}
