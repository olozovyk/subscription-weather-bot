import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';

import { BaseScene } from '../base.scene';
import { HttpService } from '../../../http/http.service';
import { showCancelSceneKeyboard } from '../../keyboards';
import { cancelScene, normalizeQueryLocationString } from '../../utils';
import { ILocation, IMyContext } from '../../types';

@Scene('askLocation')
export class AskLocationScene extends BaseScene {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    super();
  }

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      'Please tell the location you want the weather for?',
      showCancelSceneKeyboard(),
    );
  }

  @On('text')
  async askLocation(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    if (text === '❌ Cancel') {
      await cancelScene(ctx, 'create');
      return;
    }

    const geoUrl = this.configService.getOrThrow('GEOCODING_API_URL');
    const apiKey = this.configService.getOrThrow('OPEN_WEATHER_API_KEY');

    const locationQuery = normalizeQueryLocationString(text);

    const url = geoUrl + `q=${locationQuery}&limit=${5}&appid=${apiKey}`;
    const locations = await this.httpService.get<ILocation[]>(url);

    if (!locations || !locations.length) {
      await ctx.reply(
        'Such a location has not found. Please try another one',
        showCancelSceneKeyboard(),
      );
      return;
    }

    ctx.session.locations = locations;

    ctx.scene.enter('saveLocation');
  }
}
