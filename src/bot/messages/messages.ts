import { Subscription, User } from '../../entities';
import { convertDateToInputString, getTimeToShow } from '../../common/utils';
import { ILocation } from '../types';

export const messages = {
  makeChoice: 'Please make your choice',
  start:
    'In this bot you can create a subscription to get the weather forecast in the time you want',
  help:
    'In this bot you can create subscriptions to receive the weather forecast at the time you want.\n' +
    '\n' +
    'To create a subscription press the button "New subscription" and follow the instructions.\n' +
    '\n' +
    'By default the bot saves a time in the UTC format. To save a time in your timezone you should set a timezone by pressing the button “Set timezone”.\n' +
    '\n' +
    'You can create up to 5 subscriptions.',

  noSubscriptions: `You don't have active subscriptions`,

  subscriptionsMaxOut: 'You can add no more than 5 subscriptions',
  askSubscriptionName:
    'What name would you like to give to your new subscription?',
  nameExists:
    'You already have a subscription with such a name. Please give an another name',

  askLocation: 'Please tell the location you want the weather for?',
  locationNotFound: 'Such a location has not found. Please try another one',

  getLocationsString(locations: ILocation[]) {
    return locations
      .map((location: ILocation, idx: number) => {
        let locationStr = `${idx + 1} ${location.name}, ${location.country}`;

        if (location.state) {
          locationStr += ` ${location.state}`;
        }

        return locationStr;
      })
      .join('\n');
  },

  confirmLocation:
    'Please choose your location by pressing the appropriate button',

  askTime:
    "Please set a time for your subscription, e.g., 14:27 (24-hour format). If you don't send your timezone to the bot, you should use the UTC timezone",
  timeFormatIsNotValid:
    'Please set a time for your subscription, e.g., 14:30 (24-hour format)',

  getSubscriptionSummary(
    locationName: string,
    country: string,
    timeLocal: Date,
  ) {
    return `You scheduled a subscription for ${locationName} ${country} to received the weather forecast at ${getTimeToShow(
      timeLocal,
    )}`;
  },

  whichSubscriptionDelete:
    'Which subscription would you like to delete? Specify a name for the subscription?',

  subscriptionDoesNotExist: 'A subscription with such a name is not existed',
  successfulDeleting: 'The subscription is deleted',

  askForTimezone: `Please tell your timezone in format 'Europe/Kyiv'`,
  timezoneIsNotValid:
    'Entered setTimezone is not valid. Please send another one or cancel',

  getTimezoneSavedString(timezone: string) {
    return `Timezone ${timezone} was saved`;
  },

  canceledCreating: 'You canceled creating of subscription',
  canceledDeleting: 'You canceled deleting of subscription',
  canceledSettingTimezone: 'You canceled setting a timezone',

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

      const timeToShow = convertDateToInputString(time, user.timezone);

      subscriptionMessage += `Name: ${name} \nTime: ${timeToShow} \nLocation: ${locationName}, ${country}`;

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
    'New subscription',
    'All subscriptions',
    'Delete subscription',
    'Set timezone',
    'Help',
  ],
  cancelSceneKeyboard: ['❌ Cancel'],
};
