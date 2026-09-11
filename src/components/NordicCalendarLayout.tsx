import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Sparkles, 
  CheckSquare, 
  Plus, 
  Clock, 
  ListTodo,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { CalendarEvent, GoogleTaskItem } from '../types';
import { TaskPanel } from './TaskPanel';
import { extractDateFromGoogleDue } from '../lib/googleTasksService';

interface NordicCalendarLayoutProps {
  events: CalendarEvent[];
  tasks: GoogleTaskItem[];
  userLoggedIn: boolean;
  onLogin: () => void;
  selectedDate: string | null;
  onSelectDate: (dateStr: string) => void;
  onClearSelectedDate?: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
  onAddOnDate: (dateStr: string) => void;
  onAddTask: (task: { title: string; notes?: string; due?: string }) => Promise<any>;
  onToggleTask: (taskId: string, isCompleted: boolean) => Promise<any>;
  onDeleteTask: (taskId: string) => Promise<any>;
  onRefreshTasks: () => Promise<any>;
  isSyncing: boolean;
  onTriggerRollover: () => Promise<any>;
  isRollingOver: boolean;
  onCreateTestTasks: () => Promise<any>;
  isCreatingTestTasks: boolean;
  lastRolloverCount?: number;
}

export const NordicCalendarLayout: React.FC<NordicCalendarLayoutProps> = ({
  events,
  tasks,
  userLoggedIn,
  onLogin,
  selectedDate,
  onSelectDate,
  onClearSelectedDate,
  onSelectEvent,
  onAddOnDate,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onRefreshTasks,
  isSyncing,
  onTriggerRollover,
  isRollingOver,
  onCreateTestTasks,
  isCreatingTestTasks,
  lastRolloverCount = 0
}) => {
  // Calendar month state: 7 is August (0-indexed) in 2026
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7);

  const monthNames = [
    'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
    'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
  ];

  const daysOfWeek = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];

  const realNow = new Date();
  const realTodayYear = realNow.getFullYear();
  const realTodayMonth = realNow.getMonth();
  const realTodayDay = realNow.getDate();
  const todayDateStr = `${realTodayYear}-${String(realTodayMonth + 1).padStart(2, '0')}-${String(realTodayDay).padStart(2, '0')}`;

  const activeSelectedDate = selectedDate || todayDateStr;

  const handleGoToToday = () => {
    setCurrentYear(realTodayYear);
    setCurrentMonth(realTodayMonth);
    onSelectDate(todayDateStr);
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

  // Helper to count pending tasks for a day
  const getPendingTasksForDay = (dateStr: string) => {
    return tasks.filter(t => extractDateFromGoogleDue(t.due) === dateStr && t.status !== 'completed');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      {/* LEFT SECTION (65% width): Calendar Matrix */}
      <div className="lg:col-span-8 bg-[#151B2B] rounded-2xl border border-[#263047] shadow-xl overflow-hidden text-[#F1F5F9] flex flex-col">
        
        {/* Top Month Controls */}
        <div className="p-5 bg-[#101522] border-b border-[#263047] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#6366F1]/15 text-[#818CF8] flex items-center justify-center font-bold border border-[#6366F1]/30">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F1F5F9] tracking-tight">
                {monthNames[currentMonth]} {currentYear}
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Seçili Gün: <span className="font-semibold text-[#F59E0B]">{activeSelectedDate}</span>
              </p>
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

        {/* Weekday Names Header */}
        <div className="grid grid-cols-7 bg-[#101522] border-b border-[#263047] text-center text-xs font-semibold text-[#94A3B8] py-2.5">
          {daysOfWeek.map((day, idx) => (
            <div key={idx} className={idx >= 5 ? 'text-[#F59E0B] font-bold' : ''}>
              {day}
            </div>
          ))}
        </div>

        {/* 7x6 Calendar Matrix Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-[#263047] gap-px flex-1">
          {calendarDays.map((cell, idx) => {
            const pad = (n: number) => (n < 10 ? '0' + n : '' + n);
            const dateStr = `${cell.year}-${pad(cell.month + 1)}-${pad(cell.day)}`;
            const dayEvents = getEventsForDay(cell.year, cell.month, cell.day);
            const pendingTasks = getPendingTasksForDay(dateStr);
            const isSelected = activeSelectedDate === dateStr;
            const isToday = cell.year === realTodayYear && cell.month === realTodayMonth && cell.day === realTodayDay;

            return (
              <div
                key={idx}
                onClick={() => onSelectDate(dateStr)}
                className={`min-h-[110px] sm:min-h-[125px] p-2 flex flex-col justify-between transition group cursor-pointer ${
                  !cell.isCurrentMonth 
                    ? 'bg-[#0E1320] text-[#64748B]' 
                    : isSelected 
                      ? 'bg-[#1E273D] ring-2 ring-[#6366F1] ring-inset' 
                      : 'bg-[#151B2B] text-[#F1F5F9] hover:bg-[#1A2236]'
                }`}
              >
                {/* Day Header with Number & Task Pill */}
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center transition ${
                    isSelected 
                      ? 'bg-[#6366F1] text-white shadow-xs' 
                      : isToday 
                        ? 'bg-[#F59E0B] text-[#0B0F19]' 
                        : 'text-[#F1F5F9] group-hover:bg-[#1E273D]'
                  }`}>
                    {cell.day}
                  </span>

                  {cell.isCurrentMonth && (
                    <div className="flex items-center gap-1">
                      {pendingTasks.length > 0 && (
                        <span 
                          className="px-1.5 py-0.2 rounded-md bg-[#6366F1]/20 text-[#818CF8] text-[10px] font-bold border border-[#6366F1]/30 flex items-center gap-0.5"
                          title={`${pendingTasks.length} Görev`}
                        >
                          <CheckSquare className="w-2.5 h-2.5" />
                          <span>{pendingTasks.length}</span>
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddOnDate(`${dateStr}T19:00`);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-[10px] text-[#94A3B8] hover:text-[#6366F1] font-bold transition p-0.5"
                        title="Etkinlik Ekle"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Day Events Mini Pills */}
                <div className="space-y-1 overflow-y-auto max-h-[70px] scrollbar-thin">
                  {dayEvents.map(ev => (
                    <button
                      key={ev.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectEvent(ev);
                      }}
                      className="w-full text-left text-[10px] sm:text-[11px] p-1.5 rounded-md font-semibold truncate flex items-center gap-1 transition hover:brightness-110 shadow-xs border border-[#263047] cursor-pointer"
                      style={{
                        backgroundColor: '#1E273D',
                        color: '#F1F5F9',
                        borderLeft: `3px solid ${ev.color || '#6366F1'}`
                      }}
                      title={ev.title}
                    >
                      {ev.syncedToGoogle && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#6366F1] shrink-0" />
                      )}
                      <span className="truncate">{ev.title}</span>
                    </button>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* RIGHT SECTION (35% width): TaskPanel */}
      <div className="lg:col-span-4 h-[650px] lg:sticky lg:top-20">
        <TaskPanel
          tasks={tasks}
          userLoggedIn={userLoggedIn}
          onLogin={onLogin}
          onAddTask={onAddTask}
          onToggleTask={onToggleTask}
          onDeleteTask={onDeleteTask}
          onRefreshTasks={onRefreshTasks}
          isSyncing={isSyncing}
          onTriggerRollover={onTriggerRollover}
          isRollingOver={isRollingOver}
          onCreateTestTasks={onCreateTestTasks}
          isCreatingTestTasks={isCreatingTestTasks}
          selectedCalendarDate={selectedDate}
          onClearSelectedDate={onClearSelectedDate}
          lastRolloverCount={lastRolloverCount}
          isEmbedded={true}
        />
      </div>

    </div>
  );
};
