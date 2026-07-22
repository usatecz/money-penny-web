import type { Task } from '../types/Task'

export function createDefaultTasks(): Task[] {
  return [
    {
      id: crypto.randomUUID(),
      reminderDay: '2026-07-21',
      startDay: '2026-07-22',
      deadline: '2026-07-25',
      priority: 'high',
      title: 'Meet a boss',
      description:
        'Quarterly check-in with your manager. Review progress on current projects, discuss priorities for the next quarter, and ask about career development opportunities. Prepare a brief status update beforehand.',
      status: 'pending',
      tags: ['work', 'meeting'],
    },
    {
      id: crypto.randomUUID(),
      reminderDay: '2026-07-23',
      startDay: '2026-07-24',
      deadline: '2026-07-28',
      priority: 'medium',
      title: 'Buy a birthday gift',
      description:
        'Pick up a thoughtful gift for the upcoming birthday. Consider their interests and keep the budget around $50. Wrap it before the party on Saturday.',
      status: 'pending',
      tags: ['personal', 'shopping'],
    },
    {
      id: crypto.randomUUID(),
      reminderDay: '2026-07-26',
      startDay: '2026-07-27',
      deadline: '2026-07-30',
      priority: 'low',
      title: 'Go on a bike',
      description:
        'Plan a 90-minute ride on the local trail. Check tire pressure, bring water, and aim for a relaxed pace—this is for fitness and fresh air, not speed.',
      status: 'pending',
      tags: ['health', 'outdoors'],
    },
  ]
}
