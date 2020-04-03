import { parseISO, isBefore, format } from 'date-fns';

export default function VerifyStart(param) {
  const date = parseISO(param);

  const setDate = parseISO(param);

  const date1 = setDate.setHours(5, 0, 0);

  const startDay = parseISO(format(date1, "yyy-MM-dd'T'HH:mm:ssxxx"));

  return isBefore(date, startDay);
}
