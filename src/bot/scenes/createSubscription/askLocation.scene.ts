import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { IMyContext } from '../../types/myContext.interface';
import { showCancelSceneKeyboard } from '../../keyboards/cancelScene.keyboard';
import { cancelScene } from '../../utils/cancelScene';
import { HttpService } from '../../../http/http.service';
import { ConfigService } from '@nestjs/config';
import { ILocation } from '../../types/location.interface';

@Scene('askLocation')
export class AskLocationScene {
  constructor(
    private httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      'Could you tell the location you want the weather for?',
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

    ctx.session.newUser.locations = locations;

    ctx.scene.enter('saveLocation');
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
