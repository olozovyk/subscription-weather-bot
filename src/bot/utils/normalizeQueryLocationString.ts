export const normalizeQueryLocationString = (query: string) => {
  return query
    .split(' ')
    .filter(item => item !== '')
    .join('+');
};
