import { parseISO, isAfter, format } from 'date-fns';

export default function VerifyEnd(param) {
  const date = parseISO(param);

  const setDate = parseISO(param);

  const date2 = setDate.setHours(15, 0, 0);

  const endDay = parseISO(format(date2, "yyy-MM-dd'T'HH:mm:ssxxx"));

  return isAfter(date, endDay);
}
