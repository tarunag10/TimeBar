import { addDays, addMonths, differenceInCalendarDays, format } from 'date-fns';
import { CalculationResult, ProceduralMilestone } from '@/types/rules';

function iso(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

export function buildProceduralMilestones(
  status: CalculationResult['status'],
  limitationDate: Date | null,
  today: Date,
): ProceduralMilestone[] {
  const milestones: ProceduralMilestone[] = [];

  if (status === 'manual_review' || !limitationDate) {
    milestones.push({
      title: 'Specialist procedural review',
      priority: 'critical',
      note: 'Confirm the applicable procedural route before relying on any deadline.',
    });
    milestones.push({
      title: 'Evidence chronology finalisation',
      targetDate: iso(addDays(today, 3)),
      priority: 'high',
      note: 'Prepare a dated chronology for all accrual, knowledge, and modifier events.',
    });
    return milestones;
  }

  const daysRemaining = differenceInCalendarDays(limitationDate, today);
  const issueDate = limitationDate;
  const serviceDateIfIssuedLastDay = addMonths(issueDate, 4);

  if (status === 'expired') {
    milestones.push({
      title: 'Urgent post-deadline legal review',
      priority: 'critical',
      note: 'Assess extension/discretion arguments and any available procedural relief immediately.',
    });
    milestones.push({
      title: 'Counsel/partner escalation',
      targetDate: iso(addDays(today, 1)),
      priority: 'critical',
      note: 'Escalate limitation risk and confirm next procedural step.',
    });
    return milestones;
  }

  if (status === 'expires_today') {
    milestones.push({
      title: 'Issue claim today',
      targetDate: iso(issueDate),
      priority: 'critical',
      note: 'This is the final day on the current calculation. Immediate action is required.',
    });
    milestones.push({
      title: 'Service window planning (CPR 7.5)',
      targetDate: iso(serviceDateIfIssuedLastDay),
      priority: 'high',
      note: 'If issued today, claim form service is usually required within 4 months in England and Wales.',
    });
    return milestones;
  }

  const targetIssuePrepDate =
    daysRemaining > 120 ? addDays(issueDate, -90)
      : daysRemaining > 45 ? addDays(issueDate, -30)
        : addDays(today, 2);

  const targetFinalReviewDate =
    daysRemaining > 30 ? addDays(issueDate, -14)
      : addDays(today, 1);

  milestones.push({
    title: 'Pre-issue evidence lock',
    targetDate: iso(targetIssuePrepDate),
    priority: daysRemaining <= 45 ? 'high' : 'normal',
    note: 'Confirm witness documents, chronology, and pleading facts before final issue strategy.',
  });
  milestones.push({
    title: 'Final pre-issue legal sign-off',
    targetDate: iso(targetFinalReviewDate),
    priority: daysRemaining <= 30 ? 'critical' : 'high',
    note: 'Complete legal review and approve the final issue plan.',
  });
  milestones.push({
    title: 'Latest date to issue claim form',
    targetDate: iso(issueDate),
    priority: 'critical',
    note: 'Based on current facts, this is the calculated limitation deadline.',
  });
  milestones.push({
    title: 'Latest service date if issued on last day (CPR 7.5)',
    targetDate: iso(serviceDateIfIssuedLastDay),
    priority: 'high',
    note: 'If issued on the limitation date, claim form service is usually due within 4 months.',
  });

  return milestones;
}
