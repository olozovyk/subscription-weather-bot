import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { IMyContext } from '../../types/myContext.interface';
import { cancelScene } from '../../utils/cancelScene';
import { showMainKeyboard } from '../../keyboards/main.keyboard';
import { showPickLocationKeyboard } from '../../keyboards/pickLocation.keyboard';
import { ILocation } from '../../types/location.interface';

@Scene('saveLocation')
export class SaveLocationScene {
  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    const locations = ctx.session.newUser.locations;

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

    const location = ctx.session.newUser.locations[Number(text) - 1];
    ctx.session.newUser.location = {
      name: location.name,
      country: location.country,
      state: location.state,
      lat: location.lat,
      lon: location.lon,
    } as ILocation;

    await ctx.reply(
      JSON.stringify(ctx.session.newUser.location),
      showMainKeyboard(),
    );
    ctx.scene.leave();
  }

  @On('audio')
  @On('voice')
  @On('video')
  @On('photo')
  @On('document')
  repeatQuestion(@Ctx() ctx: IMyContext) {
    ctx.scene.reenter();
  }
}
