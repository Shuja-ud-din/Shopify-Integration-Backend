import { DateTime } from 'luxon';

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
