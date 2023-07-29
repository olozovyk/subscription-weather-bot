import { Ctx, Message, On, Scene, SceneEnter } from 'nestjs-telegraf';
import { IMyContext } from '../../types/myContext.interface';
import { showCancelSceneKeyboard } from '../../keyboards/cancelScene.keyboard';
import { cancelScene, exitScene } from '../../utils/cancelScene';
import { validateTime } from '../../../common/utils';
import { convertInputStringToDate } from '../../../common/utils/convertInputStringToDate';
import { showMainKeyboard } from '../../keyboards/main.keyboard';
import { Subscription } from '../../../entities/subscription.entity';
import { Location } from '../../../entities/location.entity';
import { BotRepository } from '../../bot.repository';
import { getTimeToShow } from '../../../common/utils/getTimeToShow';
import { BaseScene } from '../base.scene';

@Scene('timeScene')
export class TimeScene extends BaseScene {
  constructor(private botRepository: BotRepository) {
    super();
  }

  @SceneEnter()
  async enter(@Ctx() ctx: IMyContext) {
    await ctx.reply(
      `Please set a time for your subscription, e.g., 14:27 (24-hour format). If you don't send your timezone to the bot, you should use the UTC timezone.`,
      showCancelSceneKeyboard(),
    );
  }

  @On('text')
  async saveTime(@Ctx() ctx: IMyContext, @Message('text') text: string) {
    if (text === '❌ Cancel') {
      await cancelScene(ctx, 'create');
      return;
    }

    if (!validateTime(text)) {
      await ctx.reply(
        'Please set a time for your subscription, e.g., 14:30 (24-hour format)',
        showCancelSceneKeyboard(),
      );
      return;
    }

    if (!ctx.chat) {
      return;
    }

    const user = await this.botRepository.getUserByChatId(ctx.chat.id);

    if (!user) {
      return;
    }

    const { timeLocal, timeUTC } = convertInputStringToDate(
      text,
      user.timezone,
    );

    ctx.session.newSubscription.time = timeUTC;

    const location = new Location();
    location.name = ctx.session.newSubscription.location.name;
    location.country = ctx.session.newSubscription.location.country;
    location.latitude = ctx.session.newSubscription.location.lat;
    location.longitude = ctx.session.newSubscription.location.lon;

    if (ctx.session.newSubscription.location.state) {
      location.state = ctx.session.newSubscription.location.state;
    }

    const subscription = new Subscription();
    subscription.name = ctx.session.newSubscription.name;
    subscription.time = ctx.session.newSubscription.time;
    subscription.location = location;
    subscription.user = user;

    await this.botRepository.saveSubscription(subscription);

    await ctx.reply(
      `You scheduled a subscription for ${location.name} ${
        location.country
      } to be sent weather forecast at ${getTimeToShow(timeLocal)}`,
      showMainKeyboard(),
    );

    exitScene(ctx);
  }
}
