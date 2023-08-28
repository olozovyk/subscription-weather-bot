import { Context } from 'telegraf';
import { ILocation } from './location.interface';
import { Subscription } from '../../subscriptions/entities';

type MySession = any & {
  locations: ILocation[];
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
