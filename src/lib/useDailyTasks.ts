import { useState, useEffect, useCallback } from 'react';
import { GoogleTaskItem, TaskPriority, RolloverReport } from '../types';
import { 
  listGoogleTasks, 
  insertGoogleTask, 
  updateGoogleTaskStatus, 
  deleteGoogleTask, 
  rolloverOverdueGoogleTasks, 
  createTestGoogleTasks,
  extractDateFromGoogleDue
} from './googleTasksService';

const STORAGE_KEY = 'app_google_tasks_cache_v2';
const LAST_ROLLOVER_KEY = 'app_google_tasks_last_rollover';

const INITIAL_SEED_TASKS: GoogleTaskItem[] = [
  {
    id: 'seed-gtask-1',
    title: '🐍 [Python 100 Gün] Temel Algoritma ve Veri Yapıları Ödevi',
    notes: 'Atıl Samancıoğlu Python Kampı 1. Modül kodlama pratiklerini bitir.',
    status: 'needsAction',
    due: '2026-08-28T00:00:00.000Z', // Dünden kalma (Otomatik rollover testi için)
    isRolledOver: true,
    rolledOverFrom: '2026-08-28',
    category: 'Python',
    source: 'google-tasks'
  },
  {
    id: 'seed-gtask-2',
    title: '🚀 [CareerGen] WhatsApp Takım A/B/C/D grubuna katıl & CV taslağını oluştur',
    notes: 'Kariyere İlk Adım Bootcamp 1. Hafta hazırlığı (career-gen.com).',
    status: 'needsAction',
    due: '2026-08-29T00:00:00.000Z',
    category: 'CareerGen',
    source: 'google-tasks'
  },
  {
    id: 'seed-gtask-3',
    title: '🤖 [PythianGo Masterclass] Veli Bahçeci & Neslişah Suiçmez oturum notlarını derle',
    notes: 'Yapay Zeka Masterclass 1. ve 2. canlı oturumları özeti.',
    status: 'needsAction',
    due: '2026-08-29T00:00:00.000Z',
    category: 'Yapay Zeka',
    source: 'google-tasks'
  },
  {
    id: 'seed-gtask-4',
    title: '🌍 COP31 Volunteers 1. Modül sınavını çöz ve sertifikayı al',
    notes: 'akademi.csb.gov.tr üzerinden İklim Değişikliği Temelleri eğitimi.',
    status: 'needsAction',
    due: '2026-08-30T00:00:00.000Z',
    category: 'COP31',
    source: 'google-tasks'
  },
  {
    id: 'seed-gtask-5',
    title: '🏆 TÜBİTAK 2209-A araştırma önerisi için danışman hoca ile görüş',
    notes: 'Yapay zeka ve sürdürülebilirlik odaklı proje önerisi taslağı.',
    status: 'needsAction',
    due: '2026-10-15T00:00:00.000Z',
    category: 'TÜBİTAK',
    source: 'google-tasks'
  }
];

