import { floorTo } from '../utils';
import { profileTypes } from './profileTypes';

export function getNotificationMessage(
  profile,
  { pastDays, pastDaysString, leftDays, leftDaysString, totalDays }
) {
  const leftMessage = leftDays <= 3 ? `${leftDaysString} left!` : `${leftDaysString} left.`;

  switch (profile.profileType) {
    case profileTypes.thisYear: {
      if (pastDays === undefined || leftDays === undefined || totalDays === undefined) {
        return null;
      }

      const fixed =
        profile.notification.type === 'percentagechange'
          ? profile.notification.percentageDelta * 100
          : 1;
      return `${floorTo((pastDays / totalDays) * 100, fixed)}% past, ${leftMessage}`;
    }
    case profileTypes.death: {
      if (pastDays === undefined || leftDays === undefined || totalDays === undefined) {
        return null;
      }

      if (leftDays < 0) {
        return 'still alive? Nice! Time to update the life expectancy.';
      }

      if (leftDays === 0) {
        return 'Based on the life expectancy you set, today is the last day.';
      }

      const fixed =
        profile.notification.type === 'percentagechange'
          ? profile.notification.percentageDelta * 100
          : 0.01;
      return `has lived ${pastDaysString} (${floorTo(
        (pastDays / totalDays) * 100,
        fixed
      )}%), ${leftMessage}`;
    }
    case profileTypes.progress: {
      if (pastDays === undefined || leftDays === undefined || totalDays === undefined) {
        return null;
      }

      if (leftDays < 0) {
        return 'has already happened.';
      }

      if (leftDays === 0) {
        return 'today is the day!';
      }

      const fixed =
        profile.notification.type === 'percentagechange'
          ? profile.notification.percentageDelta * 100
          : 0.1;
      return `${pastDaysString} (${floorTo(
        (pastDays / totalDays) * 100,
        fixed
      )}%) past, ${leftMessage}`;
    }
    case profileTypes.countdown: {
      if (leftDays === undefined) {
        return null;
      }

      if (leftDays < 0) {
        return 'has already happened.';
      }

      if (leftDays === 0) {
        return 'today is the day!';
      }

      return leftMessage;
    }
    case profileTypes.anniversary: {
      if (leftDays === undefined) {
        return null;
      }

      if (leftDays === 0) {
        return 'today is the day!';
      }

      return leftMessage;
    }
    case profileTypes.past: {
      if (pastDays === undefined) {
        return null;
      }

      if (pastDays <= 0) {
        return 'still in the future.';
      }

      return `${pastDaysString} past.`;
    }
    case profileTypes.noDate: {
      return '👆👆👆';
    }
    default:
      return null;
  }
}
