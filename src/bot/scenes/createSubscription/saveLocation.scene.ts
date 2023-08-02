import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';

import { BaseScene } from '../base.scene';
import { isSceneCanceled } from '../../utils';
import { showPickLocationKeyboard } from '../../keyboards';
import { ILocation, IMyContext } from '../../types';
import { messages } from '../../messages';

@Scene('saveLocation')
export class SaveLocationScene extends BaseScene {
  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    const locations = ctx.session.locations as ILocation[];
    await ctx.reply(messages.getLocationsString(locations));
    await ctx.reply(
      messages.confirmLocation,
      showPickLocationKeyboard(locations.length),
    );
  }

  @On('text')
  async saveLocation(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    if (await isSceneCanceled(ctx, text, 'create')) return;

    if (
      isNaN(Number(text)) ||
      Number(text) > ctx.session.locations.length ||
      Number(text) < 1
    ) {
      return ctx.scene.reenter();
    }

    const location = ctx.session.locations[Number(text) - 1];
    ctx.session.newSubscription.location = {
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon,
    } as ILocation;

    ctx.scene.enter('timeScene');
  }
}
