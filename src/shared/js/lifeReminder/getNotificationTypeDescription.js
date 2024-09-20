import { notificationTypes } from './profileTypes';

export function getNotificationTypeDescription(notification) {
  switch (notification.type) {
    case notificationTypes.random:
      return notification.randomRange?.length === 2
        ? `every ${notification.randomRange[0]}~${notification.randomRange[1]} days`
        : '';

    case notificationTypes.days:
      return notification.rateDays
        ? `${notification.rateDays > 1 ? `every ${notification.rateDays} days` : 'everyday'}`
        : '';

    case notificationTypes.weeks:
      return notification.weekDays?.length
        ? `weekly on ${getWeekDays(notification.weekDays).join(', ')}`
        : '';

    case notificationTypes.months:
      return notification.monthDays?.length
        ? `monthly on ${notification.monthDays.join(', ')}`
        : '';

    case notificationTypes.percentagechange:
      return notification.percentageDelta ? `${notification.percentageDelta * 100}%` : '';

    case notificationTypes.dynamic:
      return 'dynamically';

    case notificationTypes.once:
      return notification.nextCheckDate ? `once on ${notification.nextCheckDate}` : '';

    default:
      return '';
  }
}

function getWeekDays(weekDays) {
  const shortWeeks = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  const weeksObj = {
    Mo: 'Monday',
    Tu: 'Tuesday',
    We: 'Wednesday',
    Th: 'Thursday',
    Fr: 'Friday',
    Sa: 'Saturday',
    Su: 'Sunday',
  };

  return shortWeeks.filter(day => weekDays.includes(day)).map(day => weeksObj[day]);
}
