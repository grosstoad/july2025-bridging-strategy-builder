export interface MonthOption {
  value: string; // YYYY-MM format for value
  label: string; // MMM YYYY format for display
  date: Date;
}

/**
 * Generates an array of month options starting from the current month
 * @param count Number of months to generate
 * @returns Array of MonthOption objects
 */
export const generateMonthOptions = (count: number): MonthOption[] => {
  const options: MonthOption[] = [];
  const currentDate = new Date();
  
  for (let i = 0; i < count; i++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
    options.push({
      value: formatDateValue(date),
      label: formatMonthYear(date),
      date: date
    });
  }
  
  return options;
};

/**
 * Formats a date as MMM YYYY (e.g., "Jul 2025")
 * @param date Date to format
 * @returns Formatted string
 */
export const formatMonthYear = (date: Date): string => {
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 
                      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
};

/**
 * Formats a date as YYYY-MM for value storage
 * @param date Date to format
 * @returns Formatted string
 */
export const formatDateValue = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Adds months to a date
 * @param date Starting date
 * @param months Number of months to add
 * @returns New date
 */
export const addMonths = (date: Date, months: number): Date => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
};

/**
 * Gets the number of months between two dates
 * @param start Start date
 * @param end End date
 * @returns Number of months
 */
export const getMonthsBetween = (start: Date, end: Date): number => {
  const yearDiff = end.getFullYear() - start.getFullYear();
  const monthDiff = end.getMonth() - start.getMonth();
  return yearDiff * 12 + monthDiff;
};

/**
 * Parses a YYYY-MM string back to a Date object
 * @param value Date string in YYYY-MM format
 * @returns Date object
 */
export const parseDateValue = (value: string): Date => {
  const [year, month] = value.split('-').map(Number);
  return new Date(year, month - 1, 1);
};