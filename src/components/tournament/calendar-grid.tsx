'use client';

import { cn } from '@/lib/utils';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isToday,
  isSameDay,
  parseISO,
} from 'date-fns';

export interface CalendarEvent {
  date: string;
  title: string;
  color: string;
  tournamentId?: string;
}

interface CalendarGridProps {
  year: number;
  month: number;
  events: CalendarEvent[];
}

const colorClasses: Record<string, string> = {
  orange: 'bg-brand-orange/10 text-brand-orange',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  green: 'bg-green-500/10 text-green-600 dark:text-green-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  yellow: 'bg-brand-yellow/10 text-yellow-700 dark:text-yellow-400',
};

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

export function CalendarGrid({ year, month, events }: CalendarGridProps) {
  const monthStart = startOfMonth(new Date(year, month));
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  function getEventsForDay(day: Date): CalendarEvent[] {
    return events.filter((e) => isSameDay(parseISO(e.date), day));
  }

  return (
    <div className="overflow-hidden rounded-xl border border-gray-100 dark:border-border-dark">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-gray-100 bg-[var(--table-header-bg)] dark:border-border-dark">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="px-3 py-3 text-center text-xs font-semibold tracking-wide text-muted"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7">
        {days.map((day, idx) => {
          const inMonth = isSameMonth(day, monthStart);
          const today = isToday(day);
          const dayEvents = getEventsForDay(day);

          return (
            <div
              key={idx}
              className={cn(
                'min-h-[100px] border-b border-r border-gray-100 p-2 dark:border-border-dark',
                // Remove right border on last column
                (idx + 1) % 7 === 0 && 'border-r-0',
                // Remove bottom border on last row
                idx >= days.length - 7 && 'border-b-0',
                // Today highlight
                today && 'bg-brand-orange/5',
                // Out-of-month cells
                !inMonth && 'bg-gray-50/50 dark:bg-dark-tertiary/30',
              )}
            >
              <span
                className={cn(
                  'inline-flex h-7 w-7 items-center justify-center rounded-full text-sm',
                  today
                    ? 'bg-brand-orange font-semibold text-white'
                    : inMonth
                      ? 'font-medium text-[var(--foreground)]'
                      : 'text-muted-light',
                )}
              >
                {format(day, 'd')}
              </span>

              {/* Event pills */}
              {dayEvents.length > 0 && (
                <div className="mt-1 space-y-1">
                  {dayEvents.map((event, eIdx) => (
                    <div
                      key={eIdx}
                      className={cn(
                        'truncate rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-tight',
                        colorClasses[event.color] || colorClasses.orange,
                      )}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
