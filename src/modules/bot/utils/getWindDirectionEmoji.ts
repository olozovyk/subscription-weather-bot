const directionsArrows: { [key: string]: string } = {
  North: '⬇️',
  Northeast: '↙️',
  East: '⬅️',
  Southeast: '↖️',
  South: '⬆️',
  Southwest: '↗️',
  West: '➡️',
  Northwest: '↘️',
};

export const getWindDirectionEmoji = (directionDegree: number): string => {
  if (
    (directionDegree > 337.5 && directionDegree < 360) ||
    (directionDegree >= 0 && directionDegree < 22.5)
  ) {
    return directionsArrows['North'];
  }

  if (directionDegree > 22.5 && directionDegree < 67.5) {
    return directionsArrows['Northeast'];
  }

  if (directionDegree > 67.5 && directionDegree < 112.5) {
    return directionsArrows['East'];
  }

  if (directionDegree > 112.5 && directionDegree < 157.5) {
    return directionsArrows['Southeast'];
  }

  if (directionDegree > 157.5 && directionDegree < 202.5) {
    return directionsArrows['South'];
  }

  if (directionDegree > 202.5 && directionDegree < 247.5) {
    return directionsArrows['Southwest'];
  }

  if (directionDegree > 247.5 && directionDegree < 292.5) {
    return directionsArrows['West'];
  }

  if (directionDegree > 292.5 && directionDegree < 337.5) {
    return directionsArrows['Northwest'];
  }

  return 'No data';
};
