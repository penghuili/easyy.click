import { addDays, differenceInCalendarDays, format } from 'date-fns';
import { formatDate } from '../date';
import { notificationTypes } from './profileTypes';

export function getNextCheckDate(notification, { todayString, startDateString, endDateString }) {
  if (notification.startFrom && notification.startFrom > todayString) {
    return notification.startFrom;
  }

  switch (notification.type) {
    case notificationTypes.days:
      return checkDays(notification, todayString);
    case notificationTypes.weeks:
      return checkWeeks(notification, todayString);
    case notificationTypes.months:
      return checkMonths(notification, todayString);
    case notificationTypes.percentagechange:
      return checkPercentage(notification, todayString, startDateString, endDateString);
    case notificationTypes.dynamic:
      return checkDynamic(notification, todayString, endDateString);
    case notificationTypes.random:
      return checkRandom(notification, todayString);
    case notificationTypes.once:
      return checkOnce(endDateString);
    default:
      return null;
  }
}

function checkDays(notification, todayString) {
  if (!notification.rateDays) {
    return null;
  }

  if (!notification.lastCheckDate) {
    return todayString;
  }

  return formatDate(addDays(new Date(notification.lastCheckDate), notification.rateDays));
}

function checkWeeks(notification, todayString) {
  if (!notification?.weekDays?.length) {
    return null;
  }

  if (!notification.lastCheckDate) {
    return todayString;
  }

  let i = 0;
  while (i < 7) {
    const date = addDays(new Date(todayString), i);
    const weekDay = format(date, 'iiiiii');
    if (notification.weekDays.includes(weekDay)) {
      return formatDate(date);
    }
    i += 1;
  }

  return null;
}

function checkMonths(notification, todayString) {
  if (!notification?.monthDays?.length) {
    return null;
  }

  if (!notification.lastCheckDate) {
    return todayString;
  }

  let i = 0;
  while (i < 31) {
    const date = addDays(new Date(todayString), i);
    const monthDay = format(date, 'dd');
    if (notification.monthDays.includes(monthDay)) {
      return formatDate(date);
    }
    i += 1;
  }

  return null;
}

function checkPercentage(notification, todayString, startDateString, endDateString) {
  if (!endDateString || !startDateString) {
    return null;
  }

  if (!notification.percentageDelta) {
    return null;
  }

  if (!notification.lastCheckDate || !notification.lastCheckPercentage) {
    return todayString;
  }

  const totalDays =
    differenceInCalendarDays(new Date(endDateString), new Date(startDateString)) + 1;
  const newPercentage =
    (Math.floor((1 - notification.lastCheckPercentage) / notification.percentageDelta) + 1) *
    notification.percentageDelta;
  const days = Math.ceil(totalDays * newPercentage);
  const newDate = addDays(new Date(startDateString), days);
  return formatDate(newDate);
}

function checkDynamic(notification, todayString, endDateString) {
  if (!endDateString) {
    return null;
  }

  if (!notification.lastCheckDate) {
    return todayString;
  }

  const leftDays = differenceInCalendarDays(
    new Date(endDateString),
    new Date(notification.lastCheckDate)
  );

  if (leftDays < 1) {
    return null;
  }

  if (leftDays >= 30) {
    return formatDate(addDays(new Date(notification.lastCheckDate), 30));
  }

  if (leftDays >= 7) {
    return formatDate(addDays(new Date(notification.lastCheckDate), 7));
  }

  return formatDate(addDays(new Date(notification.lastCheckDate), 1));
}

function checkRandom(notification, todayString) {
  if (!notification.nextDays) {
    return todayString;
  }

  if (!notification.lastCheckDate) {
    return todayString;
  }

  return formatDate(addDays(new Date(notification.lastCheckDate), notification.nextDays));
}

function checkOnce(endDateString) {
  return endDateString;
}
