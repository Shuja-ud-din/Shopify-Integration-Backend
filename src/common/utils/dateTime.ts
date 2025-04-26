import { DateTime } from 'luxon';

import { ISchedule } from '../types/schedule.types';

export const getDelay: (
  date: string,
  time: string,
  timezone: string,
) => number = (date, time, timezone) => {
  const dateTimeInTZ = DateTime.fromFormat(
    `${date} ${time}`,
    'yyyy-MM-dd HH:mm',
    { zone: timezone },
  );

  if (!dateTimeInTZ.isValid) {
    throw new Error('Invalid date/time or timezone');
  }

  const delay = dateTimeInTZ.toMillis() - Date.now();

  return delay > 0 ? delay : 0;
};

export const isValidScheduleDate: (
  date: string,
  time: string,
  timezone: string,
) => boolean = (date, time, timezone) => {
  const dateTimeInTZ = DateTime.fromFormat(
    `${date} ${time}`,
    'yyyy-MM-dd HH:mm',
    { zone: timezone },
  );

  return (
    dateTimeInTZ.isValid && dateTimeInTZ > DateTime.now().setZone(timezone)
  );
};

export const isScheduleSame: (
  schedule1: ISchedule,
  schedule2: ISchedule,
) => boolean = (schedule1, schedule2) => {
  if (!schedule1 && !schedule2) {
    return true;
  }

  if (!schedule1 || !schedule2) {
    return false;
  }

  return (
    schedule1.startDate === schedule2.startDate &&
    schedule1.startTime === schedule2.startTime &&
    schedule1.timezone === schedule2.timezone &&
    schedule1.repeat === schedule2.repeat &&
    schedule1.end === schedule2.end
  );
};
