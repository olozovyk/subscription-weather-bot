export const roundNumber = (value: number) => {
  if (isNaN(Number(value))) {
    return value;
  }
  return Math.round(value);
};
