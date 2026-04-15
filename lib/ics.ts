import { parseISO, addDays, format } from 'date-fns';
import { CalculationResult } from '@/types/rules';
import { getRule } from '@/lib/rules';

type IcsInput = {
  result: CalculationResult;
  claimType: string;
};

export function generateIcsContent({ result, claimType }: IcsInput): string | null {
  const expiryStr = result.adjustedExpiryDate || result.primaryExpiryDate;
  if (!expiryStr) return null;

  const rule = getRule(claimType as Parameters<typeof getRule>[0]);
  const expiryDate = parseISO(expiryStr);
  const dtStart = format(expiryDate, 'yyyyMMdd');
  const dtEnd = format(addDays(expiryDate, 1), 'yyyyMMdd');
  const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
  const uid = `timebar-${claimType}-${dtStart}-${crypto.randomUUID()}@timebar.app`;

  const summary = `TimeBar: ${rule.title} limitation deadline`;
  const description = [
    `Statute: ${rule.statuteRef.act}, ${rule.statuteRef.section}`,
    '',
    'This is an informational legal-timing estimate, not legal advice.',
    'Verify all dates independently with a qualified professional.',
  ].join('\\n');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//TimeBar//Limitation Calculator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${now}`,
    `DTSTART;VALUE=DATE:${dtStart}`,
    `DTEND;VALUE=DATE:${dtEnd}`,
    `SUMMARY:${summary}`,
    `DESCRIPTION:${description}`,
    'BEGIN:VALARM',
    'TRIGGER:-P90D',
    'ACTION:DISPLAY',
    'DESCRIPTION:90 days until limitation deadline',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P30D',
    'ACTION:DISPLAY',
    'DESCRIPTION:30 days until limitation deadline',
    'END:VALARM',
    'BEGIN:VALARM',
    'TRIGGER:-P7D',
    'ACTION:DISPLAY',
    'DESCRIPTION:7 days until limitation deadline',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

export function downloadIcsFile(icsContent: string, claimType: string): void {
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `timebar-${claimType}-deadline.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
