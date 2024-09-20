import { profileTypes } from './profileTypes';

export function getStartAndEnd(profile, dateString) {
  const {
    startDate: profileStartDateString,
    endDate: profileEndDateString,
    monthDay,
    profileType,
  } = profile;
  const startFrom = profile.notification?.startFrom;

  switch (profileType) {
    case profileTypes.thisYear: {
      const year = dateString.slice(0, 4);
      const startDateString = `${year}-01-01`;
      const endDateString = `${year}-12-31`;

      return {
        startDate: startDateString,
        endDate: endDateString,
      };
    }
    case profileTypes.death:
    case profileTypes.progress: {
      return {
        startDate: profileStartDateString,
        endDate: profileEndDateString,
      };
    }
    case profileTypes.countdown: {
      return {
        startDate: startFrom,
        endDate: profileEndDateString,
      };
    }
    case profileTypes.anniversary: {
      if (!monthDay) {
        return {};
      }

      const year = dateString.slice(0, 4);
      let endDateString = `${year}-${monthDay}`;
      if (endDateString < dateString) {
        endDateString = `${+year + 1}-${monthDay}`;
      }

      return {
        startDate: startFrom,
        endDate: endDateString,
      };
    }
    case profileTypes.past: {
      return {
        startDate: profileStartDateString,
      };
    }
    case profileTypes.once: {
      return {
        startDate: startFrom,
        endDate: profileEndDateString,
      };
    }
    case profileTypes.noDate: {
      return {
        startDate: startFrom,
      };
    }
    default:
      return {};
  }
}
