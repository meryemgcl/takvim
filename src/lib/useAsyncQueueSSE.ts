import { useState, useEffect, useCallback, useRef } from 'react';

export interface LiveNotificationItem {
  id: string;
  type: 'TASK_ASSIGNED' | 'ROLLOVER_COMPLETED' | 'MORNING_BRIEFING';
  message: string;
  timestamp: string;
  data?: any;
}

export interface QueueJobItem {
  id: string;
  source: 'gmail' | 'podio' | 'calendar' | 'manual_webhook' | 'cron';
  status: 'QUEUED' | 'EXTRACTING' | 'VALIDATING' | 'CACHE_LOOKUP' | 'SYNCING' | 'COMPLETED' | 'CACHE_HIT' | 'FAILED';
  currentStep: 'a_extraction' | 'b_validation' | 'c_cache_lookup' | 'd_google_sync' | 'e_sse_notification';
  createdAt: string;
  updatedAt: string;
  durationMs?: number;
  extracted?: {
    subject: string;
    sender: string;
    extractedDate: string;
    extractedTime: string | null;
    rawTextPreview: string;
  };
  validatedTask?: {
    id: string;
    title: string;
    dueDate: string;
    dueTime: string | null;
    category: string;
    priority: string;
    priorityBadge: string;
    subtasks: string[];
    repairsApplied: string[];
  };
  cacheLookup?: {
    cacheKey: string;
    isHit: boolean;
    reason: string;
    originalJobId?: string;
  };
  googleSyncResult?: {
    synced: boolean;
    taskId?: string;
    message: string;
  };
  liveNotification?: {
    type: string;
    badge: string;
    message: string;
    timestamp: string;
  };
  logs: Array<{ timestamp: string; step: string; message: string; type?: 'info' | 'warn' | 'success' | 'error' }>;
  error?: string;
}

export interface QueueStats {
  totalJobs: number;
  queued: number;
  completed: number;
  cacheHits: number;
  failed: number;
  activeClients: number;
  smartCacheEntries: number;
}

export function useAsyncQueueSSE(onLiveNotification?: (notif: LiveNotificationItem) => void) {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [lastPing, setLastPing] = useState<Date | null>(null);
  const [jobs, setJobs] = useState<QueueJobItem[]>([]);
  const [stats, setStats] = useState<QueueStats | null>(null);
  const [notifications, setNotifications] = useState<LiveNotificationItem[]>([]);
  const [activeToast, setActiveToast] = useState<LiveNotificationItem | null>(null);

  const eventSourceRef = useRef<EventSource | null>(null);
  const callbackRef = useRef(onLiveNotification);
  callbackRef.current = onLiveNotification;

  // Kuyruk durumunu backend'den çek
  const fetchJobsAndStats = useCallback(async () => {
    try {
      const res = await fetch('/api/queue/jobs');
      if (res.ok) {
        const data = await res.json();
        if (data.jobs) setJobs(data.jobs);
        if (data.stats) setStats(data.stats);
      }
    } catch (err) {
      console.warn('[Queue SSE] Fetch jobs failed:', err);
    }
  }, []);

  // SSE bağlantısını kur
  useEffect(() => {
    let reconnectTimeout: any;

    const connectSSE = () => {
      try {
        const es = new EventSource('/api/events/live-stream');
        eventSourceRef.current = es;

        es.onopen = () => {
          setIsConnected(true);
          fetchJobsAndStats();
        };

        es.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data);

            if (payload.type === 'PING') {
              setLastPing(new Date());
              return;
            }

            // Canlı Bildirim Tipleri: TYPE_1, TYPE_2, TYPE_3
            if (['TASK_ASSIGNED', 'ROLLOVER_COMPLETED', 'MORNING_BRIEFING'].includes(payload.type)) {
              const notif: LiveNotificationItem = {
                id: `notif_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
                type: payload.type,
                message: payload.message,
                timestamp: payload.timestamp || new Date().toISOString(),
                data: payload.data
              };

              setNotifications(prev => [notif, ...prev.slice(0, 40)]);
              setActiveToast(notif);

              if (callbackRef.current) {
                callbackRef.current(notif);
              }
            }

            // Kuyruk ve İş İlerleme Olayları
            if (payload.type === 'JOB_PROGRESS' || payload.type === 'QUEUE_UPDATE') {
              if (payload.data?.job) {
                const updatedJob = payload.data.job;
                setJobs(prev => {
                  const idx = prev.findIndex(j => j.id === updatedJob.id);
                  if (idx !== -1) {
                    const copy = [...prev];
                    copy[idx] = updatedJob;
                    return copy;
                  }
                  return [updatedJob, ...prev];
                });
              }
              fetchJobsAndStats();
            }
          } catch (e) {
            console.warn('[Queue SSE] Parse message error:', e);
          }
        };

        es.onerror = () => {
          setIsConnected(false);
          es.close();
          // 3 saniye sonra yeniden bağlanmayı dene
          reconnectTimeout = setTimeout(connectSSE, 3000);
        };
      } catch (err) {
        console.warn('[Queue SSE] Connection init error:', err);
        setIsConnected(false);
        reconnectTimeout = setTimeout(connectSSE, 4000);
      }
    };

    connectSSE();
    fetchJobsAndStats();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, [fetchJobsAndStats]);

  // Toast'ı 7 saniye sonra otomatik kapat
  useEffect(() => {
    if (activeToast) {
      const timer = setTimeout(() => {
        setActiveToast(null);
      }, 7000);
      return () => clearTimeout(timer);
    }
  }, [activeToast]);

  // Senaryo Simülasyonu
  const simulateScenario = async (scenario: string, extra: any = {}) => {
    try {
      const res = await fetch('/api/queue/simulate-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, ...extra })
      });
      const data = await res.json();
      fetchJobsAndStats();
      return data;
    } catch (err: any) {
      console.error('Simulate scenario failed:', err);
      throw err;
    }
  };

  // Manuel Webhook Gönderimi
  const triggerWebhook = async (payload: any) => {
    try {
      const res = await fetch('/api/queue/webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      fetchJobsAndStats();
      return data;
    } catch (err: any) {
      console.error('Trigger webhook failed:', err);
      throw err;
    }
  };

  // Önbellek Sıfırlama
  const clearCache = async () => {
    try {
      const res = await fetch('/api/queue/clear-cache', { method: 'POST' });
      const data = await res.json();
      fetchJobsAndStats();
      return data;
    } catch (err) {
      console.error('Clear cache failed:', err);
    }
  };

  return {
    isConnected,
    lastPing,
    jobs,
    stats,
    notifications,
    activeToast,
    dismissToast: () => setActiveToast(null),
    simulateScenario,
    triggerWebhook,
    clearCache,
    refreshJobs: fetchJobsAndStats
  };
}
