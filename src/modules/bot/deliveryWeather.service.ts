import { Injectable, Logger } from '@nestjs/common';
import { Subscription } from '../subscription/entities';
import { HttpService } from '../../common/http/http.service';
import { ConfigService } from '@nestjs/config';
import { IWeatherFromAPI, IWeatherItemFromAPI } from './types';
import { getWindDirectionEmoji, roundNumber } from './utils';
import {
  capitalizeString,
  getOutputDateStringByPattern,
  logCaughtError,
} from '../../common/utils';
import { InjectBot } from 'nestjs-telegraf';
import { Markup, Telegraf } from 'telegraf';
import { showMainKeyboard } from './keyboards';

@Injectable()
export class DeliveryWeatherService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    @InjectBot() private bot: Telegraf,
  ) {}

  private logger = new Logger(DeliveryWeatherService.name);

  private WEATHER_API_KEY = this.configService.getOrThrow('WEATHER_API_KEY');
  private WEATHER_API_URL = this.configService.getOrThrow('WEATHER_API_URL');

  public deliveryMessage(subscriptions: Subscription[]): void {
    subscriptions.forEach(async subscription => {
      const {
        location: { latitude, longitude },
        user: { chatId },
      } = subscription;

      const weather = await this.getWeather(latitude, longitude);

      if (!weather) {
        this.logger.error('Weather was not received');
        return;
      }

      const weatherString = this.getWeatherString(subscription, weather);

      try {
        await this.bot.telegram.sendMessage(chatId, weatherString, {
          reply_markup: showMainKeyboard().reply_markup,
        });
      } catch (e) {
        logCaughtError(e, this.logger);
      }
    });
  }

  private async getWeather(
    latitude: number,
    longitude: number,
  ): Promise<IWeatherFromAPI | void> {
    const url =
      this.WEATHER_API_URL +
      `?appid=${this.WEATHER_API_KEY}` +
      `&lat=${latitude}` +
      `&lon=${longitude}` +
      '&units=metric' +
      '&cnt=3';

    return this.httpService.get<IWeatherFromAPI>(url);
  }

  private getWeatherString(
    subscription: Subscription,
    weather: IWeatherFromAPI,
  ): string {
    let message = this.getWeatherTitleString(subscription);

    weather.list.forEach(item => {
      message += this.getWeatherItemString(item, subscription.user.timezone);
    });

    return message;
  }

  private getWeatherTitleString(subscription: Subscription): string {
    const {
      location: { name, country, state },
      user: { timezone },
    } = subscription;

    const stringDate = getOutputDateStringByPattern({
      pattern: 'MMMM do',
      timezone,
    });

    if (state) {
      return `${name}, ${state}, ${country} Weather Forecast \n\n📆 ${stringDate}`;
    }

    return `${name}, ${country} Weather Forecast - 📆 ${stringDate}`;
  }

  private getWeatherItemString(
    weatherItem: IWeatherItemFromAPI,
    timezone?: string,
  ): string {
    let message = '';

    const {
      dt,
      main: { temp, feels_like, pressure, humidity },
      wind: { speed, deg },
    } = weatherItem;

    const { description } = weatherItem.weather[0];

    const date = getOutputDateStringByPattern({
      date: new Date(dt * 1000),
      timezone,
      pattern: 'HH:mm',
    });
    message += `\n\n✅ ${date}:\n`;

    message += `\n🌡 ${roundNumber(temp)}°`;
    message += `, feels like ${roundNumber(feels_like)}°`;
    message += `\n${capitalizeString(description)}`;
    message += `\nHumidity: ${humidity}%`;
    message += `\nPressure: ${pressure} mb`;
    message += `\nWind: ${getWindDirectionEmoji(deg)}`;
    message += ` ${roundNumber(speed)} m/s`;

    return message;
  }
}