export function useDailyTasks(accessToken?: string | null) {
  const [tasks, setTasks] = useState<GoogleTaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const missing = INITIAL_SEED_TASKS.filter(seed => !parsed.some((p: any) => p.id === seed.id));
        if (missing.length > 0) {
          const merged = [...parsed, ...missing];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse cached Google tasks from storage:', e);
    }
    return INITIAL_SEED_TASKS;
  });

  const [isSyncing, setIsSyncing] = useState(false);
  const [isRollingOver, setIsRollingOver] = useState(false);
  const [isCreatingTestTasks, setIsCreatingTestTasks] = useState(false);
  const [lastRolloverReport, setLastRolloverReport] = useState<RolloverReport | null>(null);

  // Save cache to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to cache tasks in localStorage:', e);
    }
  }, [tasks]);

  // Fetch Google Tasks from API when accessToken changes
  const fetchTasksFromGoogle = useCallback(async () => {
    if (!accessToken) return;

    setIsSyncing(true);
    try {
      const googleTasks = await listGoogleTasks(accessToken);
      if (googleTasks && googleTasks.length > 0) {
        setTasks(prev => {
          // Merge while keeping local seeds if needed
          const mergedMap = new Map<string, GoogleTaskItem>();
          googleTasks.forEach(gt => mergedMap.set(gt.id, gt));
          prev.forEach(lt => {
            if (!mergedMap.has(lt.id)) {
              mergedMap.set(lt.id, lt);
            }
          });
          return Array.from(mergedMap.values());
        });
      }
    } catch (err: any) {
      console.warn('Google Tasks fetch notice:', err.message);
    } finally {
      setIsSyncing(false);
    }
  }, [accessToken]);

  useEffect(() => {
    if (accessToken) {
      fetchTasksFromGoogle();
    }
  }, [accessToken, fetchTasksFromGoogle]);

  // Client-side automatic daily check & rollover trigger on startup
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const lastRolloverDate = localStorage.getItem(LAST_ROLLOVER_KEY);

    if (lastRolloverDate !== todayStr) {
      performAutomaticRollover(todayStr);
    }
  }, [accessToken]);

  const performAutomaticRollover = async (targetTodayDate?: string) => {
    const todayStr = targetTodayDate || new Date().toISOString().split('T')[0];
    setIsRollingOver(true);

    try {
      const result = await rolloverOverdueGoogleTasks(
        accessToken || '',
        tasks,
        todayStr
      );

      if (result.rolledOverCount > 0) {
        setTasks(result.updatedAllTasks);
        setLastRolloverReport({
          timestamp: new Date().toISOString(),
          targetDate: todayStr,
          rolledOverTasks: result.rolledOverTasks,
          googleTasksSyncedCount: result.rolledOverCount,
          message: `${result.rolledOverCount} adet dünden kalan görev bugüne devredildi.`
        });
      }

      localStorage.setItem(LAST_ROLLOVER_KEY, todayStr);
      return result;
    } catch (err) {
      console.error('Rollover error:', err);
    } finally {
      setIsRollingOver(false);
    }
  };

  // Add Task
  const addTask = async (params: {
    title: string;
    notes?: string;
    due?: string; // YYYY-MM-DD
  }) => {
    if (!params.title.trim()) return;

    if (accessToken) {
      try {
        const created = await insertGoogleTask(accessToken, {
          title: params.title.trim(),
          notes: params.notes,
          due: params.due
        });
        setTasks(prev => [created, ...prev]);
        return created;
      } catch (err) {
        console.warn('Fallback to local task addition:', err);
      }
    }

    // Local fallback addition
    const newTask: GoogleTaskItem = {
      id: `local-task-${Date.now()}`,
      title: params.title.trim(),
      notes: params.notes || '',
      status: 'needsAction',
      due: params.due ? `${params.due}T00:00:00.000Z` : undefined,
      category: 'Google Görev',
      source: 'local'
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  // Toggle Task Status (completed / needsAction)
  const toggleTask = async (taskId: string, isCompleted: boolean) => {
    // Optimistic UI update
    setTasks(prev =>
      prev.map(t => {
        if (t.id === taskId) {
          return {
            ...t,
            status: isCompleted ? 'completed' : 'needsAction',
            completed: isCompleted ? new Date().toISOString() : undefined
          };
        }
        return t;
      })
    );

    if (accessToken) {
      try {
        await updateGoogleTaskStatus(accessToken, taskId, isCompleted);
      } catch (err) {
        console.error('Google Tasks API status update failed:', err);
      }
    }
  };

  // Delete Task
  const deleteTask = async (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));

    if (accessToken) {
      try {
        await deleteGoogleTask(accessToken, taskId);
      } catch (err) {
        console.error('Google Tasks API delete failed:', err);
      }
    }
  };

  // Create Test Tasks (1 Yesterday + 1 Today)
  const handleCreateTestTasks = async () => {
    setIsCreatingTestTasks(true);
    try {
      if (accessToken) {
        const res = await createTestGoogleTasks(accessToken);
        if (res.createdTasks && res.createdTasks.length > 0) {
          setTasks(prev => [...res.createdTasks, ...prev]);
        }
        return res;
      } else {
        // Local simulation of test tasks
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        const localTestTasks: GoogleTaskItem[] = [
          {
            id: `test-yesterday-${Date.now()}`,
            title: '🐍 [Test Görevi] Dünden Kalan Python Alıştırması & OOP Vaka Analizi',
            notes: 'Bu görev dünün tarihiyle oluşturuldu. Otomatik Rollover (Dünden Bugüne Devir) mekanizmasını test etmek için eklendi.',
            due: `${yesterday}T00:00:00.000Z`,
            status: 'needsAction',
            category: 'Python',
            source: 'local'
          },
          {
            id: `test-today-${Date.now()}`,
            title: '🚀 [Test Görevi] Bugünün CareerGen & AI Masterclass Oturum Hazırlığı',
            notes: 'Bu görev bugünün tarihiyle oluşturuldu. Tamamlandı kutusunu işaretleyerek senkronizasyonu test edebilirsiniz.',
            due: `${todayStr}T00:00:00.000Z`,
            status: 'needsAction',
            category: 'CareerGen',
            source: 'local'
          }
        ];

        setTasks(prev => [...localTestTasks, ...prev]);
        return {
          success: true,
          createdTasks: localTestTasks,
          message: '🧪 2 Adet Test Görevi (1 Dün + 1 Bugün) yerel listeye eklendi! (Google ile giriş yaparak doğrudan Google Tasks hesabınıza da aktarabilirsiniz).'
        };
      }
    } finally {
      setIsCreatingTestTasks(false);
    }
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => extractDateFromGoogleDue(t.due) === todayStr && t.status === 'needsAction');
  const overdueTasks = tasks.filter(t => {
    const d = extractDateFromGoogleDue(t.due);
    return t.isRolledOver || (d && d < todayStr && t.status === 'needsAction');
  });

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    fetchTasksFromGoogle,
    triggerManualRollover: () => performAutomaticRollover(),
    createTestTasks: handleCreateTestTasks,
    isSyncing,
    isRollingOver,
    isCreatingTestTasks,
    lastRolloverReport,
    stats: {
      total: totalTasks,
      completed: completedTasks,
      pending: pendingTasks,
      completionPercentage,
      todayCount: todayTasks.length,
      overdueCount: overdueTasks.length
    }
  };
}
