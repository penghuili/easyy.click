import {
  differenceInCalendarDays,
  differenceInDays,
  differenceInMonths,
  differenceInYears,
  format,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from 'date-fns';

export function formatDateTime(date) {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
}

export function formatDate(date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateWeekTime(date) {
  return format(date, 'yyyy-MM-dd eee HH:mm');
}

export function formatDateWeek(date) {
  return format(date, 'yyyy-MM-dd eee');
}

export function formatTime(date) {
  return format(date, ' HH:mm:ss');
}

export function getTimezoneOffset() {
  return new Date().getTimezoneOffset();
}

export function formatTimezoneDate(timestamp, timezoneOffset) {
  const data = getTimezoneData(timestamp, timezoneOffset);
  return `${data.year}-${data.month}-${data.day}`;
}

export function formatTimezoneDateTime(timestamp, timezoneOffset) {
  const data = getTimezoneData(timestamp, timezoneOffset);
  return `${data.year}-${data.month}-${data.day} ${data.hour}:${data.minute}:${data.second}`;
}

export function formatDateDifference(startDate, endDate) {
  // Calculate the differences in years, months, and days
  const years = differenceInYears(endDate, startDate);
  // Subtract the years to find the remaining months
  const months = differenceInMonths(endDate, startDate) % 12;
  // Adjust the start date by the years and months difference for accurate day calculation
  const adjustedStartDate = new Date(startDate);
  adjustedStartDate.setFullYear(startDate.getFullYear() + years);
  adjustedStartDate.setMonth(startDate.getMonth() + months);
  const days = differenceInDays(endDate, adjustedStartDate);

  // Construct the result string
  const result = [
    years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '',
    months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '',
    days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '',
  ]
    .filter(part => part !== '')
    .join(' ');

  return result || '0 days'; // In case dates are the same
}

export function getAgo(date) {
  const dateObject = new Date(date);
  const now = new Date();
  const years = differenceInYears(now, dateObject);
  const months = differenceInMonths(now, dateObject) % 12;
  const adjustedStartDate = new Date(dateObject);
  adjustedStartDate.setFullYear(adjustedStartDate.getFullYear() + years);
  adjustedStartDate.setMonth(adjustedStartDate.getMonth() + months);
  const days = differenceInCalendarDays(now, adjustedStartDate);

  const result = [
    years > 0 ? `${years} year${years > 1 ? 's' : ''}` : '',
    months > 0 ? `${months} month${months > 1 ? 's' : ''}` : '',
    days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '',
  ]
    .filter(Boolean)
    .join(' ');

  return result ? `${result} ago` : 'today';
}

export function weekStart(date) {
  return startOfWeek(new Date(date), { weekStartsOn: 1 });
}

export function monthStart(date) {
  return startOfMonth(new Date(date));
}

export function yearStart(date) {
  return startOfYear(new Date(date));
}

function getTimezoneData(timestamp, timezoneOffset) {
  const offsetMilliseconds = timezoneOffset * 60000;
  const localDate = new Date(timestamp - offsetMilliseconds);
  const isoString = localDate.toISOString();

  const [datePart, timePart] = isoString.split('T');

  const [year, month, day] = datePart.split('-');

  const [hour, minute, secondsPart] = timePart.split(':');
  const second = secondsPart.split('.')[0];

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
  };
}

export function isNewer(newDate, oldDate) {
  if (!newDate) {
    return false;
  }

  if (!oldDate) {
    return true;
  }

  return newDate > oldDate;
}
