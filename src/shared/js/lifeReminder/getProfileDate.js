import { profileTypes } from './profileTypes';

export function getProfileDate(profile) {
  switch (profile.profileType) {
    case profileTypes.thisYear:
    case profileTypes.noDate: {
      return null;
    }
    case profileTypes.anniversary: {
      return `target day: ${profile.monthDay}`;
    }
    case profileTypes.death: {
      return `birthday: ${profile.startDate}, last day: ${profile.endDate}`;
    }
    case profileTypes.progress: {
      return `start date: ${profile.startDate}, end date: ${profile.endDate}`;
    }
    case profileTypes.countdown: {
      return `target date: ${profile.endDate}`;
    }
    case profileTypes.past: {
      return `happened on: ${profile.startDate}`;
    }
    default:
      return null;
  }
}
