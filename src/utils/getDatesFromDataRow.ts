import moment, { Moment } from 'moment';
import { Row } from '../components/Dashboard/MultiChart';

export const FIRST_DATE = '1/22/2020';

export const momentToFormat = (m: Moment): string => m.format('M/D/YY');

export const getDatesFromDataRow = (data: Row | undefined) => {
  if (!data) {
    return;
  }
  const firstDateM = moment(FIRST_DATE);
  const nowM = moment();
  const days = nowM.diff(firstDateM, 'days');
  const dates: Moment[] = [];
  for (let i = 0; i < days + 1; i = i + 1) {
    const newDate = moment(FIRST_DATE).add(i, 'days');
    if (momentToFormat(newDate) in data) {
      dates.push(newDate);
    }
  }
  return dates;
};
