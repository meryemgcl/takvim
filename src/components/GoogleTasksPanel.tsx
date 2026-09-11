import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Calendar as CalendarIcon, 
  AlertCircle, 
  Clock, 
  Tag, 
  X, 
  Edit3, 
  Check, 
  Filter, 
  Search,
  Sparkles,
  ChevronRight,
  ListTodo,
  CheckSquare,
  RefreshCw,
  RotateCcw,
  ExternalLink,
  Info,
  Layers,
  FlaskConical,
  ArrowRightCircle,
  LogIn,
  CheckCircle
} from 'lucide-react';
import { GoogleTaskItem, TaskPriority, TaskItem } from '../types';
import { extractDateFromGoogleDue } from '../lib/googleTasksService';

interface GoogleTasksPanelProps {
  isOpen: boolean;
  onClose: () => void;
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
}

type FilterTab = 'all' | 'selected-date' | 'today' | 'overdue-rolled' | 'pending' | 'completed';

export const GoogleTasksPanel: React.FC<GoogleTasksPanelProps> = ({
  isOpen,
  onClose,
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
  lastRolloverCount = 0
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>(selectedCalendarDate ? 'selected-date' : 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  // New task form state
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newNotes, setNewNotes] = useState('');
  const [newDueDate, setNewDueDate] = useState(selectedCalendarDate || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync date tab when calendar date changes
  useEffect(() => {
    if (selectedCalendarDate) {
      setNewDueDate(selectedCalendarDate);
      setActiveTab('selected-date');
    }
  }, [selectedCalendarDate]);

  if (!isOpen) return null;

  const todayStr = new Date().toISOString().split('T')[0];

  const showFeedback = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setFeedbackMessage({ text, type });
    setTimeout(() => setFeedbackMessage(null), 5000);
  };

  const handleCreateTaskSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddTask({
        title: newTitle.trim(),
        notes: newNotes.trim() || undefined,
        due: newDueDate || undefined
      });
      setNewTitle('');
      setNewNotes('');
      setNewDueDate(selectedCalendarDate || '');
      setIsAddFormOpen(false);
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

  const handleDeleteClick = async (taskId: string, title: string) => {
    try {
      await onDeleteTask(taskId);
      showFeedback(`"${title}" Google Tasks'ten silindi.`);
    } catch (err: any) {
      showFeedback('Silme hatası: ' + err.message, 'error');
    }
  };

  const handleRolloverClick = async () => {
    try {
      const res = await onTriggerRollover();
      const count = res?.rolledOverCount ?? 0;
      if (count > 0) {
        showFeedback(`🚀 ${count} adet dünden kalan görev başarıyla BUGÜNE devredildi!`);
      } else {
        showFeedback('Devredilecek gecikmiş görev bulunamadı.', 'info');
      }
    } catch (err: any) {
      showFeedback('Devir işlemi sırasında hata: ' + err.message, 'error');
    }
  };

  const handleCreateTestClick = async () => {
    try {
      const res = await onCreateTestTasks();
      showFeedback(res?.message || '🧪 2 Adet Test Görevi (Dün + Bugün) Google Tasks hesabınıza eklendi!', 'success');
    } catch (err: any) {
      showFeedback('Test görevleri eklenirken hata: ' + err.message, 'error');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchNotes = (task.notes || '').toLowerCase().includes(q);
      if (!matchTitle && !matchNotes) return false;
    }

    const taskDate = extractDateFromGoogleDue(task.due);

    // Tab filter
    switch (activeTab) {
      case 'selected-date':
        return selectedCalendarDate ? taskDate === selectedCalendarDate : true;
      case 'today':
        return taskDate === todayStr;
      case 'overdue-rolled':
        return task.isRolledOver || (taskDate && taskDate < todayStr && task.status === 'needsAction');
      case 'pending':
        return task.status === 'needsAction';
      case 'completed':
        return task.status === 'completed';
      case 'all':
      default:
        return true;
    }
  });

  // Calculate statistics
  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const pendingCount = totalCount - completedCount;
  const overdueOrRolledCount = tasks.filter(t => {
    const d = extractDateFromGoogleDue(t.due);
    return t.isRolledOver || (d && d < todayStr && t.status === 'needsAction');
  }).length;
  const todayCount = tasks.filter(t => extractDateFromGoogleDue(t.due) === todayStr && t.status === 'needsAction').length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/60 backdrop-blur-xs flex justify-end transition-opacity">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-50 transform transition-transform animate-in slide-in-from-right duration-300">
        
        {/* Top Header */}
        <div className="bg-slate-900 text-white p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
              <CheckSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight text-white flex items-center gap-2">
                  Google Görevler
                </h2>
                <span className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30">
                  Google Tasks API v1
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {userLoggedIn ? 'Google hesabınızla gerçek zamanlı senkronize' : 'Google ile giriş yaparak doğrudan eşitleyin'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userLoggedIn ? (
              <button
                onClick={onRefreshTasks}
                disabled={isSyncing}
                title="Google Tasks ile şimdi yenile"
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin text-blue-400' : ''}`} />
              </button>
            ) : (
              <button
                onClick={onLogin}
                className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Giriş Yap</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toolbar: Rollover & Test Mode */}
        <div className="bg-slate-50 border-b border-slate-200 p-3.5 flex flex-wrap items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-2">
            {/* Daily Rollover Button */}
            <button
              onClick={handleRolloverClick}
              disabled={isRollingOver}
              title="Dünden kalan ve tamamlanmamış görevleri tespit edip bitiş tarihini 'Bugün' olarak günceller"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${isRollingOver ? 'animate-spin' : ''}`} />
              <span>Dünden Kalanları Bugüne Devret</span>
              {overdueOrRolledCount > 0 && (
                <span className="px-1.5 py-0.2 rounded bg-indigo-800 text-white text-[10px] font-black">
                  {overdueOrRolledCount}
                </span>
              )}
            </button>

            {/* Test Mode Button */}
            <button
              onClick={handleCreateTestClick}
              disabled={isCreatingTestTasks}
              title="Google Tasks'e otomatik 2 örnek görev (biri dünün tarihiyle, biri bugünün tarihiyle) ekler"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition shadow-xs cursor-pointer disabled:opacity-50"
            >
              <FlaskConical className={`w-3.5 h-3.5 ${isCreatingTestTasks ? 'animate-spin' : ''}`} />
              <span>🧪 Test Görevi Oluştur (Dün + Bugün)</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddFormOpen(!isAddFormOpen)}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span>Yeni Görev</span>
          </button>
        </div>

        {/* Feedback Banner */}
        {feedbackMessage && (
          <div className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 ${
            feedbackMessage.type === 'error'
              ? 'bg-rose-50 text-rose-800 border-b border-rose-200'
              : feedbackMessage.type === 'info'
              ? 'bg-blue-50 text-blue-800 border-b border-blue-200'
              : 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
          }`}>
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{feedbackMessage.text}</span>
          </div>
        )}

        {/* New Task Inline Form */}
        {isAddFormOpen && (
          <form onSubmit={handleCreateTaskSubmit} className="p-4 bg-slate-100 border-b border-slate-200 space-y-3">
            <div className="font-bold text-xs text-slate-800 flex items-center justify-between">
              <span>Google Tasks'e Yeni Görev Ekle</span>
              <button
                type="button"
                onClick={() => setIsAddFormOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-xs"
              >
                İptal
              </button>
            </div>

            <input
              type="text"
              required
              placeholder="Görev başlığı (örn: Python 100 Gün Proje Ödevi)..."
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none font-medium"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Bitiş Tarihi (Due Date)</label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={e => setNewDueDate(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 mb-0.5">Açıklama / Notlar (İsteğe Bağlı)</label>
                <input
                  type="text"
                  placeholder="Detay veya link ekleyin..."
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-300 bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="submit"
                disabled={isSubmitting || !newTitle.trim()}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Google Tasks\'e Ekleniyor...' : 'Google Tasks\'e Kaydet'}
              </button>
            </div>
          </form>
        )}

        {/* Search & Filter Tabs */}
        <div className="p-4 border-b border-slate-200 space-y-3 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Görevlerde veya notlarda ara..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ✕
              </button>
            )}
          </div>

          {/* Quick Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'all'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Tümü</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200/60 text-[10px]">
                {totalCount}
              </span>
            </button>

            {selectedCalendarDate && (
              <button
                onClick={() => setActiveTab('selected-date')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'selected-date'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Seçilen Gün ({selectedCalendarDate})</span>
                {onClearSelectedDate && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      onClearSelectedDate();
                      setActiveTab('all');
                    }}
                    className="hover:text-red-300 ml-1"
                  >
                    ✕
                  </span>
                )}
              </button>
            )}

            <button
              onClick={() => setActiveTab('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'today'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <span>Bugün</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-200/80 text-[10px]">
                {todayCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('overdue-rolled')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'overdue-rolled'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              <span>Dünden Devredenler</span>
              {overdueOrRolledCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-200 text-amber-950 font-black text-[10px]">
                  {overdueOrRolledCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'pending'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Bekleyenler</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200/60 text-[10px]">
                {pendingCount}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('completed')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'completed'
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>Tamamlananlar</span>
              <span className="px-1.5 py-0.2 rounded-full bg-slate-200/60 text-[10px]">
                {completedCount}
              </span>
            </button>
          </div>
        </div>

        {/* Task List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12 px-4 space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 mx-auto flex items-center justify-center shadow-xs">
                <ListTodo className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">
                {activeTab === 'selected-date'
                  ? `Seçili güne (${selectedCalendarDate}) ait görev bulunmuyor`
                  : activeTab === 'overdue-rolled'
                  ? 'Devredilen veya geciken görev bulunamadı'
                  : 'Görev listesi boş'}
              </h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Yeni bir görev ekleyebilir veya Google Tasks testini denemek için aşağıdaki butonu kullanabilirsiniz.
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <button
                  onClick={handleCreateTestClick}
                  disabled={isCreatingTestTasks}
                  className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition shadow-sm cursor-pointer"
                >
                  🧪 Test Görevi Oluştur (Dün + Bugün)
                </button>
              </div>
            </div>
          ) : (
            filteredTasks.map(task => {
              const isCompleted = task.status === 'completed';
              const dueDate = extractDateFromGoogleDue(task.due);
              const isPast = dueDate && dueDate < todayStr && !isCompleted;
              const isToday = dueDate === todayStr;

              return (
                <div
                  key={task.id}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 flex items-start gap-3 group ${
                    isCompleted
                      ? 'bg-slate-50/80 border-slate-200 opacity-60'
                      : task.isRolledOver || isPast
                      ? 'bg-amber-50/40 border-amber-200 hover:border-amber-300 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                  }`}
                >
                  {/* Interactive Checkbox */}
                  <button
                    type="button"
                    onClick={() => handleToggleClick(task)}
                    className="mt-0.5 text-slate-400 hover:text-blue-600 transition shrink-0 cursor-pointer"
                    title={isCompleted ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 group-hover:text-blue-500 hover:scale-110 transition-transform" />
                    )}
                  </button>

                  {/* Task Body */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className={`text-xs font-bold leading-snug break-words ${
                        isCompleted ? 'line-through text-slate-400' : 'text-slate-900'
                      }`}>
                        {task.title}
                      </h4>

                      <button
                        onClick={() => handleDeleteClick(task.id, task.title)}
                        title="Google Tasks'ten Sil"
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-rose-600 p-1 rounded transition shrink-0 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {task.notes && (
                      <p className="text-[11px] text-slate-500 leading-relaxed break-words line-clamp-2">
                        {task.notes}
                      </p>
                    )}

                    {/* Metadata & Rollover Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
                      {/* Due Date Badge */}
                      {dueDate ? (
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold ${
                          isCompleted
                            ? 'bg-slate-100 text-slate-500'
                            : isPast
                            ? 'bg-rose-100 text-rose-700 font-bold'
                            : isToday
                            ? 'bg-emerald-100 text-emerald-800 font-bold'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          <CalendarIcon className="w-3 h-3" />
                          <span>{dueDate === todayStr ? 'Bugün' : dueDate}</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-400 font-medium">
                          Tarihsiz
                        </span>
                      )}

                      {/* Rollover Tag */}
                      {(task.isRolledOver || (task.notes && task.notes.includes('Devredildi'))) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 font-bold border border-amber-200">
                          <RotateCcw className="w-2.5 h-2.5" />
                          <span>Dünden Devredildi</span>
                        </span>
                      )}

                      {/* Google Tasks Source indicator */}
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-medium">
                        Google Tasks
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Summary */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center gap-2">
            <span>Toplam: <strong className="text-slate-800">{totalCount}</strong></span>
            <span>•</span>
            <span>Tamamlanan: <strong className="text-emerald-600">{completedCount}</strong></span>
            <span>•</span>
            <span>Bekleyen: <strong className="text-slate-800">{pendingCount}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRolloverClick}
              disabled={isRollingOver}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Rollover Çalıştır</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
