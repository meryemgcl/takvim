import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  Sparkles,
  ListTodo,
  Check, 
  Filter, 
  Search,
  RefreshCw,
  RotateCcw,
  FlaskConical,
  LogIn,
  CheckSquare,
  Clock,
  ArrowRight,
  X
} from 'lucide-react';
import { GoogleTaskItem } from '../types';
import { extractDateFromGoogleDue } from '../lib/googleTasksService';

export interface TaskPanelProps {
  tasks: GoogleTaskItem[];
  userLoggedIn: boolean;
  onLogin: () => void;
  onAddTask: (task: {
    title: string;
    notes?: string;
    due?: string;
  }) => Promise<any>;
  onToggleTask: (taskId: string, isCompleted: boolean) => Promise<any>;
  onDeleteTask: (taskId: string) => Promise<any>;
  onRefreshTasks: () => Promise<any>;
  isSyncing: boolean;
  onTriggerRollover: () => Promise<any>;
  isRollingOver: boolean;
  onCreateTestTasks: () => Promise<any>;
  isCreatingTestTasks: boolean;
  selectedCalendarDate?: string | null; // e.g. "2026-08-29"
  onClearSelectedDate?: () => void;
  lastRolloverCount?: number;
  isEmbedded?: boolean;
  onClose?: () => void;
}

type FilterTab = 'selected-date' | 'all' | 'today' | 'rolled' | 'completed';

