import { Injectable, Logger } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';

import { HttpService } from '../../common/http/http.service';
import { ConfigService } from '@nestjs/config';
import { Subscription } from '../subscription/entities';
import {
  IForecastFromAPI,
  IWeatherItemFromAPI,
  IWeatherMappedItem,
} from './types';
import { getWindDirectionEmoji, roundNumber } from './utils';
import {
  capitalizeString,
  getOutputDateStringByPattern,
  logCaughtError,
} from '../../common/utils';
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
  private FORECAST_API_URL = this.configService.getOrThrow('FORECAST_API_URL');

  public deliveryMessage(subscriptions: Subscription[]): void {
    subscriptions.forEach(async subscription => {
      const {
        location: { latitude, longitude },
        user: { chatId },
      } = subscription;

      const weather = await this.getWeatherNew(latitude, longitude);

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

  private async getWeatherNew(
    latitude: number,
    longitude: number,
  ): Promise<IWeatherMappedItem[] | void> {
    const weatherUrl =
      this.WEATHER_API_URL +
      `?appid=${this.WEATHER_API_KEY}` +
      `&lat=${latitude}` +
      `&lon=${longitude}` +
      '&units=metric' +
      '&lang=en';

    const forecastUrl =
      this.FORECAST_API_URL +
      `?appid=${this.WEATHER_API_KEY}` +
      `&lat=${latitude}` +
      `&lon=${longitude}` +
      '&units=metric' +
      '&cnt=3' +
      '&lang=en';

    const weather = await this.httpService.get<IWeatherItemFromAPI>(weatherUrl);
    const forecastFromApi = await this.httpService.get<IForecastFromAPI>(
      forecastUrl,
    );

    if (!weather || !forecastFromApi) {
      this.logger.error('Weather is not received from API');
      return;
    }

    const weatherAndForecast: IWeatherMappedItem[] = [];

    const currentWeather = this.mapWeatherItem(weather, true);

    weatherAndForecast.push(currentWeather);

    const forecast = forecastFromApi.list.slice(1);
    forecast.map(item => {
      const forecastItem = this.mapWeatherItem(item);
      weatherAndForecast.push(forecastItem);
    });

    return weatherAndForecast;
  }

  private mapWeatherItem(
    item: IWeatherItemFromAPI,
    isCurrent?: boolean,
  ): IWeatherMappedItem {
    return {
      current: !!isCurrent,
      dt: item.dt,
      temp: item.main.temp,
      feels_like: item.main.feels_like,
      pressure: item.main.pressure,
      humidity: item.main.humidity,

      weather: {
        id: item.weather[0].id,
        main: item.weather[0].main,
        description: item.weather[0].description,
      },

      wind: {
        speed: item.wind.speed,
        deg: item.wind.deg,
      },
    };
  }

  private getWeatherString(
    subscription: Subscription,
    weather: IWeatherMappedItem[],
  ): string {
    let message = this.getWeatherTitleString(subscription);

    weather.forEach(item => {
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
    weatherItem: IWeatherMappedItem,
    timezone?: string,
  ): string {
    let message = '';

    const {
      current,
      dt,
      temp,
      feels_like,
      pressure,
      humidity,
      weather: { description },
      wind: { speed, deg },
    } = weatherItem;

    const date = getOutputDateStringByPattern({
      date: new Date(dt * 1000),
      timezone,
      pattern: 'HH:mm',
    });

    const nowOrDate = current ? 'Now' : date;
    message += `\n\n✅ ${nowOrDate}:\n`;

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
