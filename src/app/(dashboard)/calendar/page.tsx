'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarGrid, type CalendarEvent } from '@/components/tournament/calendar-grid';

const mockEvents: CalendarEvent[] = [
  // Jornada 1 — Dobles (Sat) + Singles (Wed)
  { date: '2026-04-18', title: 'J1 Dobles (Sáb 7am)', color: 'orange' },
  { date: '2026-04-22', title: 'J1 Singles (Mié 7pm)', color: 'blue' },
  // Jornada 2
  { date: '2026-04-25', title: 'J2 Dobles (Sáb 7am)', color: 'orange' },
  { date: '2026-04-29', title: 'J2 Singles (Mié 7pm)', color: 'blue' },
  // Jornada 3
  { date: '2026-05-02', title: 'J3 Dobles (Sáb 7am)', color: 'orange' },
  { date: '2026-05-06', title: 'J3 Singles (Mié 7pm)', color: 'blue' },
  // Jornada 4 — Super Liga
  { date: '2026-05-09', title: 'J4 Super Liga Dobles', color: 'orange' },
  { date: '2026-05-13', title: 'J4 Super Liga Singles', color: 'blue' },
  // Gran Final
  { date: '2026-05-16', title: '🏆 Gran Final (Sáb 2pm)', color: 'green' },
];

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3)); // April 2026

  function handlePrevMonth() {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  }

  function handleNextMonth() {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Calendar"
        subtitle="Tournament and event schedule"
        breadcrumbs={[{ label: 'Dashboard', href: '/' }, { label: 'Calendar' }]}
      />

      <Card noPadding>
        {/* Month navigation */}
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 dark:border-border-dark">
          <Button variant="ghost" size="sm" onClick={handlePrevMonth}>
            <ChevronLeft size={16} />
          </Button>
          <h2 className="text-base font-semibold text-[var(--foreground)]">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <Button variant="ghost" size="sm" onClick={handleNextMonth}>
            <ChevronRight size={16} />
          </Button>
        </div>

        <div className="p-5">
          <CalendarGrid
            year={currentDate.getFullYear()}
            month={currentDate.getMonth()}
            events={mockEvents}
          />
        </div>
      </Card>
    </div>
  );
}
