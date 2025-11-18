export const capitalize = (str: string): string => {
  if (typeof str !== 'string' || str.length === 0) return str;
  return str
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
