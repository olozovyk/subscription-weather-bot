export const getTimeToShow = (date: Date): string => {
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let hoursToShow = String(hours);
  let minutesToShow = String(minutes);

  if (hours < 10) {
    hoursToShow = `0${hours}`;
  }

  if (minutes < 10) {
    minutesToShow = `0${minutes}`;
  }

  return hoursToShow + ':' + minutesToShow;
};
