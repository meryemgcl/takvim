import React, { useState, useEffect } from 'react';
import { 
  Calendar as CalendarIcon, List, Sparkles, Filter, Search, Download, 
  CheckCircle2, Clock, ShieldAlert, Plus, ExternalLink, RefreshCw, Info, AlertCircle, BookOpen, Video, UserCheck, FileSpreadsheet, Mail, Bell, BellRing, Rocket, Zap, Target, TrendingUp, Award, ChevronRight
} from 'lucide-react';
import { CalendarEvent, EventType, UserAuth, ViewMode, EventDeliverable } from './types';
import { INITIAL_EVENTS } from './data/initialEvents';
import { InnovationTemplate } from './data/innovationTemplates';
import { Header } from './components/Header';
import { Sidebar, MainNavSection } from './components/Sidebar';
import { SettingsSyncModal } from './components/SettingsSyncModal';
import { EventCard } from './components/EventCard';
import { CalendarView } from './components/CalendarView';
import { NordicCalendarLayout } from './components/NordicCalendarLayout';
import { TaskPanel } from './components/TaskPanel';
import { InnovationRoadmapView } from './components/InnovationRoadmapView';
import { InnovationRadar } from './components/InnovationRadar';
import { ProgressDashboard } from './components/ProgressDashboard';
import { BulkSyncModal } from './components/BulkSyncModal';
import { AddEditEventModal } from './components/AddEditEventModal';
import { AiParseModal } from './components/AiParseModal';
import { ConfirmationModal } from './components/ConfirmationModal';
import { GmailModal } from './components/GmailModal';
import { NotificationManagerModal } from './components/NotificationManagerModal';
import { ConflictModal } from './components/ConflictModal';
import { PdfReportModal } from './components/PdfReportModal';
import { QueueMonitorModal } from './components/QueueMonitorModal';
import { useAsyncQueueSSE } from './lib/useAsyncQueueSSE';
import { initAuth, googleSignIn, logout } from './lib/firebase';
import { addEventToGoogleCalendar, deleteEventFromGoogleCalendar } from './lib/googleCalendar';
import { downloadICSFile } from './lib/icsGenerator';
import { exportEventsToCSV, exportEventsToGoogleCalendarCSV } from './lib/exportUtils';
import { detectEventConflicts, getConflictingEventIdsSet } from './lib/conflictService';
import { setupBeforeInstallPrompt, promptPWAInstall } from './lib/pwaService';
import { 
  getNotificationPermission, 
  requestNotificationPermission, 
  checkUpcomingEventReminders, 
  sendTestNotification 
} from './lib/notificationService';
import { useDailyTasks } from './lib/useDailyTasks';

