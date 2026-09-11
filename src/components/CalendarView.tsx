import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Sparkles, CheckSquare } from 'lucide-react';
import { CalendarEvent, TaskItem } from '../types';

interface CalendarViewProps {
  events: CalendarEvent[];
  tasks?: TaskItem[];
  selectedDate?: string | null;
  onSelectEvent: (event: CalendarEvent) => void;
  onAddOnDate: (dateStr: string) => void;
  onSelectDate?: (dateStr: string) => void;
  onOpenTasksForDate?: (dateStr: string) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  tasks = [],
  selectedDate = null,
  onSelectEvent,
  onAddOnDate,
  onSelectDate,
  onOpenTasksForDate
}) => {
  // Current focused month (defaults to current date, e.g. Eylül 2026)
  const [currentYear, setCurrentYear] = useState<number>(() => new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(() => new Date().getMonth());

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const realNow = new Date();
  const realTodayYear = realNow.getFullYear();
  const realTodayMonth = realNow.getMonth();
  const realTodayDay = realNow.getDate();

  const handleGoToToday = () => {
    setCurrentYear(realTodayYear);
    setCurrentMonth(realTodayMonth);
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  // Generate calendar days matrix
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  let startingDayOfWeek = firstDayOfMonth.getDay() - 1;
  if (startingDayOfWeek === -1) startingDayOfWeek = 6;

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const calendarDays = [];

  // Padding days from previous month
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      month: currentMonth === 0 ? 11 : currentMonth - 1,
      year: currentMonth === 0 ? currentYear - 1 : currentYear,
      isCurrentMonth: false
    });
  }

  // Days in current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: d,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true
    });
  }

  // Remaining padding days
  const totalSlots = Math.ceil(calendarDays.length / 7) * 7;
  const remainingSlots = totalSlots - calendarDays.length;
  for (let d = 1; d <= remainingSlots; d++) {
    calendarDays.push({
      day: d,
      month: currentMonth === 11 ? 0 : currentMonth + 1,
      year: currentMonth === 11 ? currentYear + 1 : currentYear,
      isCurrentMonth: false
    });
  }

  // Helper to get events for a specific day
  const getEventsForDay = (year: number, month: number, day: number) => {
    const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
    const datePrefix = `${year}-${pad(month + 1)}-${pad(day)}`;

    return events.filter(e => {
      const eStart = e.startDate.split('T')[0];
      const eEnd = e.endDate ? e.endDate.split('T')[0] : eStart;
      return datePrefix >= eStart && datePrefix <= eEnd;
    });
  };

  return (
    <div className="bg-[#151B2B] rounded-2xl border border-[#263047] shadow-xl overflow-hidden text-[#F1F5F9]">
      {/* Calendar Header Controls */}
      <div className="p-5 bg-[#101522] flex items-center justify-between border-b border-[#263047]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/15 text-[#818CF8] flex items-center justify-center font-bold border border-[#6366F1]/30">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-[#F1F5F9]">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <p className="text-xs text-[#94A3B8]">Cosmic Royal Takvim Görünümü</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleGoToToday}
            className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white transition shadow-sm cursor-pointer"
          >
            Bugün
          </button>
          <button
            onClick={() => { setCurrentYear(2026); setCurrentMonth(7); }}
            className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-[#1E273D] hover:bg-[#263047] text-[#F1F5F9] transition border border-[#263047] hidden sm:inline-block cursor-pointer"
          >
            Ağustos 2026
          </button>
          <div className="flex items-center gap-1 bg-[#1E273D] p-1 rounded-xl border border-[#263047]">
            <button
              onClick={handlePrevMonth}
              className="p-1.5 hover:bg-[#263047] text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg transition cursor-pointer"
              title="Önceki Ay"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-1.5 hover:bg-[#263047] text-[#94A3B8] hover:text-[#F1F5F9] rounded-lg transition cursor-pointer"
              title="Sonraki Ay"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Weekday Labels Header */}
      <div className="grid grid-cols-7 bg-[#101522] border-b border-[#263047] text-center text-xs font-semibold text-[#94A3B8] py-3">
        {daysOfWeek.map((day, idx) => (
          <div key={idx} className={idx >= 5 ? 'text-[#F59E0B] font-bold' : ''}>
            {day}
          </div>
        ))}
      </div>

      {/* Month Days Grid */}
      <div className="grid grid-cols-7 auto-rows-fr bg-[#263047] gap-px">
        {calendarDays.map((cell, idx) => {
          const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
          const dateStr = `${cell.year}-${pad(cell.month + 1)}-${pad(cell.day)}`;
          const dayEvents = getEventsForDay(cell.year, cell.month, cell.day);
          const dayTasks = tasks.filter(t => t.dueDate && t.dueDate.split('T')[0] === dateStr);
          const isSelected = selectedDate === dateStr;
          const isToday = cell.year === realTodayYear && cell.month === realTodayMonth && cell.day === realTodayDay;
          const isAugustEventRange = cell.year === 2026 && cell.month === 7 && cell.day >= 7 && cell.day <= 27;

          return (
            <div
              key={idx}
              className={`min-h-[115px] sm:min-h-[135px] p-2 flex flex-col justify-between transition group hover:bg-[#1A2236] ${
                !cell.isCurrentMonth ? 'bg-[#0E1320] text-[#64748B]' : 'bg-[#151B2B] text-[#F1F5F9]'
              } ${isToday ? 'ring-2 ring-[#6366F1] ring-inset bg-[#6366F1]/10' : ''} ${
                isSelected ? 'ring-2 ring-[#F59E0B] ring-inset bg-[#F59E0B]/10' : ''
              }`}
            >
              {/* Day Number Header */}
              <div className="flex items-center justify-between mb-1.5">
                <button
                  type="button"
                  onClick={() => onSelectDate && onSelectDate(dateStr)}
                  className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition cursor-pointer ${
                    isToday 
                      ? 'bg-[#6366F1] text-white shadow-xs' 
                      : isSelected
                        ? 'bg-[#F59E0B] text-[#0B0F19]'
                        : isAugustEventRange && cell.isCurrentMonth 
                          ? 'bg-[#1E273D] text-[#818CF8] hover:bg-[#263047]' 
                          : 'hover:bg-[#1E273D]'
                  }`}
                  title="Bu günü seç ve görevleri görüntüle"
                >
                  {cell.day}
                </button>

                {cell.isCurrentMonth && (
                  <div className="flex items-center gap-1">
                    {dayTasks.length > 0 && onOpenTasksForDate && (
                      <button
                        onClick={() => onOpenTasksForDate(dateStr)}
                        className="px-1.5 py-0.5 rounded-md bg-[#6366F1]/20 hover:bg-[#6366F1]/30 text-[#818CF8] text-[10px] font-bold flex items-center gap-0.5 cursor-pointer shadow-xs border border-[#6366F1]/30"
                        title={`${dayTasks.length} Yapılacak Görev`}
                      >
                        <CheckSquare className="w-2.5 h-2.5" />
                        <span>{dayTasks.length}</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onAddOnDate(`${dateStr}T19:00`);
                      }}
                      title="Bu güne etkinlik ekle"
                      className="opacity-0 group-hover:opacity-100 text-[10px] text-[#94A3B8] hover:text-[#6366F1] font-bold p-0.5 transition cursor-pointer"
                    >
                      + Ekle
                    </button>
                  </div>
                )}
              </div>

              {/* Day Events and Tasks Stack */}
              <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px] scrollbar-thin">
                {/* Events */}
                {dayEvents.map(event => (
                  <button
                    key={event.id}
                    onClick={() => onSelectEvent(event)}
                    className="w-full text-left text-[11px] p-1.5 rounded-lg font-semibold truncate flex items-center gap-1.5 transition hover:brightness-110 shadow-xs border border-[#263047] cursor-pointer"
                    style={{
                      backgroundColor: '#1E273D',
                      color: '#F1F5F9',
                      borderLeft: `3px solid ${event.color || '#6366F1'}`
                    }}
                  >
                    {event.syncedToGoogle && (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] shrink-0" title="Google Takvim'e eklendi" />
                    )}
                    <span className="truncate">{event.title}</span>
                  </button>
                ))}

                {/* Day Tasks Mini Pills (To-Dos for this day) */}
                {dayTasks.map(task => {
                  const cat = (task.category || '').toLowerCase();
                  let pillBg = 'bg-[#F59E0B]/15 text-[#FDE68A] border-[#F59E0B]/30';
                  let dotColor = '#F59E0B';
                  if (cat.includes('tübitak') || cat.includes('tubitak') || cat.includes('proje')) {
                    pillBg = 'bg-[#8B5CF6]/15 text-[#C4B5FD] border-[#8B5CF6]/40';
                    dotColor = '#8B5CF6';
                  } else if (cat.includes('kpss') || cat.includes('eğitim') || cat.includes('ders')) {
                    pillBg = 'bg-[#6366F1]/15 text-[#A5B4FC] border-[#6366F1]/40';
                    dotColor = '#6366F1';
                  } else if (cat.includes('kariyer') || cat.includes('staj') || cat.includes('cezeri') || cat.includes('fergani') || cat.includes('akbank')) {
                    pillBg = 'bg-[#06B6D4]/15 text-[#67E8F9] border-[#06B6D4]/40';
                    dotColor = '#06B6D4';
                  }

                  return (
                    <button
                      key={task.id}
                      onClick={() => onOpenTasksForDate && onOpenTasksForDate(dateStr)}
                      className={`w-full text-left text-[10px] px-1.5 py-0.5 rounded-md font-medium truncate flex items-center gap-1 transition hover:brightness-125 border ${pillBg} cursor-pointer`}
                      title={`Görev: ${task.title} (${task.category || 'Genel'})`}
                    >
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: dotColor }} />
                      <span className="truncate">✓ {task.title}</span>
                    </button>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
