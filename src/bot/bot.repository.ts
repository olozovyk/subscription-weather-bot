import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';
import { UserDto } from './types/user.dto';

@Injectable()
export class BotRepository {
  constructor(private dataSource: DataSource) {}
  private userRepository = this.dataSource.getRepository(User);

  public saveUser(user: UserDto) {
    return this.userRepository.insert(user);
  }

  public getUserByChatId(chatId: number) {
    return this.userRepository.findOneBy({ chatId });
  }
}
