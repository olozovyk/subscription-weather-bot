import {
  getOutputDateStringByPattern,
  getTimeToShow,
} from '../../../common/utils';
import { ILocation } from '../types';
import { Subscription } from '../../subscription/entities';
import { User } from '../../user/user.entity';

export const messages = {
  makeChoice: 'Please make your choice',
  start:
    'Welcome to Weather Forecast Bot!' +
    '\n\n' +
    'You can create a subscription to receive fresh weather forecasts at your preferred time.' +
    '\n\n' +
    'Simply press the <b>New Subscription</b> button to get started. If you need more information, press the <b>Help</b> button or type /help command.',
  help:
    '✅  You can create up to 5 subscriptions.' +
    '\n\n' +
    '🌍  By default, subscriptions are created in the UTC time zone.' +
    '\n' +
    'To change the time zone to your local one, navigate to the Set Timezone menu.' +
    '\n\n' +
    '🕐  You should use time in a 24-hour format.',

  noSubscriptions: `You don't have active subscriptions`,

  subscriptionsMaxOut: 'You can add no more than 5 subscriptions',
  askSubscriptionName:
    '📝 What name would you like to give to your new subscription?',
  nameExists:
    '❕ You already have a subscription with that name. Could you choose another name?',

  askLocation: '🌍 Please tell the location for your new subscription.',
  locationNotFound:
    '❕ Such a location has not found. Could you choose another one?',

  getLocationsString(locations: ILocation[]) {
    const emojiNumbers = {
      1: '1️⃣',
      2: '2️⃣',
      3: '3️⃣',
      4: '4️⃣',
      5: '5️⃣',
    };

    return locations
      .map((location: ILocation, idx: number) => {
        const numberToShow =
          emojiNumbers[(idx + 1) as keyof typeof emojiNumbers];

        let locationStr = `${numberToShow} - ${location.name}, ${location.country}`;

        if (location.state) {
          locationStr += ` ${location.state}`;
        }

        return locationStr;
      })
      .join('\n');
  },

  confirmLocation:
    'Please choose the location by pressing the appropriate button.',

  askTime:
    '🕑 Please set a <b>time</b> for your subscription, e.g., 14:27 (24-hour format).' +
    '\n\n' +
    "If you haven't set a <b>timezone</b> before, it will use the UTC timezone by default. You can change your timezone by pressing the 'Set Timezone' button in the menu.",
  timeFormatIsNotValid:
    '❕ Please set a time for your subscription, e.g., 14:30 (24-hour format)',

  getSubscriptionSummary(
    locationName: string,
    country: string,
    timeLocal: Date,
  ) {
    return `👍 You scheduled a subscription for 🌍 ${locationName} ${country} to received the weather forecast at 🕑 ${getTimeToShow(
      timeLocal,
    )}`;
  },

  whichSubscriptionDelete:
    'Which subscription would you like to delete? Specify 📝 a name for the subscription?' +
    '\n\n' +
    '👆 You could see all your active subscriptions by pressing the All Subscriptions button in the main menu.',

  subscriptionDoesNotExist: 'A subscription with such a name does not exist',
  successfulDeleting: 'The subscription is deleted 🗑',

  askForTimezone: `Please tell your timezone in format 'Europe/Kyiv'`,
  timezoneIsNotValid:
    'Entered timezone is not valid. Please send another one or cancel',

  getTimezoneSavedString(timezone: string) {
    return `Timezone ${timezone} was saved`;
  },

  canceledCreating: '✖️  You canceled the subscription creation',
  canceledDeleting: '✖️  You canceled the subscription deletion',
  canceledSettingTimezone: '✖️  You canceled the timezone setting',

  getAllSubscriptionsMessage(
    subscriptions: Subscription[],
    user: User,
  ): string {
    let subscriptionMessage = 'You have next subscriptions:' + '\n\n';

    subscriptions.map(async (subscription, idx) => {
      const {
        name,
        time,
        location: { name: locationName, country, state },
      } = subscription;

      const timeToShow = getOutputDateStringByPattern({
        date: time,
        timezone: user.timezone,
        pattern: 'HH:mm',
      });

      subscriptionMessage += `✅ ${name} \n🕑 ${timeToShow} \n🌍 ${locationName}, ${country}`;

      if (state) {
        subscriptionMessage += ` ${state}`;
      }

      if (idx !== subscriptions.length - 1) {
        subscriptionMessage += '\n\n';
      }
    });

    return subscriptionMessage;
  },

  mainKeyboard: [
    'New Subscription',
    'All Subscriptions',
    'Delete Subscription',
    'Set Timezone',
    'Help',
  ],
  cancelSceneKeyboard: ['✖️ Cancel'],
};