export const TaskPanel: React.FC<TaskPanelProps> = ({
  tasks,
  userLoggedIn,
  onLogin,
  onAddTask,
  onToggleTask,
  onDeleteTask,
  onRefreshTasks,
  isSyncing,
  onTriggerRollover,
  isRollingOver,
  onCreateTestTasks,
  isCreatingTestTasks,
  selectedCalendarDate,
  onClearSelectedDate,
  lastRolloverCount = 0,
  isEmbedded = true,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>(selectedCalendarDate ? 'selected-date' : 'today');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // Quick Task Form
  const [quickTitle, setQuickTitle] = useState('');
  const [quickNotes, setQuickNotes] = useState('');
  const [showNotesField, setShowNotesField] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

  // Auto-switch to selected date tab when date changes
  useEffect(() => {
    if (selectedCalendarDate) {
      setActiveTab('selected-date');
    }
  }, [selectedCalendarDate]);

  const showFeedback = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  const handleQuickAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    const targetDue = selectedCalendarDate || todayStr;
    setIsSubmitting(true);
    try {
      await onAddTask({
        title: quickTitle.trim(),
        notes: quickNotes.trim() || undefined,
        due: targetDue
      });
      setQuickTitle('');
      setQuickNotes('');
      setShowNotesField(false);
      showFeedback('Görev Google Tasks hesabınıza eklendi!', 'success');
    } catch (err: any) {
      showFeedback(err.message || 'Görev eklenirken hata oluştu', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleClick = async (task: GoogleTaskItem) => {
    const nextCompleted = task.status !== 'completed';
    try {
      await onToggleTask(task.id, nextCompleted);
      if (nextCompleted) {
        showFeedback(`✓ "${task.title}" tamamlandı olarak işaretlendi.`);
      }
    } catch (err: any) {
      showFeedback('Durum güncellenirken hata: ' + err.message, 'error');
    }
  };

  const handleTriggerRolloverClick = async () => {
    try {
      const res = await onTriggerRollover();
      if (res && res.rolledOverCount > 0) {
        showFeedback(`🎉 ${res.rolledOverCount} adet dünden kalan görev bugüne devredildi!`, 'success');
      } else {
        showFeedback('Geçmiş tarihli devredilecek görev bulunamadı.', 'info');
      }
    } catch (err: any) {
      showFeedback('Devir işlemi başarısız: ' + err.message, 'error');
    }
  };

  const handleCreateTestTasksClick = async () => {
    try {
      const res = await onCreateTestTasks();
      showFeedback(res?.message || '🧪 2 adet test görevi eklendi (1 Dün + 1 Bugün)', 'success');
    } catch (err: any) {
      showFeedback('Test görevleri eklenirken hata: ' + err.message, 'error');
    }
  };

  // Date Title Formatter (Turkish)
  const formatSelectedDateHeader = (dateStr?: string | null) => {
    if (!dateStr) return 'Bugünün Görevleri';
    
    const [y, m, d] = dateStr.split('-').map(Number);
    const months = [
      'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
      'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
    ];
    const monthName = months[m - 1] || '';
    
    const dateObj = new Date(y, m - 1, d);
    const days = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const dayName = days[dateObj.getDay()];

    const isToday = dateStr === todayStr;
    const isYesterday = (new Date(dateObj.getTime() + 86400000).toISOString().split('T')[0]) === todayStr;

    if (isToday) {
      return `${d} ${monthName} • Bugün (${dayName})`;
    }
    if (isYesterday) {
      return `${d} ${monthName} • Dün (${dayName})`;
    }
    return `${d} ${monthName} ${y} • ${dayName}`;
  };

  // Filter Tasks
  const filteredTasks = tasks.filter(t => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchNotes = t.notes ? t.notes.toLowerCase().includes(q) : false;
      const matchCat = t.category ? t.category.toLowerCase().includes(q) : false;
      if (!matchTitle && !matchNotes && !matchCat) return false;
    }

    const tDate = extractDateFromGoogleDue(t.due);
    const isCompleted = t.status === 'completed';

    switch (activeTab) {
      case 'selected-date':
        if (selectedCalendarDate) {
          return tDate === selectedCalendarDate;
        }
        return tDate === todayStr;
      case 'today':
        return tDate === todayStr;
      case 'rolled':
        return t.isRolledOver || (tDate && tDate < todayStr && !isCompleted);
      case 'completed':
        return isCompleted;
      case 'all':
      default:
        return true;
    }
  });

  // Calculate task counts
  const targetDateForCount = selectedCalendarDate || todayStr;
  const selectedDateCount = tasks.filter(t => extractDateFromGoogleDue(t.due) === targetDateForCount && t.status !== 'completed').length;
  const rolledOverCount = tasks.filter(t => {
    const d = extractDateFromGoogleDue(t.due);
    return (t.isRolledOver || (d && d < todayStr)) && t.status !== 'completed';
  }).length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className={`bg-[#151B2B] rounded-2xl border border-[#263047] shadow-xl flex flex-col h-full overflow-hidden ${isEmbedded ? '' : 'p-6'}`}>
      
      {/* 1. Header Section */}
      <div className="p-5 border-b border-[#263047] bg-[#101522] space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#6366F1]/15 text-[#6366F1] flex items-center justify-center font-bold border border-[#6366F1]/30">
                <ListTodo className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F1F5F9] tracking-tight">
                  Google Görevler
                </h3>
                <p className="text-xs text-[#94A3B8]">
                  {formatSelectedDateHeader(selectedCalendarDate || todayStr)}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Sync button */}
            <button
              onClick={onRefreshTasks}
              disabled={isSyncing}
              title="Google Tasks ile Senkronize Et"
              className="p-2 rounded-xl text-[#94A3B8] hover:text-[#6366F1] hover:bg-[#1E273D] transition cursor-pointer border border-transparent hover:border-[#263047]"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-[#6366F1]' : ''}`} />
            </button>

            {/* Rollover button */}
            <button
              onClick={handleTriggerRolloverClick}
              disabled={isRollingOver}
              title="Dünden kalan yapılmamış görevleri bugüne devret"
              className="px-2.5 py-1.5 rounded-xl bg-[#F59E0B]/20 hover:bg-[#F59E0B]/30 text-[#F59E0B] text-xs font-semibold flex items-center gap-1.5 transition border border-[#F59E0B]/40 shadow-xs cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRollingOver ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Devret</span>
            </button>

            {onClose && (
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#1E273D] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Selected Date Notice & Clear Badge */}
        {selectedCalendarDate && (
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#0B0F19] border border-[#263047] text-xs">
            <span className="text-[#F1F5F9] font-medium flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-[#6366F1]" />
              Takvimden Seçilen Gün: <strong className="text-[#F59E0B]">{selectedCalendarDate}</strong>
            </span>
            {onClearSelectedDate && (
              <button
                onClick={onClearSelectedDate}
                className="text-[#94A3B8] hover:text-[#F1F5F9] font-semibold text-[11px] underline cursor-pointer"
              >
                Bugüne Dön
              </button>
            )}
          </div>
        )}

        {/* Feedback Message */}
        {feedbackMessage && (
          <div className={`p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 animate-fadeIn ${
            feedbackMessage.type === 'success' 
              ? 'bg-[#6366F1]/15 text-[#818CF8] border border-[#6366F1]/30' 
              : feedbackMessage.type === 'error'
                ? 'bg-rose-950/50 text-rose-300 border border-rose-800'
                : 'bg-[#F59E0B]/15 text-[#F59E0B] border border-[#F59E0B]/30'
          }`}>
            <Check className="w-3.5 h-3.5 shrink-0 text-[#6366F1]" />
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* Quick Add Task Input */}
        <form onSubmit={handleQuickAdd} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder={`+ "${selectedCalendarDate || 'Bugün'}" için yeni görev ekle...`}
              value={quickTitle}
              onChange={e => setQuickTitle(e.target.value)}
              className="flex-1 px-3.5 py-2.5 text-xs bg-[#0B0F19] border border-[#263047] rounded-xl text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#6366F1]/40 focus:border-[#6366F1] transition font-medium"
            />
            <button
              type="submit"
              disabled={isSubmitting || !quickTitle.trim()}
              className="px-4 py-2.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md shadow-[#6366F1]/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Ekle</span>
            </button>
          </div>

          {/* Optional notes expandable */}
          {showNotesField ? (
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                placeholder="Açıklama / not (isteğe bağlı)..."
                value={quickNotes}
                onChange={e => setQuickNotes(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs bg-[#0B0F19] border border-[#263047] rounded-lg text-[#F1F5F9] placeholder-[#94A3B8] focus:outline-none focus:border-[#6366F1]"
              />
              <button
                type="button"
                onClick={() => setShowNotesField(false)}
                className="text-[11px] text-[#94A3B8] hover:text-[#F1F5F9]"
              >
                Gizle
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNotesField(true)}
              className="text-[11px] text-[#94A3B8] hover:text-[#6366F1] font-medium flex items-center gap-1 pl-1 cursor-pointer"
            >
              <span>+ Not veya link ekle</span>
            </button>
          )}
        </form>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
          <button
            type="button"
            onClick={() => setActiveTab('selected-date')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'selected-date'
                ? 'bg-[#6366F1] text-white shadow-xs'
                : 'bg-[#0B0F19] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#263047]'
            }`}
          >
            <span>{selectedCalendarDate ? 'Seçili Gün' : 'Bugün'}</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'selected-date' ? 'bg-white/20 text-white' : 'bg-[#1E273D] text-[#F1F5F9]'
            }`}>
              {selectedDateCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('rolled')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'rolled'
                ? 'bg-[#F59E0B] text-[#0B0F19] shadow-xs font-bold'
                : 'bg-[#F59E0B]/15 text-[#F59E0B] hover:bg-[#F59E0B]/25 border border-[#F59E0B]/30'
            }`}
          >
            <span>📌 Devredilenler</span>
            {rolledOverCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                activeTab === 'rolled' ? 'bg-[#0B0F19]/20 text-[#0B0F19]' : 'bg-[#F59E0B] text-[#0B0F19]'
              }`}>
                {rolledOverCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'all'
                ? 'bg-[#1E273D] text-white border border-[#6366F1]'
                : 'bg-[#0B0F19] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#263047]'
            }`}
          >
            <span>Tümü</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'all' ? 'bg-[#6366F1] text-white' : 'bg-[#1E273D] text-[#94A3B8]'
            }`}>
              {tasks.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('completed')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#1E273D] text-white border border-[#6366F1]'
                : 'bg-[#0B0F19] text-[#94A3B8] hover:text-[#F1F5F9] border border-[#263047]'
            }`}
          >
            <span>Tamamlanan</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
              activeTab === 'completed' ? 'bg-[#6366F1] text-white' : 'bg-[#1E273D] text-[#94A3B8]'
            }`}>
              {completedCount}
            </span>
          </button>
        </div>
      </div>

      {/* 2. Tasks List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0B0F19]/40 scrollbar-thin">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#1E273D] text-[#94A3B8] flex items-center justify-center mx-auto border border-[#263047]">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#F1F5F9]">Bu filtrede görev bulunamadı</p>
              <p className="text-[11px] text-[#94A3B8] mt-0.5">
                Yukarıdaki alandan yeni bir görev ekleyebilir veya test görevlerini deneyebilirsiniz.
              </p>
            </div>

            <button
              onClick={handleCreateTestTasksClick}
              disabled={isCreatingTestTasks}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#151B2B] border border-[#263047] text-[#6366F1] hover:bg-[#1E273D] text-xs font-semibold transition shadow-xs cursor-pointer"
            >
              <FlaskConical className="w-3.5 h-3.5" />
              <span>🧪 2 Adet Test Görevi Ekle</span>
            </button>
          </div>
        ) : (
          filteredTasks.map(task => {
            const isCompleted = task.status === 'completed';
            const dueDateStr = extractDateFromGoogleDue(task.due);
            const isOverdue = !isCompleted && dueDateStr && dueDateStr < todayStr;
            const isRolledOver = task.isRolledOver || isOverdue;

            return (
              <div
                key={task.id}
                className={`bg-[#151B2B] rounded-xl border p-3.5 transition-all group flex items-start gap-3 shadow-md hover:border-[#6366F1] ${
                  isCompleted 
                    ? 'border-[#263047] opacity-60 bg-[#101522]' 
                    : isRolledOver
                      ? 'border-[#F59E0B]/50 bg-[#151B2B] hover:border-[#F59E0B]'
                      : 'border-[#263047] hover:border-[#6366F1]'
                }`}
              >
                {/* Checkbox (Cosmic Indigo Style) */}
                <button
                  type="button"
                  onClick={() => handleToggleClick(task)}
                  className={`mt-0.5 w-5 h-5 rounded-lg flex items-center justify-center transition shrink-0 cursor-pointer border ${
                    isCompleted 
                      ? 'bg-[#6366F1] border-[#6366F1] text-white shadow-xs' 
                      : 'bg-[#0B0F19] border-[#263047] hover:border-[#6366F1] text-transparent hover:text-[#6366F1]/50'
                  }`}
                  title={isCompleted ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </button>

                {/* Task Body */}
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`text-xs font-semibold leading-snug break-words ${
                      isCompleted 
                        ? 'line-through text-[#64748B]' 
                        : 'text-[#F1F5F9]'
                    }`}>
                      {task.title}
                    </p>

                    {/* Delete action button */}
                    <button
                      type="button"
                      onClick={() => onDeleteTask(task.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-[#94A3B8] hover:text-[#EC4899] rounded-md transition cursor-pointer shrink-0"
                      title="Görevi sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Task Notes */}
                  {task.notes && (
                    <p className={`text-[11px] leading-relaxed break-words ${
                      isCompleted ? 'text-[#64748B]' : 'text-[#94A3B8]'
                    }`}>
                      {task.notes}
                    </p>
                  )}

                  {/* Task Badges & Date Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {/* "Dünden Devredildi" Amber Badge */}
                    {isRolledOver && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F59E0B]/20 text-[#F59E0B] font-bold text-[10px] border border-[#F59E0B]/40 shadow-xs">
                        <span>📌 Dünden Devredildi</span>
                        {task.rolledOverCount && task.rolledOverCount > 1 && (
                          <span className="px-1 py-0.2 rounded bg-[#F59E0B]/20 text-[9px]">
                            ({task.rolledOverCount}x)
                          </span>
                        )}
                      </span>
                    )}

                    {/* Due Date Badge */}
                    {dueDateStr && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#0B0F19] text-[#94A3B8] text-[10px] font-medium border border-[#263047]">
                        <Clock className="w-2.5 h-2.5 text-[#6366F1]" />
                        <span>
                          {dueDateStr === todayStr 
                            ? 'Bugün' 
                            : dueDateStr}
                        </span>
                      </span>
                    )}

                    {/* Category/Program Tag */}
                    {task.category && (() => {
                      const cat = task.category.toLowerCase();
                      let badgeCls = 'bg-[#6366F1]/15 text-[#A5B4FC] border-[#6366F1]/40';
                      let dotColor = '#6366F1';
                      if (cat.includes('tübitak') || cat.includes('tubitak') || cat.includes('proje')) {
                        badgeCls = 'bg-[#8B5CF6]/15 text-[#C4B5FD] border-[#8B5CF6]/40';
                        dotColor = '#8B5CF6';
                      } else if (cat.includes('kpss') || cat.includes('eğitim') || cat.includes('ders')) {
                        badgeCls = 'bg-[#6366F1]/15 text-[#A5B4FC] border-[#6366F1]/40';
                        dotColor = '#6366F1';
                      } else if (cat.includes('kariyer') || cat.includes('staj') || cat.includes('cezeri') || cat.includes('fergani') || cat.includes('akbank')) {
                        badgeCls = 'bg-[#06B6D4]/15 text-[#67E8F9] border-[#06B6D4]/40';
                        dotColor = '#06B6D4';
                      } else if (cat.includes('kişisel') || cat.includes('rutin')) {
                        badgeCls = 'bg-[#F59E0B]/15 text-[#FDE68A] border-[#F59E0B]/40';
                        dotColor = '#F59E0B';
                      }

                      return (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${badgeCls}`}>
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
                          {task.category}
                        </span>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 3. Footer Section (Account status & Test actions) */}
      <div className="p-4 border-t border-[#263047] bg-[#101522] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={handleCreateTestTasksClick}
            disabled={isCreatingTestTasks}
            className="px-2.5 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-[#1E273D] text-[#818CF8] font-bold text-[11px] flex items-center gap-1.5 transition border border-[#263047] cursor-pointer"
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Test Görevleri</span>
          </button>
        </div>

        <div>
          {userLoggedIn ? (
            <div className="inline-flex items-center gap-1.5 text-[11px] text-[#818CF8] font-semibold bg-[#6366F1]/15 px-2.5 py-1 rounded-xl border border-[#6366F1]/30">
              <span className="w-2 h-2 rounded-full bg-[#6366F1] animate-pulse" />
              <span>Google Tasks Bağlı</span>
            </div>
          ) : (
            <button
              onClick={onLogin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs transition cursor-pointer shadow-xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google ile Giriş Yap</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
