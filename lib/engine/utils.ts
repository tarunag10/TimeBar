import { addYears, addMonths, addDays } from 'date-fns';

export function addPeriod(date: Date, period: { unit: string; value: number }): Date {
  switch (period.unit) {
    case 'years': return addYears(date, period.value);
    case 'months': return addMonths(date, period.value);
    case 'days': return addDays(date, period.value);
    default: return addYears(date, period.value);
  }
}
