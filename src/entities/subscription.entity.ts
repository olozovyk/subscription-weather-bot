import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
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

  @OneToOne(() => Location, {
    cascade: true,
    nullable: false,
  })
  @JoinColumn()
  location: Location;
}
