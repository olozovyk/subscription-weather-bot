export const parseCreateSubscriptionString = (message: string): string[] => {
  const arr = message.split(' ').filter(item => item !== '');

  const name = arr[1];
  const time = arr[2];
  const location = arr.slice(3, arr.length).join('+');

  return [name, time, location];
};
