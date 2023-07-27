import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subscription } from './subscription.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ type: 'numeric' })
  latitude: number;

  @Column({ type: 'numeric' })
  longitude: number;

  @OneToOne(() => Subscription)
  subscription: Subscription;
}
