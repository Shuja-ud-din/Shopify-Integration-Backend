import { EndScheduleOn, RepeatUnit } from '../enums/schedule.enum';

export interface ISchedule {
  startDate: string;
  startTime: string;
  timezone: string;
  repeat?: IRepeatSchedule;
  end: {
    on: EndScheduleOn;
    value?: number;
  };
  runCount: number;
}

export interface IRepeatSchedule {
  every: number;
  unit: RepeatUnit;
}
