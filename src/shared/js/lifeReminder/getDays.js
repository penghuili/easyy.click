import { differenceInCalendarDays, format } from 'date-fns';
import { formatDateDifference } from '../date';
import { getStartAndEnd } from './getStartAndEnd';
import { profileTypes } from './profileTypes';

export function getDays(profile, dateString) {
  const { profileType } = profile;
  const dateObject = new Date(dateString);
  const todayWeekDayString = format(dateObject, 'iiiiii');
  const todayMonthDayString = format(dateObject, 'dd');
  const { startDate: startDateString, endDate: endDateString } = getStartAndEnd(
    profile,
    dateString
  );

  let pastDays = undefined;
  let pastDaysString = undefined;
  if (startDateString) {
    pastDays = differenceInCalendarDays(dateObject, new Date(startDateString)) + 1;
    pastDaysString = formatDateDifference(new Date(startDateString), dateObject);
  }

  let leftDays = undefined;
  let leftDaysString = undefined;
  if (endDateString) {
    leftDays = differenceInCalendarDays(new Date(endDateString), dateObject);
    leftDaysString = formatDateDifference(dateObject, new Date(endDateString));
  }

  const totalDays =
    startDateString && endDateString
      ? differenceInCalendarDays(new Date(endDateString), new Date(startDateString)) + 1
      : undefined;

  switch (profileType) {
    case profileTypes.thisYear: {
      return {
        todayString: dateString,
        todayWeekDayString,
        todayMonthDayString,
        pastDays,
        pastDaysString,
        leftDays,
        leftDaysString,
        totalDays,
      };
    }
    case profileTypes.death:
    case profileTypes.progress: {
      return {
        todayString: dateString,
        todayWeekDayString,
        todayMonthDayString,
        pastDays,
        pastDaysString,
        leftDays,
        leftDaysString,
        totalDays,
      };
    }
    case profileTypes.countdown: {
      return {
        todayString: dateString,
        todayWeekDayString,
        todayMonthDayString,
        leftDays,
        leftDaysString,
      };
    }
    case profileTypes.anniversary: {
      return {
        todayString: dateString,
        todayWeekDayString,
        todayMonthDayString,
        leftDays,
        leftDaysString,
      };
    }
    case profileTypes.past: {
      return {
        todayString: dateString,
        todayWeekDayString,
        todayMonthDayString,
        pastDays,
        pastDaysString,
        leftDays: Infinity,
      };
    }
    case profileTypes.once: {
      return {
        todayString: dateString,
        todayWeekDayString,
        todayMonthDayString,
        leftDays,
        leftDaysString,
      };
    }
    case profileTypes.noDate: {
      return {
        todayString: dateString,
        todayWeekDayString,
        todayMonthDayString,
        pastDays,
        pastDaysString,
        leftDays: Infinity,
      };
    }
    default:
      return { todayString: dateString, todayWeekDayString, todayMonthDayString };
  }
}
