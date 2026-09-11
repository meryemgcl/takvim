import { useState, useEffect } from 'react';
import { TaskItem, TaskPriority } from '../types';

const STORAGE_KEY = 'app_todo_tasks_v1';

const INITIAL_SEED_TASKS: TaskItem[] = [
  {
    id: 'task-seed-1',
    title: '🐍 PyCharm / VS Code ortamını kur ve ilk Python scriptini yaz',
    description: 'Atıl Samancıoğlu 100 Günlük Python Kampı 1. gün modülü ve temel değişkenler.',
    completed: false,
    dueDate: '2026-08-23',
    priority: 'high',
    category: 'Python',
    createdAt: '2026-08-22T10:00:00Z'
  },
  {
    id: 'task-seed-2',
    title: '🌐 Outreachy Kış Dönemi ön eleme formunu tamamla ($7000 Burs)',
    description: 'outreachy.org üzerinde motivasyon ve uygunluk formunu son tarihten önce teslim et.',
    completed: false,
    dueDate: '2026-08-30',
    priority: 'critical',
    category: 'Kariyer',
    createdAt: '2026-08-22T10:00:00Z'
  },
  {
    id: 'task-seed-3',
    title: '🌍 COP31 Volunteers 1. Modül sınavını çöz ve sertifikayı al',
    description: 'akademi.csb.gov.tr üzerinden İklim Değişikliği Temelleri eğitimini tamamla.',
    completed: false,
    dueDate: '2026-08-25',
    priority: 'medium',
    category: 'COP31',
    createdAt: '2026-08-22T10:00:00Z'
  },
  {
    id: 'task-seed-4',
    title: '🏆 TÜBİTAK 2209-A araştırma önerisi için danışman hoca ile görüş',
    description: 'Yapay zeka ve sürdürülebilirlik odaklı proje fikrinin taslak metnini hazırla.',
    completed: false,
    dueDate: '2026-10-15',
    priority: 'high',
    category: 'TÜBİTAK',
    createdAt: '2026-08-22T10:00:00Z'
  }
];

export function useTaskManager() {
  const [tasks, setTasks] = useState<TaskItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse todo tasks from storage:', e);
    }
    return INITIAL_SEED_TASKS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.error('Failed to save todo tasks to storage:', e);
    }
  }, [tasks]);

  const addTask = (params: {
    title: string;
    description?: string;
    dueDate?: string;
    priority?: TaskPriority;
    category?: string;
    linkedEventId?: string;
  }) => {
    if (!params.title.trim()) return null;

    const newTask: TaskItem = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: params.title.trim(),
      description: params.description?.trim() || '',
      completed: false,
      dueDate: params.dueDate || undefined,
      priority: params.priority || 'medium',
      category: params.category || 'Genel',
      createdAt: new Date().toISOString(),
      linkedEventId: params.linkedEventId
    };

    setTasks(prev => [newTask, ...prev]);
    return newTask;
  };

  const toggleTask = (id: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === id) {
          const nextCompleted = !task.completed;
          return {
            ...task,
            completed: nextCompleted,
            completedAt: nextCompleted ? new Date().toISOString() : undefined
          };
        }
        return task;
      })
    );
  };

  const updateTask = (id: string, updates: Partial<Omit<TaskItem, 'id' | 'createdAt'>>) => {
    setTasks(prev =>
      prev.map(task => (task.id === id ? { ...task, ...updates } : task))
    );
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const clearCompletedTasks = () => {
    setTasks(prev => prev.filter(task => !task.completed));
  };

  // Helper to get task count for a given YYYY-MM-DD
  const getTasksForDate = (dateStr: string) => {
    const cleanDate = dateStr.split('T')[0];
    return tasks.filter(t => t.dueDate && t.dueDate.split('T')[0] === cleanDate);
  };

  // Stats calculation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.dueDate && t.dueDate.split('T')[0] === todayStr && !t.completed);
  const overdueTasks = tasks.filter(t => t.dueDate && t.dueDate.split('T')[0] < todayStr && !t.completed);

  return {
    tasks,
    addTask,
    toggleTask,
    updateTask,
    deleteTask,
    clearCompletedTasks,
    getTasksForDate,
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
