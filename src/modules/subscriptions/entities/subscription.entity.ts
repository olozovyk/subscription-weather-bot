import {
  Column,
  Entity,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Location } from './location.entity';

@Entity('subscriptions')
export class Subscription {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  time: Date;

  @ManyToOne(() => User)
  user: User;

  @OneToOne(() => Location, location => location.subscription, {
    cascade: true,
    nullable: false,
  })
  location: Location;
}
