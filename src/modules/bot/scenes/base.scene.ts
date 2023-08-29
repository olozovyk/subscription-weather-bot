import { Ctx, On } from 'nestjs-telegraf';
import { IMyContext } from '../types';

export class BaseScene {
  @On('audio')
  @On('voice')
  @On('video')
  @On('photo')
  @On('document')
  @On('sticker')
  repeatQuestion(@Ctx() ctx: IMyContext) {
    return ctx.scene.reenter();
  }
}
