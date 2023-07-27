import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { IMyContext } from '../../types/myContext.interface';
import { showCancelSceneKeyboard } from '../../keyboards/cancelScene.keyboard';
import { cancelScene } from '../../utils/cancelScene';
import { HttpService } from '../../../http/http.service';
import { ConfigService } from '@nestjs/config';
import { ILocation } from '../../types/location.interface';
import { BaseScene } from '../base.scene';

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

    // TODO: normalize query string ie new+york
    const url = geoUrl + `q=${text}&limit=${5}&appid=${apiKey}`;
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
