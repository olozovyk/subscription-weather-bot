import { Context } from 'telegraf';
import { ILocation } from './location.interface';
import { Subscription } from '../../entities/subscription.entity';

type MySession = any & {
  locations: ILocation[];
  timeLocal: Date;
  newSubscription: {
    name: string;
    location: ILocation;
    time: Date;
  };
  subscriptions: Subscription[];
};

export interface IMyContext extends Context {
  session: MySession;
  scene: any;
}
