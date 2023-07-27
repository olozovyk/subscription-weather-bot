import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { IMyContext } from '../../types/myContext.interface';
import { cancelScene } from '../../utils/cancelScene';
import { showPickLocationKeyboard } from '../../keyboards/pickLocation.keyboard';
import { ILocation } from '../../types/location.interface';
import { BaseScene } from '../base.scene';

@Scene('saveLocation')
export class SaveLocationScene extends BaseScene {
  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    const locations = ctx.session.locations;

    const locationsStr = locations
      .map((location: ILocation, idx: number) => {
        let locationStr = `${idx + 1} ${location.name}, ${location.country}`;

        if (location.state) {
          locationStr += ` ${location.state}`;
        }

        return locationStr;
      })
      .join('\n');

    await ctx.reply(locationsStr);
    await ctx.reply(
      'Please choose your location by pressing the appropriate button',
      showPickLocationKeyboard(locations.length),
    );
  }

  @On('text')
  async saveLocation(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    if (text === '❌ Cancel') {
      await cancelScene(ctx, 'create');
      return;
    }

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
