import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { ConfigService } from '@nestjs/config';

import { BaseScene } from '../base.scene';
import { HttpService } from '../../../http/http.service';
import { showCancelSceneKeyboard } from '../../keyboards';
import { isSceneCanceled, normalizeQueryLocationString } from '../../utils';
import { ILocation, IMyContext } from '../../types';

@Scene('askLocation')
export class AskLocationScene extends BaseScene {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {
    super();
  }

  private geoUrl = this.configService.getOrThrow('GEOCODING_API_URL');
  private apiKey = this.configService.getOrThrow('OPEN_WEATHER_API_KEY');

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      'Please tell the location you want the weather for?',
      showCancelSceneKeyboard(),
    );
  }

  @On('text')
  async askLocation(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    if (await isSceneCanceled(ctx, text, 'create')) return;

    const locationQuery = normalizeQueryLocationString(text);

    const url =
      this.geoUrl + `q=${locationQuery}&limit=${5}&appid=${this.apiKey}`;
    const locations = await this.httpService.get<ILocation[]>(url);

    if (!locations?.length) {
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
