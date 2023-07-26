import { Context } from 'telegraf';
import { ILocation } from './location.interface';

export interface IMyContext extends Context {
  session: any;
  scene: any;
  newSubscription: {
    name: string;
    locations: ILocation[];
    location: ILocation;
    time: string;
  };
}