export default function App() {
  const [user, setUser] = useState<UserAuth | null>(null);
  
  // Google Tasks (v1 API) & Daily Rollover State Management Hook
  const {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    fetchTasksFromGoogle,
    triggerManualRollover,
    createTestTasks,
    isSyncing: isSyncingGoogleTasks,
    isRollingOver,
    isCreatingTestTasks,
    lastRolloverReport,
    stats: taskStats
  } = useDailyTasks(user?.accessToken);

  const [selectedCalendarDateForTasks, setSelectedCalendarDateForTasks] = useState<string | null>(null);

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('akbank_ai_calendar_events');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const missing = INITIAL_EVENTS.filter(initEv => !parsed.some((p: any) => p.id === initEv.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem('akbank_ai_calendar_events', JSON.stringify(merged));
          return merged;
        }
        return parsed;
      } catch {
        return INITIAL_EVENTS;
      }
    }
    return INITIAL_EVENTS;
  });

  const [filterProgram, setFilterProgram] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');

  // Sidebar Layout State
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isBulkSyncModalOpen, setIsBulkSyncModalOpen] = useState(false);
  const [isGmailModalOpen, setIsGmailModalOpen] = useState(false);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [canInstallPWA, setCanInstallPWA] = useState(false);
  const [selectedEditEvent, setSelectedEditEvent] = useState<CalendarEvent | null>(null);
  const [addModalDefaultDate, setAddModalDefaultDate] = useState<string>('');
  const [isTestingBriefing, setIsTestingBriefing] = useState<boolean>(false);
  const [isSyncingHistory, setIsSyncingHistory] = useState<boolean>(false);

  // Background Automatic Persistent JSON Sync (Zero Data Loss guarantee)
  useEffect(() => {
    if (!tasks || tasks.length === 0) return;
    const timer = setTimeout(() => {
      fetch('/api/tasks/history/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      }).catch(err => console.warn('Background dataset sync note:', err.message));
    }, 1500);
    return () => clearTimeout(timer);
  }, [tasks]);

  const handleSyncPersistentHistory = async () => {
    setIsSyncingHistory(true);
    try {
      const response = await fetch('/api/tasks/history/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks })
      });
      if (response.ok) {
        showToast('💾 Görevler ve tarihçe kalıcı veritabanına (tasks_history.json) başarıyla kaydedildi!');
      }
    } catch (err) {
      console.error('Failed syncing to persistent dataset:', err);
    } finally {
      setIsSyncingHistory(false);
    }
  };

  // =========================================================================
  // ARCHITECTURAL MANDATE: Calendar-to-Tasks Daily Sync
  // Every day, all active calendar events scheduled for that day are automatically
  // processed, structured with 3-stage breakdown, and mirrored into Google Tasks.
  // =========================================================================
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const todayEvents = events.filter(e => {
      const eventDate = e.startDate.split('T')[0];
      return eventDate === todayStr;
    });

    if (todayEvents.length === 0) return;

    todayEvents.forEach(ev => {
      const cleanTitle = ev.title.replace(/^(🚨|⚡|📌|ℹ️)\s*\[P\d\]\s*/i, '').trim();
      const badge = ev.priority === 'critical' ? '🚨 [P0]' :
                    ev.priority === 'high' ? '⚡ [P1]' :
                    ev.priority === 'low' ? 'ℹ️ [P3]' : '📌 [P2]';

      const taskTitle = ev.title.startsWith('🚨') || ev.title.startsWith('⚡') || ev.title.startsWith('📌') || ev.title.startsWith('ℹ️') 
        ? ev.title 
        : `${badge} ${ev.title}`;

      // Deterministic Idempotency Hash (Event ID + Due Date)
      const syncHash = `cal_sync_${ev.id}_${todayStr}`;
      const updatedAt = new Date().toISOString();

      const prep = ev.deliverables?.find(d => d.text.toLowerCase().includes('hazırlık') || d.text.toLowerCase().includes('prep'))?.text ||
        `[Hazırlık]: ${cleanTitle} için toplantı bağlantısı, platform ve teknik ortam testini tamamla.`;
      const exec = ev.deliverables?.find(d => d.text.toLowerCase().includes('uygulama') || d.text.toLowerCase().includes('exec'))?.text ||
        `[Uygulama]: Canlı oturuma aktif katılım sağla, notları al ve temel çalışmaları tamamla.`;
      const deliv = ev.deliverables?.find(d => d.text.toLowerCase().includes('teslimat') || d.text.toLowerCase().includes('takip') || d.text.toLowerCase().includes('deliv'))?.text ||
        `[Teslimat / Takip]: İlgili doküman ve çıktıları kaydet, bir sonraki adımı planla.`;

      const notes = `🏢 Program: ${ev.program}\n` +
        `💻 Format / Konum: ${ev.location || 'Online'}\n` +
        `⏰ Saat: ${ev.startDate.includes('T') ? ev.startDate.split('T')[1].substring(0, 5) : 'Gün Boyu'}\n` +
        (ev.link ? `🔗 Bağlantı: ${ev.link}\n` : '') +
        `\n📋 3 Aşamalı Kontrol Listesi:\n` +
        `• ${prep}\n` +
        `• ${exec}\n` +
        `• ${deliv}`;

      addTask({
        title: taskTitle,
        notes,
        due: todayStr,
        syncHash,
        updated_at: updatedAt,
        priority: ev.priority as any,
        category: ev.program
      });
    });
  }, [events, tasks.length]);

  // Asenkron Olay Yöneticisi & SSE Canlı Akış Hook'u
  const {
    isConnected: isSSEConnected,
    lastPing,
    jobs: queueJobs,
    stats: queueStats,
    notifications: liveNotifications,
    activeToast: sseToast,
    dismissToast: dismissSSEToast,
    simulateScenario,
    clearCache: clearQueueCache,
    refreshJobs
  } = useAsyncQueueSSE();

  // Setup PWA prompt listener
  useEffect(() => {
    setupBeforeInstallPrompt((canInstall) => {
      setCanInstallPWA(canInstall);
    });
  }, []);

  const handleInstallPWA = async () => {
    const installed = await promptPWAInstall();
    if (installed) {
      showToast('🚀 Uygulama masaüstünüze/cihazınıza başarıyla yüklendi!');
    }
  };

  // Detect time conflicts across all events
  const conflicts = detectEventConflicts(events);
  const conflictingEventIds = getConflictingEventIdsSet(events);

  // Notification states
  const [notificationPermission, setNotificationPermission] = useState<string>(() => getNotificationPermission());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('calendar_sound_enabled');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [notifiedKeys, setNotifiedKeys] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('notified_event_keys');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  // Confirmation Modal state
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    isDestructive?: boolean;
    confirmText?: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {}
  });

  // Loading states
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [syncingEventId, setSyncingEventId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize Firebase Auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (authUser, token) => {
        setUser({
          displayName: authUser.displayName,
          email: authUser.email,
          photoURL: authUser.photoURL,
          uid: authUser.uid,
          accessToken: token
        });
      },
      () => {
        setUser(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('akbank_ai_calendar_events', JSON.stringify(events));
  }, [events]);

  // Periodic check for upcoming events (15 minutes before start)
  useEffect(() => {
    const runReminderCheck = () => {
      setNotificationPermission(getNotificationPermission());
      const result = checkUpcomingEventReminders(events, notifiedKeys);
      if (result.newNotifiedIds.length > 0) {
        setNotifiedKeys(prev => {
          const updated = new Set([...prev, ...result.newNotifiedIds]);
          localStorage.setItem('notified_event_keys', JSON.stringify(Array.from(updated)));
          return updated;
        });

        result.notificationsSent.forEach(({ event, minutesLeft }) => {
          const minText = minutesLeft === 0 ? 'şimdi başlıyor!' : `${minutesLeft} dakika içinde başlıyor.`;
          setToastMessage(`⏰ Hatırlatma: "${event.title}" ${minText}`);
          setTimeout(() => setToastMessage(null), 6000);
        });
      }
    };

    runReminderCheck();
    const interval = setInterval(runReminderCheck, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [events, notifiedKeys]);

  const handleToggleSound = () => {
    setSoundEnabled(prev => {
      const next = !prev;
      localStorage.setItem('calendar_sound_enabled', JSON.stringify(next));
      return next;
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Auth actions
  const handleLogin = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      const res = await googleSignIn();
      if (res) {
        setUser({
          displayName: res.user.displayName,
          email: res.user.email,
          photoURL: res.user.photoURL,
          uid: res.user.uid,
          accessToken: res.accessToken
        });
        showToast(`Hoş geldiniz ${res.user.displayName || res.user.email}! Google Takvim bağlandı.`);
      }
    } catch (err: any) {
      const msg = String(err?.message || '');
      const code = String(err?.code || '');
      if (msg.includes('cancelled-popup-request') || code.includes('cancelled-popup-request')) {
        // Benign cancellation - user closed or another click superseded
        return;
      }
      if (msg.includes('popup-closed-by-user') || code.includes('popup-closed-by-user')) {
        showToast('Giriş penceresi kapatıldı.');
      } else if (msg.includes('popup-blocked') || code.includes('popup-blocked')) {
        showToast('Açılır pencere (popup) engellendi. Lütfen tarayıcınızdan pop-up pencerelere izin verin.');
      } else if (msg.includes('Database is closing') || msg.includes('closing/hidden')) {
        showToast('Oturum depolaması yenilendi. Lütfen tekrar "Giriş Yap" butonuna tıklayın.');
      } else {
        console.error('Login error:', err);
        showToast('Giriş yapılırken bir sorun oluştu: ' + (err.message || ''));
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    showToast('Oturum kapatıldı.');
  };

  // Single Event Sync to Google Calendar
  const handleSyncToGoogle = async (event: CalendarEvent) => {
    if (!user || !user.accessToken) {
      handleLogin();
      return;
    }

    setSyncingEventId(event.id);
    try {
      const res = await addEventToGoogleCalendar(user.accessToken, event);
      setEvents(prev =>
        prev.map(e =>
          e.id === event.id
            ? { ...e, syncedToGoogle: true, googleCalendarEventId: res.id }
            : e
        )
      );
      showToast(`"${event.title}" Google Takviminize eklendi.`);
    } catch (err: any) {
      showToast('Takvime eklenirken bir hata oluştu: ' + err.message);
    } finally {
      setSyncingEventId(null);
    }
  };

  // Remove from Google Calendar (with mandatory confirmation)
  const handleRemoveFromGoogle = (event: CalendarEvent) => {
    if (!event.googleCalendarEventId) return;

    setConfirmConfig({
      isOpen: true,
      title: "Google Takvim'den Kaldır",
      message: `"${event.title}" etkinliğini Google Takviminizden kaldırmak istediğinize emin misiniz?`,
      confirmText: "Kaldır",
      isDestructive: true,
      onConfirm: async () => {
        if (!user?.accessToken || !event.googleCalendarEventId) return;
        try {
          await deleteEventFromGoogleCalendar(user.accessToken, event.googleCalendarEventId);
          setEvents(prev =>
            prev.map(e =>
              e.id === event.id
                ? { ...e, syncedToGoogle: false, googleCalendarEventId: undefined }
                : e
            )
          );
          showToast(`"${event.title}" Google Takvim'den kaldırıldı.`);
        } catch (err: any) {
          showToast('Kaldırılırken hata oluştu: ' + err.message);
        }
      }
    });
  };

  // Bulk Sync to Google Calendar
  const handleConfirmBulkSync = async (selectedEvents: CalendarEvent[]) => {
    if (!user || !user.accessToken) {
      handleLogin();
      return;
    }

    setIsSyncing(true);
    let successCount = 0;
    const updatedEvents = [...events];

    for (const ev of selectedEvents) {
      try {
        const res = await addEventToGoogleCalendar(user.accessToken, ev);
        const idx = updatedEvents.findIndex(e => e.id === ev.id);
        if (idx !== -1) {
          updatedEvents[idx] = {
            ...updatedEvents[idx],
            syncedToGoogle: true,
            googleCalendarEventId: res.id
          };
        }
        successCount++;
      } catch (err) {
        console.error('Failed to sync event:', ev.title, err);
      }
    }

    setEvents(updatedEvents);
    setIsSyncing(false);
    setIsBulkSyncModalOpen(false);
    showToast(`${successCount} etkinlik Google Takviminize aktarıldı.`);
  };

  // Event completion toggle
  const handleToggleComplete = (eventId: string) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, completed: !e.completed } : e))
    );
  };

  // Save (Create/Update) local event
  const handleSaveEvent = (savedEvent: CalendarEvent) => {
    setEvents(prev => {
      const exists = prev.some(e => e.id === savedEvent.id);
      if (exists) {
        return prev.map(e => (e.id === savedEvent.id ? savedEvent : e));
      } else {
        return [savedEvent, ...prev];
      }
    });
    showToast(`"${savedEvent.title}" ajandanıza kaydedildi.`);
  };

  // Update reminder minutes
  const handleUpdateReminder = (eventId: string, minutes: number) => {
    setEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, reminderMinutes: minutes } : e))
    );
    const label =
      minutes === 1440 ? '1 Gün Önce' :
      minutes === 720 ? '12 Saat Önce' :
      minutes === 120 ? '2 Saat Önce' :
      minutes === 60 ? '1 Saat Önce' :
      minutes === 30 ? '30 Dakika Önce' :
      minutes === 15 ? '15 Dakika Önce' : 'Hatırlatıcı Yok';
    showToast(`Hatırlatıcı zamanı güncellendi: ${label}`);
  };

  // Delete local event (with confirmation)
  const handleDeleteEvent = (event: CalendarEvent) => {
    setConfirmConfig({
      isOpen: true,
      title: "Etkinliği Kaldır",
      message: `"${event.title}" etkinliğini ajandanızdan çıkarmak istediğinize emin misiniz?`,
      confirmText: "Kaldır",
      isDestructive: true,
      onConfirm: () => {
        setEvents(prev => prev.filter(e => e.id !== event.id));
        showToast(`"${event.title}" ajandadan çıkarıldı.`);
      }
    });
  };

  // Update deliverable item completed state
  const handleUpdateDeliverable = (eventId: string, deliverableId: string, completed: boolean) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== eventId) return ev;
        const currentDeliverables = ev.deliverables || [];
        const updatedDeliverables = currentDeliverables.map(d =>
          d.id === deliverableId ? { ...d, completed } : d
        );
        return { ...ev, deliverables: updatedDeliverables };
      })
    );
  };

  // Add custom deliverable item
  const handleAddCustomDeliverable = (eventId: string, text: string) => {
    setEvents(prev =>
      prev.map(ev => {
        if (ev.id !== eventId) return ev;
        const currentDeliverables = ev.deliverables || [];
        const newDel: EventDeliverable = {
          id: `del-${Date.now()}`,
          text,
          completed: false
        };
        return { ...ev, deliverables: [...currentDeliverables, newDel] };
      })
    );
    showToast('Teslim / evrak kontrol maddesi eklendi.');
  };

  // Add event from Innovation Template
  const handleAddFromTemplate = (template: InnovationTemplate) => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 7);
    startDate.setHours(10, 0, 0, 0);

    const endDate = new Date(startDate);
    endDate.setHours(startDate.getHours() + template.defaultDurationHours);

    const deliverablesFormatted: EventDeliverable[] = template.deliverables.map((d, idx) => ({
      id: `del-tmpl-${Date.now()}-${idx}`,
      text: d.text,
      completed: d.done
    }));

    const newEv: CalendarEvent = {
      id: `tmpl-${Date.now()}`,
      title: template.name,
      description: template.description,
      startDate: startDate.toISOString().slice(0, 16),
      endDate: endDate.toISOString().slice(0, 16),
      allDay: false,
      location: 'Online / Çalışma Alanı',
      type: template.type,
      program: template.category,
      isMandatory: template.isMandatory,
      color: template.color,
      reminderMinutes: 1440,
      trlLevel: template.trlLevel,
      priority: template.priority,
      tags: template.tags,
      deliverables: deliverablesFormatted
    };

    setEvents(prev => [newEv, ...prev]);
    showToast(`"${template.name}" takviminize eklendi.`);
  };

  // AI Parsed events handler
  const handleEventsParsed = (newEvents: CalendarEvent[]) => {
    setEvents(prev => [...newEvents, ...prev]);
    showToast(`${newEvents.length} yeni etkinlik ajandanıza eklendi.`);
  };

  // Download all filtered events as ICS
  const handleDownloadAllICS = () => {
    downloadICSFile(filteredEvents, 'etkinlik-ajandasi.ics');
    showToast('Takvim dosyanız (.ics) indirildi.');
  };

  // Download all filtered events as CSV
  const handleDownloadCSV = () => {
    exportEventsToCSV(filteredEvents, 'etkinlik-ajandasi.csv');
    showToast('Etkinlik tablosu (.csv) indirildi.');
  };

  // 06:00 Günlük Sabah Brifingini Manuel Test Etme & Gmail ile Gönderme
  const handleTestMorningBriefing = async () => {
    setIsTestingBriefing(true);
    showToast('⏳ 06:00 Sabah Raporu hazırlanıyor ve Gmail ile gönderiliyor...');
    try {
      // Hafifletilmiş ve filtrelenmiş verileri gönder
      const sanitizedTasks = (tasks || []).map(t => ({
        id: t.id,
        title: t.title,
        due: (t as any).due || (t as any).dueDate,
        dueDate: (t as any).dueDate || (t as any).due,
        status: (t as any).status || (t.completed ? 'completed' : 'needsAction'),
        completed: t.completed,
        priority: (t as any).priority,
        category: (t as any).category,
        notes: (t as any).notes,
        isRolledOver: (t as any).isRolledOver,
        rolledOverFrom: (t as any).rolledOverFrom,
        rolledOverCount: (t as any).rolledOverCount
      }));

      const sanitizedEvents = (events || []).map(e => ({
        id: e.id,
        title: e.title,
        description: e.description ? e.description.slice(0, 300) : '',
        startDate: e.startDate,
        endDate: e.endDate,
        allDay: e.allDay,
        location: e.location,
        link: e.link,
        type: e.type,
        program: e.program,
        priority: e.priority,
        isMandatory: e.isMandatory
      }));

      const response = await fetch('/api/morning-briefing/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientEmail: user?.email || 'meriguclu123@gmail.com',
          accessToken: user?.accessToken,
          localTasks: sanitizedTasks,
          localEvents: sanitizedEvents,
          forceDateStr: selectedCalendarDateForTasks || new Date().toISOString().split('T')[0]
        })
      });

      const contentType = response.headers.get('content-type') || '';
      let data: any = {};
      if (contentType.includes('application/json')) {
        data = await response.json();
      } else {
        const text = await response.text();
        data = { success: response.ok, error: text };
      }

      if (data.success) {
        showToast('✅ 06:00 Raporu Gmail kutunuza gönderildi!');
      } else {
        showToast(`⚠️ ${data.report?.message || data.error || '06:00 Raporu işlendi.'}`);
      }
    } catch (err: any) {
      console.error('Morning briefing trigger error:', err);
      showToast(`❌ Rapor gönderilemedi: ${err.message}`);
    } finally {
      setIsTestingBriefing(false);
    }
  };

  // Filter logic
  const filteredEvents = events.filter(e => {
    // Program filter
    if (filterProgram !== 'all' && e.program !== filterProgram) return false;

    // Type filter
    if (filterType !== 'all' && e.type !== filterType) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = e.title.toLowerCase().includes(q);
      const matchDesc = e.description?.toLowerCase().includes(q);
      const matchLoc = e.location?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchLoc) return false;
    }

    return true;
  });

  // Calculate statistics
  const totalCount = events.length;
  const mandatoryCount = events.filter(e => e.isMandatory).length;
  const completedCount = events.filter(e => e.completed).length;
  const syncedCount = events.filter(e => e.syncedToGoogle).length;

  // Compute program counts for sidebar
  const programCounts: { [key: string]: number } = {};
  events.forEach(e => {
    if (e.program) {
      programCounts[e.program] = (programCounts[e.program] || 0) + 1;
    }
  });

  // Map MainNavSection to ViewMode
  const handleSidebarSelectSection = (section: MainNavSection) => {
    if (section === 'calendar') {
      setViewMode('calendar');
    } else if (section === 'roadmap') {
      setViewMode('roadmap');
    } else if (section === 'tasks') {
      setViewMode('calendar'); // Tasks are integrated in the calendar split view
    }
  };

  const currentSidebarSection: MainNavSection = 
    viewMode === 'roadmap' ? 'roadmap' : 'calendar';

  const getPageHeaderTitle = () => {
    if (viewMode === 'roadmap') return 'Stratejik Yol Haritası & TRL';
    if (viewMode === 'list') return 'Etkinlik ve Staj Listesi';
    return 'Ajanda & Google Görevler';
  };

  const getPageHeaderSubtitle = () => {
    if (filterProgram !== 'all') {
      return `Filtre: ${filterProgram.toUpperCase()}`;
    }
    return 'Ulusal İnovasyon, Ar-Ge ve Kariyer Takvimi';
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F1F5F9] font-sans flex overflow-x-hidden selection:bg-[#6366F1] selection:text-white">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#151B2B] text-[#F1F5F9] px-5 py-3.5 rounded-2xl shadow-2xl border border-[#6366F1]/50 text-xs sm:text-sm font-semibold flex items-center gap-3 animate-fade-in">
          <div className="w-2.5 h-2.5 rounded-full bg-[#6366F1] animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. Collapsible Left Sidebar (İçindekiler) */}
      <Sidebar
        currentSection={currentSidebarSection}
        onSelectSection={handleSidebarSelectSection}
        selectedProgram={filterProgram}
        onSelectProgram={(prog) => {
          setFilterProgram(prog);
        }}
        programCounts={programCounts}
        pendingTasksCount={taskStats.pending}
        totalEventsCount={totalCount}
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenQueueMonitor={() => setIsQueueModalOpen(true)}
        isSSEConnected={isSSEConnected}
        onTestMorningBriefing={handleTestMorningBriefing}
        isTestingBriefing={isTestingBriefing}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-72'
      }`}>
        
        {/* Simplified Single-Line Header */}
        <Header
          user={user}
          onLogin={handleLogin}
          onOpenAddModal={() => {
            setSelectedEditEvent(null);
            setAddModalDefaultDate('');
            setIsAddModalOpen(true);
          }}
          onOpenPdfReport={() => setIsPdfModalOpen(true)}
          onOpenQueueMonitor={() => setIsQueueModalOpen(true)}
          isSSEConnected={isSSEConnected}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(prev => !prev)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          title={getPageHeaderTitle()}
          subtitle={getPageHeaderSubtitle()}
        />

        {/* Main Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* Real-Time Live Progress Dashboard & Persistent Dataset Radar */}
          <ProgressDashboard 
            tasks={tasks}
            onToggleTask={toggleTask}
            onSyncPersistentHistory={handleSyncPersistentHistory}
            isSyncingHistory={isSyncingHistory}
          />

          {/* Secondary View Switcher & Filter Pills */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-[#151B2B] p-3.5 rounded-2xl border border-[#263047]">
            {/* View Switcher Pills */}
            <div className="flex items-center gap-1.5 bg-[#0B0F19] p-1 rounded-xl border border-[#263047]">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'calendar' 
                    ? 'bg-[#6366F1] text-white shadow-xs' 
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                <CalendarIcon className="w-3.5 h-3.5" />
                <span>Takvim & Görevler</span>
              </button>

              <button
                onClick={() => setViewMode('roadmap')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'roadmap' 
                    ? 'bg-[#6366F1] text-white shadow-xs' 
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                <Rocket className="w-3.5 h-3.5" />
                <span>İnovasyon Matrisi</span>
              </button>

              <button
                onClick={() => setViewMode('list')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer ${
                  viewMode === 'list' 
                    ? 'bg-[#6366F1] text-white shadow-xs' 
                    : 'text-[#94A3B8] hover:text-[#F1F5F9]'
                }`}
              >
                <List className="w-3.5 h-3.5" />
                <span>Liste</span>
              </button>
            </div>

            {/* Quick Type Filter & Action Helpers */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <div className="flex items-center gap-1.5 text-xs text-[#94A3B8]">
                <Filter className="w-3.5 h-3.5 text-[#6366F1]" />
                <select
                  value={filterType}
                  onChange={e => setFilterType(e.target.value)}
                  className="px-2.5 py-1.5 border border-[#263047] rounded-xl bg-[#0B0F19] text-[#F1F5F9] font-medium focus:outline-none focus:border-[#6366F1] text-xs"
                >
                  <option value="all">Tüm Türler</option>
                  <option value="webinar">Canlı Oturumlar</option>
                  <option value="self-paced">Bireysel Eğitimler</option>
                  <option value="meeting">Mentor & Tanışma</option>
                  <option value="submission">Son Başvuru / Sınav</option>
                  <option value="workshop">Uygulamalı Atölyeler</option>
                </select>
              </div>

              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-[#0B0F19] hover:bg-[#1E273D] text-[#94A3B8] hover:text-[#F1F5F9] text-xs font-semibold border border-[#263047] transition cursor-pointer flex items-center gap-1.5"
                title="Ayarlar, İçe/Dışa Aktar & Bildirimler"
              >
                <RefreshCw className="w-3 h-3 text-[#6366F1]" />
                <span>Senkronizasyon</span>
              </button>
            </div>
          </div>

          {/* Active Filter Indicator Tag */}
          {filterProgram !== 'all' && (
            <div className="flex items-center justify-between px-4 py-2.5 bg-[#151B2B] rounded-xl border border-[#263047] text-xs">
              <div className="flex items-center gap-2 text-[#94A3B8]">
                <span>Filtrelenen Kategori:</span>
                <span className="font-bold text-[#F59E0B] px-2 py-0.5 rounded-md bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                  {filterProgram}
                </span>
                <span className="text-[#94A3B8]">({filteredEvents.length} Etkinlik)</span>
              </div>
              <button
                onClick={() => setFilterProgram('all')}
                className="text-xs font-semibold text-[#818CF8] hover:text-[#A5B4FC] underline cursor-pointer"
              >
                Filtreyi Temizle
              </button>
            </div>
          )}

          {/* 3. Primary Views Routing */}
          {viewMode === 'roadmap' ? (
            <InnovationRoadmapView
              events={events}
              user={user}
              onSyncToGoogle={handleSyncToGoogle}
              onToggleComplete={handleToggleComplete}
              onEdit={ev => {
                setSelectedEditEvent(ev);
                setIsAddModalOpen(true);
              }}
              onAddFromTemplate={handleAddFromTemplate}
              onUpdateDeliverable={handleUpdateDeliverable}
              onAddCustomDeliverable={handleAddCustomDeliverable}
            />
          ) : viewMode === 'calendar' ? (
            <NordicCalendarLayout
              events={filteredEvents}
              tasks={tasks}
              userLoggedIn={!!user?.accessToken}
              onLogin={handleLogin}
              onAddTask={addTask}
              onToggleTask={toggleTask}
              onDeleteTask={deleteTask}
              onRefreshTasks={fetchTasksFromGoogle}
              isSyncing={isSyncingGoogleTasks}
              onTriggerRollover={triggerManualRollover}
              isRollingOver={isRollingOver}
              onCreateTestTasks={createTestTasks}
              isCreatingTestTasks={isCreatingTestTasks}
              selectedDate={selectedCalendarDateForTasks}
              onSelectDate={dateStr => setSelectedCalendarDateForTasks(dateStr)}
              onClearSelectedDate={() => setSelectedCalendarDateForTasks(null)}
              onSelectEvent={ev => {
                setSelectedEditEvent(ev);
                setIsAddModalOpen(true);
              }}
              onAddOnDate={dateStr => {
                setSelectedEditEvent(null);
                setAddModalDefaultDate(dateStr);
                setIsAddModalOpen(true);
              }}
              lastRolloverCount={lastRolloverReport?.googleTasksSyncedCount || 0}
            />
          ) : (
            <div className="space-y-4">
              {/* Event Cards List */}
              {filteredEvents.length === 0 ? (
                <div className="bg-[#151B2B] rounded-2xl border border-[#263047] p-12 text-center space-y-3">
                  <CalendarIcon className="w-10 h-10 text-[#94A3B8] mx-auto opacity-50" />
                  <h3 className="text-base font-bold text-[#F1F5F9]">Bu kriterlere uygun etkinlik bulunamadı</h3>
                  <p className="text-xs text-[#94A3B8]">Farklı bir arama yapabilir veya sol menüden "Tüm Takvim" filtresine geçebilirsiniz.</p>
                  <button
                    onClick={() => { setFilterProgram('all'); setFilterType('all'); setSearchQuery(''); }}
                    className="px-4 py-2 rounded-xl bg-[#6366F1] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    Filtreleri Sıfırla
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredEvents.map(event => (
                    <EventCard
                      key={event.id}
                      event={event}
                      user={user}
                      onSyncToGoogle={handleSyncToGoogle}
                      onRemoveFromGoogle={handleRemoveFromGoogle}
                      onToggleComplete={handleToggleComplete}
                      onEdit={ev => {
                        setSelectedEditEvent(ev);
                        setIsAddModalOpen(true);
                      }}
                      onDelete={handleDeleteEvent}
                      onUpdateReminder={handleUpdateReminder}
                      onUpdateDeliverable={handleUpdateDeliverable}
                      isSyncingThisEvent={syncingEventId === event.id}
                      hasConflict={conflictingEventIds.has(event.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* 4. Modals */}
      
      {/* Centralized Settings & Sync Modal */}
      <SettingsSyncModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        user={user}
        onLogin={handleLogin}
        onOpenBulkSyncModal={() => setIsBulkSyncModalOpen(true)}
        onOpenGmailModal={() => setIsGmailModalOpen(true)}
        onOpenAiModal={() => setIsAiModalOpen(true)}
        onOpenNotificationModal={() => setIsNotificationModalOpen(true)}
        onOpenConflictModal={() => setIsConflictModalOpen(true)}
        onDownloadAllICS={handleDownloadAllICS}
        onDownloadCSV={handleDownloadCSV}
        canInstallPWA={canInstallPWA}
        onInstallPWA={handleInstallPWA}
        totalEventsCount={totalCount}
        syncedEventsCount={syncedCount}
        conflictCount={conflicts.length}
        notificationPermission={notificationPermission}
        onTestMorningBriefing={handleTestMorningBriefing}
        isTestingBriefing={isTestingBriefing}
      />

      {/* Add / Edit Event Modal */}
      <AddEditEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveEvent}
        initialEvent={selectedEditEvent}
        defaultDate={addModalDefaultDate}
      />

      {/* Bulk Sync Modal */}
      <BulkSyncModal
        isOpen={isBulkSyncModalOpen}
        onClose={() => setIsBulkSyncModalOpen(false)}
        events={events}
        user={user}
        onLogin={handleLogin}
        onConfirmBulkSync={handleConfirmBulkSync}
        isSyncing={isSyncing}
      />

      {/* AI Parse Modal */}
      <AiParseModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onEventsParsed={handleEventsParsed}
      />

      {/* Gmail Modal */}
      <GmailModal
        isOpen={isGmailModalOpen}
        onClose={() => setIsGmailModalOpen(false)}
        user={user}
        onGoogleLogin={handleLogin}
        events={events}
      />

      {/* Notification Manager Modal */}
      <NotificationManagerModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
        events={events}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Conflict Manager Modal */}
      <ConflictModal
        isOpen={isConflictModalOpen}
        onClose={() => setIsConflictModalOpen(false)}
        conflicts={conflicts}
        onEditEvent={ev => {
          setIsConflictModalOpen(false);
          setSelectedEditEvent(ev);
          setIsAddModalOpen(true);
        }}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        confirmText={confirmConfig.confirmText}
        isDestructive={confirmConfig.isDestructive}
        onConfirm={() => {
          confirmConfig.onConfirm();
          setConfirmConfig(prev => ({ ...prev, isOpen: false }));
        }}
        onClose={() => setConfirmConfig(prev => ({ ...prev, isOpen: false }))}
      />

      {/* PDF Report & Documentation Modal */}
      <PdfReportModal
        isOpen={isPdfModalOpen}
        onClose={() => setIsPdfModalOpen(false)}
      />

      {/* Asenkron Olay Yöneticisi & SSE Kuyruk İzleme Modalı */}
      <QueueMonitorModal
        isOpen={isQueueModalOpen}
        onClose={() => setIsQueueModalOpen(false)}
        isConnected={isSSEConnected}
        lastPing={lastPing}
        jobs={queueJobs}
        stats={queueStats}
        notifications={liveNotifications}
        onSimulateScenario={simulateScenario}
        onClearCache={clearQueueCache}
        onRefresh={refreshJobs}
      />

      {/* Real-Time Live SSE Notification Toast (TYPE_1, TYPE_2, TYPE_3) */}
      {sseToast && (
        <div 
          onClick={() => {
            setIsQueueModalOpen(true);
            dismissSSEToast();
          }}
          className="fixed top-5 right-5 z-50 max-w-sm w-full bg-[#151B2B]/95 backdrop-blur-md border border-[#6366F1]/50 p-4 rounded-2xl shadow-2xl shadow-[#6366F1]/20 cursor-pointer animate-fade-in hover:border-[#6366F1] transition"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${
                sseToast.type === 'TASK_ASSIGNED' ? 'bg-indigo-400 animate-ping' :
                sseToast.type === 'ROLLOVER_COMPLETED' ? 'bg-amber-400' : 'bg-emerald-400'
              }`} />
              <span className="text-[11px] font-bold tracking-wider uppercase text-indigo-300">
                {sseToast.type === 'TASK_ASSIGNED' ? 'TYPE_1: YENİ GÖREV' :
                 sseToast.type === 'ROLLOVER_COMPLETED' ? 'TYPE_2: GÖREV DEVRİ' : 'TYPE_3: SABAH BRİFİNGİ'}
              </span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                dismissSSEToast();
              }}
              className="text-slate-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>
          <div className="mt-2 text-xs font-semibold text-white">
            {sseToast.message}
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
            <span>Kuyrukta incelemek için tıklayın</span>
            <span>{new Date(sseToast.timestamp).toLocaleTimeString('tr-TR')}</span>
          </div>
        </div>
      )}

    </div>
  );
}
