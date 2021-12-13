export const LENGTH_VALID_DOUBLE = (first, second) => (value) => {
  return value.length === first || value.length === second;
};
  
export const YEAR_VALIDATOR = (minYear, maxYear) => (value) => {
  const currentYear = new Date(value).getFullYear();
  return currentYear >= minYear && currentYear <= maxYear;
};